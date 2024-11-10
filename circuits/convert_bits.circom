pragma circom 2.0.0;


// compute output length of convert_bits_ templates
function compute_cb_output_length(data_length, frombits, tobits, padding) {
    var bitlength = data_length * frombits;
    if (bitlength % tobits == 0) {
        return bitlength\tobits;
    }
    if (padding) {
        return bitlength\tobits + 1;
    }
    else {
        return bitlength\tobits;
    }
}

template convert_bits_with_pad(data_length, frombits, tobits) {
    var output_length = compute_cb_output_length(data_length, frombits, tobits, 1);
    
    signal input data[data_length];
    signal output out[output_length];

    signal input_in_bits[data_length][frombits];
    signal output_in_bits[output_length][tobits];
    signal all_bits[output_length * tobits];

    for (var i = 0; i < data_length; i++) {
        input_in_bits[i] <== Num2Bits(frombits)(data[i]);
        for (var j = 0; j < frombits; j++) {
            all_bits[(i + 1) * frombits - j - 1] <== input_in_bits[i][j];
        }
    }

    // padding
    for (var i = data_length * frombits; i < output_length * tobits; i++) {
        all_bits[i] <== 0;
    }

    for (var i = 0; i < output_length; i++) {
        for (var j = 0; j < tobits; j++) {
            output_in_bits[i][j] <== all_bits[(i + 1) * tobits - j - 1];
        }
        out[i] <== Bits2Num(tobits)(output_in_bits[i]);
    }
}

template convert_bits_without_pad(data_length, frombits, tobits) {
    var output_length = compute_cb_output_length(data_length, frombits, tobits, 0);
    
    signal input data[data_length];
    signal output out[output_length];
    signal output is_valid;
    signal input_in_bits[data_length][frombits];
    signal output_in_bits[output_length][tobits];
    signal all_bits[data_length * frombits];

    for (var i = 0; i < data_length; i++) {
        input_in_bits[i] <== Num2Bits(frombits)(data[i]);
        for (var j = 0; j < frombits; j++) {
            all_bits[(i + 1) * frombits - j - 1] <== input_in_bits[i][j];
        }
    }

    var nr_remaining_bits = data_length * frombits - output_length * tobits;
    signal too_many_remaining_bits <== GreaterEqThan(4)([nr_remaining_bits, frombits]);
    signal remaining_bits_non_zero;
    if (nr_remaining_bits == 0) {
        remaining_bits_non_zero <== 0;
    }
    else {
        signal remaining_bits[nr_remaining_bits];
        component sum_remaining_bits = SUM(nr_remaining_bits);
        for (var i = 0; i < nr_remaining_bits; i++) {
            sum_remaining_bits.in[i] <== all_bits[output_length * tobits + i];
        }
        signal sum <== sum_remaining_bits.out;
        signal sum_is_zero <== IsZero()(sum);
        remaining_bits_non_zero <== NOT()(sum_is_zero);
    }

    is_valid <== NOR()(too_many_remaining_bits, remaining_bits_non_zero);

    for (var i = 0; i < output_length; i++) {
        for (var j = 0; j < tobits; j++) {
            output_in_bits[i][j] <== all_bits[(i + 1) * tobits - j - 1];
        }
        out[i] <== Bits2Num(tobits)(output_in_bits[i]);
    }
}