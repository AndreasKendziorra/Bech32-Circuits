pragma circom 2.0.0;


// maps integers 0,...,31 to the following characters:
// qpzry9x8gf2tvdw0s3jn54khce6mua7l
// i.e., 0 is mapped to q, 1 to p, etc
template char_encoding() {
    signal input number;
    signal output character;

    var chars[32] = [
        113, 112, 122, 114, 121,  57, 120,  56,
        103, 102,  50, 116, 118, 100, 119,  48,
        115,  51, 106, 110,  53,  52, 107, 104,
         99, 101,  54, 109, 117,  97,  55, 108
    ];

    signal sums[33];
    signal eqs[32];
    sums[0] <== 0;

    for (var i = 0; i < 32; i++) {
        eqs[i] <== IsEqual()([i, number]);
        sums[i + 1] <== sums[i] + eqs[i] * chars[i];
    }

    character <== sums[32];
}

template rev_char_encoding() {
    signal input character;
    signal output number;
    signal output is_not_valid;
    signal output is_lower;
    signal output is_upper;

    var chars_rev[128] = [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        15, -1, 10, 17, 21, 20, 26, 30,  7,  5, -1, -1, -1, -1, -1, -1,
        -1, 29, -1, 24, 13, 25,  9,  8, 23, -1, 18, 22, 31, 27, 19, -1,
         1,  0,  3, 16, 11, 28, 12, 14,  6,  4,  2, -1, -1, -1, -1, -1,
        -1, 29, -1, 24, 13, 25,  9,  8, 23, -1, 18, 22, 31, 27, 19, -1,
         1,  0,  3, 16, 11, 28, 12, 14,  6,  4,  2, -1, -1, -1, -1, -1
    ];

    var valid_chars[55] = [
         48,  50,  51,  52,  53,  54,  55,  56,  57,  65,
         67,  68,  69,  70,  71,  72,  74,  75,  76,  77, 
         78,  80,  81,  82,  83,  84,  85,  86,  87,  88,
         89,  90,  97,  99, 100, 101, 102, 103, 104, 106,
        107, 108, 109, 110, 112, 113, 114, 115, 116, 117,
        118, 119, 120, 121, 122
    ];
    var valid_upper_chars[23] = [ 
         65,  67,  68,  69,  70,  71,  72,  74,  75,  76,
         77,  78,  80,  81,  82,  83,  84,  85,  86,  87,
         88,  89,  90
    ];
    var valid_lower_chars[23] = [ 
         97,  99, 100, 101, 102, 103, 104, 106, 107, 108,
        109, 110, 112, 113, 114, 115, 116, 117, 118, 119,
        120, 121, 122
    ];

    signal eqs[55];
    signal sums[56];
    sums[0] <== 0;

    // iterate through all valid characters
    for (var i = 0; i < 55; i++) {
        eqs[i] <== IsEqual()([character, valid_chars[i]]);
        // we take (chars_rev[x] + 1) to ensure that a valid char will result in a non-zero sum 
        sums[i + 1] <== sums[i] + eqs[i] * (chars_rev[valid_chars[i]] + 1);
    }
    is_not_valid <== IsZero()(sums[55]);

    number <== (1 - is_not_valid) * (sums[55] - 1);

    signal lows[23];
    signal ups[23];
    // iterate through all upper/lowercase letters
    for (var i = 0; i < 23; i++) {
        ups[i] <== IsEqual()([character, valid_upper_chars[i]]);
        lows[i] <== IsEqual()([character, valid_lower_chars[i]]);
    }
    signal lows_sums <== SUM(23)(lows);
    signal ups_sums <== SUM(23)(ups);

    is_upper <== ups_sums;
    is_lower <== lows_sums;
}
