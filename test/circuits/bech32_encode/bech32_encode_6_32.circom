pragma circom 2.0.0;

include "../../../circuits/bech32.circom";

component main = bech32_encode(6, 32);