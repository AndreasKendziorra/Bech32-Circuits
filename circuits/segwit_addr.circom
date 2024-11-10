pragma circom 2.0.0;

include "bech32.circom";

template decode(hrp_length, addr_length) {
    var data_length = addr_length - hrp_length - 1 - 6;
    var decoded_length;
    if (data_length <= 0) {
        decoded_length = 0;
    }
    else {
        decoded_length = compute_cb_output_length(data_length - 1, 5, 8, 0);
    }

    signal input hrp[hrp_length];
    signal input addr[addr_length];
    signal output witver;
    signal output witprog[decoded_length];
    signal output valid_input;

    if (decoded_length < 2 || decoded_length > 40) {
        witver <== 0;
        for (var i = 0; i < decoded_length; i++) {
            witprog[i] <== 0;
        }
        valid_input <== 0;
    }
    else {
        signal hrp_got[hrp_length];
        signal data[data_length];
        signal valid_addr;

        (hrp_got, data, valid_addr) <== bech32_decode(hrp_length, addr_length)(addr);

        signal hrp_eqs[hrp_length];
        for (var i = 0; i < hrp_length; i++) {
            hrp_eqs[i] <== IsEqual()([hrp[i], hrp_got[i]]);
        }
        signal hrp_eqs_sum <== SUM(hrp_length)(hrp_eqs);
        signal matching_hrps <== IsEqual()([hrp_length, hrp_eqs_sum]);

        signal decoded[decoded_length];
        signal valid_decoding;
        component cv_bits = convert_bits_without_pad(data_length - 1, 5, 8);
        for (var i = 0; i < data_length - 1; i++) {
            cv_bits.data[i] <== data[i + 1];
        }
        decoded <== cv_bits.out;
        valid_decoding <== cv_bits.is_valid;

        signal witver_small_enough <== LessEqThan(8)([data[0], 16]);
        signal wrong_data_length_for_witver0;
        if (decoded_length != 20 && decoded_length != 32) {
            wrong_data_length_for_witver0 <== IsZero()(data[0]);
        }
        else {
            wrong_data_length_for_witver0 <== 0;
        }
        signal not_wrong_data_length_for_witver0 <== NOT()(wrong_data_length_for_witver0);

        signal conditions[5] <== [valid_addr, matching_hrps, valid_decoding, witver_small_enough, not_wrong_data_length_for_witver0];

        valid_input <== MultiAND(5)(conditions);
        witver <== valid_input * data[0];
        for (var i = 0; i < decoded_length; i++) {
            witprog[i] <== valid_input * decoded[i];
        }
    }
}

template encode(hrp_length, witprog_length) {

    var witprog_length_cb = compute_cb_output_length(witprog_length, 8, 5, 1);
    var data_length = 1 + witprog_length_cb;
    var output_length = compute_bech32_encode_output_length(hrp_length, data_length);

    signal input hrp[hrp_length];
    signal input witver;
    signal input witprog[witprog_length];
    signal output out[output_length];
    signal output success;

    signal witprog_cb[witprog_length_cb] <== convert_bits_with_pad(witprog_length, 8, 5)(witprog);
    signal data[data_length];
    data[0] <== witver;
    for (var i = 0; i < witprog_length_cb; i++) {
        data[1 + i] <== witprog_cb[i];
    }

    signal enc_out[output_length];
    enc_out <== bech32_encode(hrp_length, data_length)(hrp, data);

    (_, _, success) <== decode(hrp_length, output_length)(hrp, enc_out);

    for (var i = 0; i < output_length; i++) {
        out[i] <== success * enc_out[i];
    }
}