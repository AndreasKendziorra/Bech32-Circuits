const path = require("path");
const wasm_tester = require("circom_tester").wasm;

const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");

function stringToAsciiArray(str) {
    return Array.from(str).map(char => char.charCodeAt(0));
}

describe("Bech32", function () {
    this.timeout(100000);

    describe("Decoding", function () {

        before(async () => {
            circuit_dec_1_8 = await wasm_tester(
                path.join(__dirname, "circuits", "bech32_decode", "bech32_decode_1_8.circom")
            );
            circuit_dec_1_9 = await wasm_tester(
                path.join(__dirname, "circuits", "bech32_decode", "bech32_decode_1_9.circom")
            );
            circuit_dec_2_8 = await wasm_tester(
                path.join(__dirname, "circuits", "bech32_decode", "bech32_decode_2_8.circom")
            );
            circuit_dec_2_9 = await wasm_tester(
                path.join(__dirname, "circuits", "bech32_decode", "bech32_decode_2_9.circom")
            );
            circuit_dec_83_90 = await wasm_tester(
                path.join(__dirname, "circuits", "bech32_decode", "bech32_decode_83_90.circom")
            );
            circuit_dec_6_45 = await wasm_tester(
                path.join(__dirname, "circuits", "bech32_decode", "bech32_decode_6_45.circom")
            );
            circuit_dec_1_90 = await wasm_tester(
                path.join(__dirname, "circuits", "bech32_decode", "bech32_decode_1_90.circom")
            );
            circuit_dec_5_60 = await wasm_tester(
                path.join(__dirname, "circuits", "bech32_decode", "bech32_decode_5_60.circom")
            );
            circuit_dec_84_91 = await wasm_tester(
                path.join(__dirname, "circuits", "bech32_decode", "bech32_decode_84_91.circom")
            );
            circuit_dec_0_13 = await wasm_tester(
                path.join(__dirname, "circuits", "bech32_decode", "bech32_decode_0_13.circom")
            );
        });

        it("Should decode valid checksum with only upper case letters", async function () {
            const addr = "A12UEL5L";
            const int_addr = stringToAsciiArray(addr);
            const expected_hrp = stringToAsciiArray("a");
            const w = await circuit_dec_1_8.calculateWitness({ "bech": int_addr });
            await circuit_dec_1_8.checkConstraints(w);
            await circuit_dec_1_8.assertOut(w, { valid: 1, hrp: expected_hrp, data: [] });
        });

        it("Should decode valid checksum with only lower case letters", async function () {
            const addr = "a12uel5l";
            const int_addr = stringToAsciiArray(addr);
            const expected_hrp = stringToAsciiArray("a");
            const w = await circuit_dec_1_8.calculateWitness({ "bech": int_addr });
            await circuit_dec_1_8.checkConstraints(w);
            await circuit_dec_1_8.assertOut(w, { valid: 1, hrp: expected_hrp, data: [] });
        });

        it("Should decode valid checksum with long hrp", async function () {
            const addr = "an83characterlonghumanreadablepartthatcontainsthenumber1andtheexcludedcharactersbio1tt5tgs";
            const int_addr = stringToAsciiArray(addr);
            const expected_hrp = stringToAsciiArray("an83characterlonghumanreadablepartthatcontainsthenumber1andtheexcludedcharactersbio");
            const w = await circuit_dec_83_90.calculateWitness({ "bech": int_addr });
            await circuit_dec_83_90.checkConstraints(w);
            await circuit_dec_83_90.assertOut(w, { valid: 1, hrp: expected_hrp, data: [] });
        });

        it("Should decode valid checksum", async function () {
            const addr = "abcdef1qpzry9x8gf2tvdw0s3jn54khce6mua7lmqqqxw";
            const int_addr = stringToAsciiArray(addr);
            const expected_hrp = stringToAsciiArray("abcdef");
            const expected_data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
            const w = await circuit_dec_6_45.calculateWitness({ "bech": int_addr });
            await circuit_dec_6_45.checkConstraints(w);
            await circuit_dec_6_45.assertOut(w, { valid: 1, hrp: expected_hrp, data: expected_data });
        });

        it("Should decode valid checksum with long data part", async function () {
            const addr = "11qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqc8247j";
            const int_addr = stringToAsciiArray(addr);
            const expected_hrp = stringToAsciiArray("1");
            const expected_data = new Array(82).fill(0);
            const w = await circuit_dec_1_90.calculateWitness({ "bech": int_addr });
            await circuit_dec_1_90.checkConstraints(w);
            await circuit_dec_1_90.assertOut(w, { valid: 1, hrp: expected_hrp, data: expected_data });
        });

        it("Should decode valid checksum with long data part", async function () {
            const addr = "split1checkupstagehandshakeupstreamerranterredcaperred2y9e3w";
            const int_addr = stringToAsciiArray(addr);
            const expected_hrp = stringToAsciiArray("split");
            const expected_data = [24, 23, 25, 24, 22, 28, 1, 16, 11, 29, 8, 25, 23, 29, 19, 13, 16, 23, 29, 22, 25, 28, 1, 16, 11, 3, 25, 29, 27, 25, 3, 3, 29, 19, 11, 25, 3, 3, 25, 13, 24, 29, 1, 25, 3, 3, 25, 13];
            const w = await circuit_dec_5_60.calculateWitness({ "bech": int_addr });
            await circuit_dec_5_60.checkConstraints(w);
            await circuit_dec_5_60.assertOut(w, { valid: 1, hrp: expected_hrp, data: expected_data });
        });

        it("Should decode valid checksum with special character in hrp", async function () {
            const addr = "?1ezyfcl";
            const int_addr = stringToAsciiArray(addr);
            const expected_hrp = stringToAsciiArray("?");
            const w = await circuit_dec_1_8.calculateWitness({ "bech": int_addr });
            await circuit_dec_1_8.checkConstraints(w);
            await circuit_dec_1_8.assertOut(w, { valid: 1, hrp: expected_hrp, data: [] });
        });

        it("Should return invalid when hrp has invalid character ' '", async function () {
            const addr = " 1nwldj5";
            const int_addr = stringToAsciiArray(addr);
            const w = await circuit_dec_1_8.calculateWitness({ "bech": int_addr });
            await circuit_dec_1_8.checkConstraints(w);
            await circuit_dec_1_8.assertOut(w, { valid: 0, hrp: [0], data: [] });
        });

        it("Should return invalid when hrp has invalid character 0x7f", async function () {
            const addr = "\x7f" + "1axkwrx";
            const int_addr = stringToAsciiArray(addr);
            const w = await circuit_dec_1_8.calculateWitness({ "bech": int_addr });
            await circuit_dec_1_8.checkConstraints(w);
            await circuit_dec_1_8.assertOut(w, { valid: 0, hrp: [0], data: [] });
        });

        it("Should return invalid when hrp has invalid character 0x80", async function () {
            const addr = "\x80" + "1eym55h";
            const int_addr = stringToAsciiArray(addr);
            const w = await circuit_dec_1_8.calculateWitness({ "bech": int_addr });
            await circuit_dec_1_8.checkConstraints(w);
            await circuit_dec_1_8.assertOut(w, { valid: 0, hrp: [0], data: [] });
        });

        it("Should return invalid when hrp has 21-bit character", async function () {
            const addr = "\u{10FFFF}" + "1eym55h";
            const int_addr = stringToAsciiArray(addr);
            const w = await circuit_dec_1_8.calculateWitness({ "bech": int_addr });
            await circuit_dec_1_8.checkConstraints(w);
            await circuit_dec_1_8.assertOut(w, { valid: 0, hrp: [0], data: [] });
        });

        it("Should return invalid when input is too long", async function () {
            const addr = "an84characterslonghumanreadablepartthatcontainsthenumber1andtheexcludedcharactersbio1569pvx";
            const int_addr = stringToAsciiArray(addr);
            const expected_hrp = new Array(84).fill(0);
            const w = await circuit_dec_84_91.calculateWitness({ "bech": int_addr });
            await circuit_dec_84_91.checkConstraints(w);
            await circuit_dec_84_91.assertOut(w, { valid: 0, hrp: expected_hrp, data: [] });
        });

        it("Should return invalid when invalid separator character", async function () {
            const addr = "a22uel5l";
            const int_addr = stringToAsciiArray(addr);
            const w = await circuit_dec_1_8.calculateWitness({ "bech": int_addr });
            await circuit_dec_1_8.checkConstraints(w);
            await circuit_dec_1_8.assertOut(w, { valid: 0, hrp: [0], data: [] });
        });

        it("Should return invalid when empty hrp", async function () {
            const addr = "1pzry9x0s0muk";
            const int_addr = stringToAsciiArray(addr);
            const expected_data = new Array(6).fill(0);
            const w = await circuit_dec_0_13.calculateWitness({ "bech": int_addr });
            await circuit_dec_0_13.checkConstraints(w);
            await circuit_dec_0_13.assertOut(w, { valid: 0, hrp: [], data: expected_data });
        });

        it("Should return invalid when data has invalid character", async function () {
            const addr = "x1b4n0q5v";
            const int_addr = stringToAsciiArray(addr);
            const w = await circuit_dec_1_9.calculateWitness({ "bech": int_addr });
            await circuit_dec_1_9.checkConstraints(w);
            await circuit_dec_1_9.assertOut(w, { valid: 0, hrp: [0], data: [0] });
        });

        it("Should return invalid when checksum has 21-bit character", async function () {
            const addr = "a1eym55" + "\u{10FFFF}";
            const int_addr = stringToAsciiArray(addr);
            const w = await circuit_dec_1_8.calculateWitness({ "bech": int_addr });
            await circuit_dec_1_8.checkConstraints(w);
            await circuit_dec_1_8.assertOut(w, { valid: 0, hrp: [0], data: [] });
        });

        it("Should return invalid when checksum too short", async function () {
            const addr = "li1dgmt3";
            const int_addr = stringToAsciiArray(addr);
            const w = await circuit_dec_2_8.calculateWitness({ "bech": int_addr });
            await circuit_dec_2_8.checkConstraints(w);
            await circuit_dec_2_8.assertOut(w, { valid: 0, hrp: [0, 0], data: [] });
        });

        it("Should return invalid when checksum has invalid character", async function () {
            const addr = "de1lg7wt" + "\xFF";
            const int_addr = stringToAsciiArray(addr);
            const w = await circuit_dec_2_9.calculateWitness({ "bech": int_addr });
            await circuit_dec_2_9.checkConstraints(w);
            await circuit_dec_2_9.assertOut(w, { valid: 0, hrp: [0, 0], data: [] });
        });

        it("Should return invalid when checksum computed from uppercase hrp", async function () {
            const addr = "A1G7SGD8";
            const int_addr = stringToAsciiArray(addr);
            const w = await circuit_dec_1_8.calculateWitness({ "bech": int_addr });
            await circuit_dec_1_8.checkConstraints(w);
            await circuit_dec_1_8.assertOut(w, { valid: 0, hrp: [0], data: [] });
        });
    });

    describe("Encoding", function () {

        before(async () => {
            circuit_enc_1_0 = await wasm_tester(
                path.join(__dirname, "circuits", "bech32_encode", "bech32_encode_1_0.circom")
            );
            circuit_enc_1_82 = await wasm_tester(
                path.join(__dirname, "circuits", "bech32_encode", "bech32_encode_1_82.circom")
            );
            circuit_enc_83_0 = await wasm_tester(
                path.join(__dirname, "circuits", "bech32_encode", "bech32_encode_83_0.circom")
            );
            circuit_enc_6_32 = await wasm_tester(
                path.join(__dirname, "circuits", "bech32_encode", "bech32_encode_6_32.circom")
            );
            circuit_enc_5_48 = await wasm_tester(
                path.join(__dirname, "circuits", "bech32_encode", "bech32_encode_5_48.circom")
            );
        });

        it("Should encode short hrp and empty data", async function () {
            const hrp = "a";
            const int_hrp = stringToAsciiArray(hrp);
            const data = [];
            const expected_addr = stringToAsciiArray("a12uel5l");
            const w = await circuit_enc_1_0.calculateWitness({ "hrp": int_hrp, "data": data });
            await circuit_enc_1_0.checkConstraints(w);
            await circuit_enc_1_0.assertOut(w, { out: expected_addr });
        });

        it("Should encode hrp of length 83 and empty data", async function () {
            const hrp = "an83characterlonghumanreadablepartthatcontainsthenumber1andtheexcludedcharactersbio";
            const int_hrp = stringToAsciiArray(hrp);
            const data = [];
            const expected_addr = stringToAsciiArray("an83characterlonghumanreadablepartthatcontainsthenumber1andtheexcludedcharactersbio1tt5tgs");
            const w = await circuit_enc_83_0.calculateWitness({ "hrp": int_hrp, "data": data });
            await circuit_enc_83_0.checkConstraints(w);
            await circuit_enc_83_0.assertOut(w, { out: expected_addr });
        });

        it("Should encode all valid data values", async function () {
            const hrp = "abcdef";
            const int_hrp = stringToAsciiArray(hrp);
            const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
            const expected_addr = stringToAsciiArray("abcdef1qpzry9x8gf2tvdw0s3jn54khce6mua7lmqqqxw");
            const w = await circuit_enc_6_32.calculateWitness({ "hrp": int_hrp, "data": data });
            await circuit_enc_6_32.checkConstraints(w);
            await circuit_enc_6_32.assertOut(w, { out: expected_addr });
        });

        it("Should encode hrp of length 1 and data of length 82", async function () {
            const hrp = "1";
            const int_hrp = stringToAsciiArray(hrp);
            const data = new Array(82).fill(0);
            const expected_addr = stringToAsciiArray("11qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqc8247j");
            const w = await circuit_enc_1_82.calculateWitness({ "hrp": int_hrp, "data": data });
            await circuit_enc_1_82.checkConstraints(w);
            await circuit_enc_1_82.assertOut(w, { out: expected_addr });
        });

        it("Should encode", async function () {
            const hrp = "split";
            const int_hrp = stringToAsciiArray(hrp);
            const data = [24, 23, 25, 24, 22, 28, 1, 16, 11, 29, 8, 25, 23, 29, 19, 13, 16, 23, 29, 22, 25, 28, 1, 16, 11, 3, 25, 29, 27, 25, 3, 3, 29, 19, 11, 25, 3, 3, 25, 13, 24, 29, 1, 25, 3, 3, 25, 13];
            const expected_addr = stringToAsciiArray("split1checkupstagehandshakeupstreamerranterredcaperred2y9e3w");
            const w = await circuit_enc_5_48.calculateWitness({ "hrp": int_hrp, "data": data });
            await circuit_enc_5_48.checkConstraints(w);
            await circuit_enc_5_48.assertOut(w, { out: expected_addr });
        });

        it("Should encode hrp with special character", async function () {
            const hrp = "?";
            const int_hrp = stringToAsciiArray(hrp);
            const data = [];
            const expected_addr = stringToAsciiArray("?1ezyfcl");
            const w = await circuit_enc_1_0.calculateWitness({ "hrp": int_hrp, "data": data });
            await circuit_enc_1_0.checkConstraints(w);
            await circuit_enc_1_0.assertOut(w, { out: expected_addr });
        });

    });

});