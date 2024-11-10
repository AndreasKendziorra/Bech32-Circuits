pragma circom 2.0.0;

template SUM(n) {
    signal input in[n];
    signal output out;

    signal sums[n];
    sums[0] <== in[0];
    for (var i = 1; i < n; i++) {
        sums[i] <== sums[i - 1] + in [i];
    }
    out <== sums[n - 1];
}

template char_to_lower() {
    signal input c;
    signal output out;

    signal geq_A <== GreaterEqThan(8)([c, 65]);
    signal leq_Z <== LessEqThan(8)([c, 90]);
    signal is_upper <== AND()(geq_A, leq_Z);
    signal lower_c_term <== is_upper * (c + 32);
    out <== lower_c_term + (1 - is_upper) * c;
}

template bin_right_shift_25() {
    signal input values[30];
    signal output out[5];

    for (var i = 0; i < 5; i++) {
        out[i] <== values[i + 25];
    }
}