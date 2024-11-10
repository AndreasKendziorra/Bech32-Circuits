pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/gates.circom";
include "char_encoding.circom";
include "convert_bits.circom";
include "utils.circom";

// performs ((c & 0x1ffffff) << 5) ^ v on a 30-bit integer x and 5-bit integer v
// which corresponds to computing c1*x^5 + c2*x^4 + c3*x^3 + c4*x^2 + c5*x + v
template append_new_value() {
    signal input c[30];
    signal input v[5];
    signal output out[30];

    for (var i = 0; i < 5; i++) {
        out[i] <== v[i];
    }
    for (var i = 0; i < 25; i++) {
        out[i + 5] <== c[i];
    }
}

template polymod_bin(input_length) {
    signal input values[input_length];
    signal output out[30];

    var GEN[5][30] = [
        [0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
        [1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1],
        [0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1],
        [1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1]
    ];

    signal cs[input_length + 1][6][30];     // the intermediate polynomials c(x), each mod g(x), in binary format
                                            // cs[i][0] will be used to compute ((c & 0x1ffffff) << 5) ^ v_i
                                            // cs[i][j] for c ^ GEN[j-1] for j=1,...,5
    signal xored_vals[input_length][6][30];
    signal xored_terms[input_length][6][30];
    signal c_zeros[input_length][5];        // the coefficient c_0 for each intermediate polynomial in binary format
    signal vs[input_length][5];             // the input values in binary format

    cs[0][5] <== Num2Bits(30)(1);           // first intermediate polynomial is c(x) =  1

    for (var i = 0; i < input_length; i++) {
        var final_c_from_prev_iteration[30] = cs[i][5];
        c_zeros[i] <== bin_right_shift_25()(final_c_from_prev_iteration); // c_0 = c >> 25;
        vs[i] <== Num2Bits(5)(values[i]);
        cs[i + 1][0] <== append_new_value()(final_c_from_prev_iteration, vs[i]); // ((c & 0x1ffffff) << 5) ^ v_i;

        for (var j = 0; j < 5; j++) {
            for (var k = 0; k < 30; k++) {
                var condition = c_zeros[i][j];
                xored_vals[i][j][k] <== XOR()(cs[i + 1][j][k], GEN[j][k]);
                xored_terms[i][j][k] <== condition * xored_vals[i][j][k];
                cs[i + 1][j + 1][k] <==  xored_terms[i][j][k] + (1 - condition) * cs[i + 1][j][k];
            }
        }
    }

    out <== cs[input_length][5];
}

template hrp_expand(hrp_length) {
    signal input hrp[hrp_length];
    signal output out[2 * hrp_length + 1];

    signal hrp_bits[hrp_length][7];
    for (var i = 0; i < hrp_length; i++) {
        hrp_bits[i] <== Num2Bits(7)(hrp[i]);
        out[i] <== Bits2Num(2)([hrp_bits[i][5], hrp_bits[i][6]]); // hrp[i] >> 5
        out[i + hrp_length + 1] <== Bits2Num(5)(
            [hrp_bits[i][0], hrp_bits[i][1], hrp_bits[i][2], hrp_bits[i][3], hrp_bits[i][4]]
        ); // hrp[i] & 0x1f
    }
    out[hrp_length] <== 0;
}

template create_checksum(hrp_length, data_length) {
    signal input hrp[hrp_length];
    signal input data[data_length];
    signal output cs[6];

    var expanded_hrp_length = 2 * hrp_length + 1;

    signal expanded_hrp[expanded_hrp_length] <== hrp_expand(hrp_length)(hrp);

    var polymod_input_length = expanded_hrp_length + data_length + 6;

    signal polymod_input[polymod_input_length];
    for (var i = 0; i < expanded_hrp_length; i++) {
        polymod_input[i] <== expanded_hrp[i];
    }
    for (var i = 0; i < data_length; i++) {
        polymod_input[expanded_hrp_length + i] <== data[i];
    }
    for (var i = 0; i < 6; i++) {
        polymod_input[expanded_hrp_length + data_length + i] <== 0;
    }

    signal polymod[30] <== polymod_bin(polymod_input_length)(polymod_input);

    // this loop computes only the first 5 elements of the checksum;
    // the last element must be computed differently
    for (var i = 0; i < 5; i++) {
        cs[i] <== Bits2Num(5)(
            [polymod[25 - 5 * i], polymod[25 - 5 * i + 1], polymod[25 - 5 * i + 2],
            polymod[25 - 5 * i + 3], polymod[25 - 5 * i + 4]]
        );
    }

    signal lsb <== XOR()(polymod[0], 1);
    cs[5] <== Bits2Num(5)([lsb, polymod[1], polymod[2], polymod[3], polymod[4]]);

}

template bech32_verify_checksum(hrp_length, data_length) {
    signal input hrp[hrp_length];
    signal input data[data_length];
    signal output is_valid;

    var expanded_hrp_length = 2 * hrp_length + 1;
    signal expanded_hrp[expanded_hrp_length] <== hrp_expand(hrp_length)(hrp);
    signal polymod_input[expanded_hrp_length + data_length];
    for (var i = 0; i < expanded_hrp_length; i++) {
        polymod_input[i] <== expanded_hrp[i];
    }
    for (var i = 0; i < data_length; i++) {
        polymod_input[expanded_hrp_length + i] <== data[i];
    }
    signal polymod[30] <== polymod_bin(expanded_hrp_length + data_length)(polymod_input);
    signal polymod_int <== Bits2Num(30)(polymod);
    is_valid <== IsEqual()([polymod_int, 1]);
}

function compute_bech32_encode_output_length(hrp_length, data_length) {
    return hrp_length + data_length + 7; // hrp || 1 || data || 6 digit checksum
}

// ensure that all characters of the human readable part are in the range [33, 126]
template satisfies_hrp_character_set(hrp_length) {
    signal input hrp[hrp_length];

    signal hrp_satisfies_lb[hrp_length];
    signal hrp_satisfies_ub[hrp_length];
    for (var i = 0; i < hrp_length; i++) {
        hrp_satisfies_lb[i] <== GreaterEqThan(7)([hrp[i], 33]);
        hrp_satisfies_ub[i] <== LessEqThan(7)([hrp[i], 126]);
        1 === hrp_satisfies_lb[i] * hrp_satisfies_ub[i];
    }
}

template bech32_encode(hrp_length, data_length) {
    signal input hrp[hrp_length];
    signal input data[data_length]; // array of 5-bit integers
    var output_length = compute_bech32_encode_output_length(hrp_length, data_length);
    signal output out[output_length];

    satisfies_hrp_character_set(hrp_length)(hrp);

    // ensure that all elements of data are 5-bit integers
    signal data_satisfies_lb[data_length];
    signal data_satisfies_up[data_length];
    for (var i = 0; i < data_length; i++) {
        _ <== Num2Bits(5)(data[i]);
    }

    signal checksum[6] <== create_checksum(hrp_length, data_length)(hrp, data);

    for (var i = 0; i < hrp_length; i++) {
        out[i] <== hrp[i];
    }
    out[hrp_length] <== 49; // '1'
    for (var i = 0; i < data_length; i++) {
        out[hrp_length + 1 + i] <== char_encoding()(data[i]);
    }
    for (var i = 0; i < 6; i++) {
        out[hrp_length + 1 + data_length + i] <== char_encoding()(checksum[i]);
    }

}

template bech32_decode(hrp_length, input_length) {
    signal input bech[input_length];
    signal output hrp[hrp_length];

    var data_length = input_length - hrp_length - 1;
    var out_data_length = data_length >= 6 ? data_length - 6 : 0;
    signal output data[out_data_length];
    signal output valid; // we output additionally a boolean to indicate if the input was valid

    if ((hrp_length == 0) || (hrp_length + 7 > input_length) || (input_length > 90)) {
        for (var i = 0; i < hrp_length; i++) {
            hrp[i] <== 0;
        }
        for (var i = 0; i < out_data_length; i++) {
            data[i] <== 0;
        }
        valid <== 0;
    }
    else {
        signal hrp_satisfies_lb[hrp_length];
        signal hrp_satisfies_ub[hrp_length];
        signal hrp_satisfies_both_bounds[hrp_length];
        var unicode_max_bit_length = 21;
        for (var i = 0; i < hrp_length; i++) {
            hrp_satisfies_lb[i] <== GreaterEqThan(unicode_max_bit_length)([bech[i], 33]);
            hrp_satisfies_ub[i] <== LessEqThan(unicode_max_bit_length)([bech[i], 126]);
            hrp_satisfies_both_bounds[i] <== AND()(hrp_satisfies_lb[i], hrp_satisfies_ub[i]);
        }
        signal valid_hrp <== MultiAND(hrp_length)(hrp_satisfies_both_bounds);
        signal valid_separator <== IsEqual()([bech[hrp_length], 49]); // separator must be '1', i.e. 49 
        signal valid_data_encoding;
        signal valid_checksum;

        // If the hrp was not valid, we will take the array [0, 0, ..., 0] instead of
        // the input hrp (which is [bech[0], ..., bech[hrp_length]]) for the following
        // computations. Therefore, we can safely assume that all hrp characters are at
        // most 7-bit integers instead of up to 21-bit integers (unicode characters can
        // take up to 21 bits) in the following computations. It's also safe, as we will 
        // only return zeros for hrp and data if the input hrp was invalid.
        signal tmp_hrp[hrp_length];
        for (var i = 0; i < hrp_length; i++) {
            tmp_hrp[i] <== valid_hrp * bech[i];
        }

        signal lowers[data_length];
        signal uppers[data_length];
        signal invalid_data_chars[data_length];
        signal decoded_data[data_length];
        for (var i = 0; i < data_length; i++) {
            (decoded_data[i], invalid_data_chars[i], lowers[i], uppers[i]) <== rev_char_encoding()(bech[hrp_length + 1 + i]);
        }

        signal lowers_sum <== SUM(data_length)(lowers);
        signal uppers_sum <== SUM(data_length)(uppers);
        signal invalid_chars_sum <== SUM(data_length)(invalid_data_chars);

        signal has_no_lowers <== IsZero()(lowers_sum);
        signal has_no_uppers <== IsZero()(uppers_sum);
        signal not_mixing_uppers_and_lowers <== OR()(has_no_lowers, has_no_uppers);
        signal only_valid_chars <== IsZero()(invalid_chars_sum);
        valid_data_encoding <== AND()(not_mixing_uppers_and_lowers, only_valid_chars);

        component verify_cs = bech32_verify_checksum(hrp_length, data_length);
        verify_cs.data <== decoded_data;
        signal lower_hrp[hrp_length];
        for (var i = 0; i < hrp_length; i++) {
            lower_hrp[i] <== char_to_lower()(tmp_hrp[i]);
            verify_cs.hrp[i] <== lower_hrp[i];
        }
        valid_checksum <== verify_cs.is_valid;

        signal conditions[4] <==[valid_hrp, valid_separator, valid_data_encoding, valid_checksum];
        valid <== MultiAND(4)(conditions);

        for (var i = 0; i < hrp_length; i++) {
            hrp[i] <== valid * lower_hrp[i];
        }
        for (var i = 0; i < out_data_length; i++) {
            data[i] <== valid * decoded_data[i];
        }
    }
}
