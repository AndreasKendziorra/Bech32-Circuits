const path = require("path");
const wasm_tester = require("circom_tester").wasm;

const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");


function stringToAsciiArray(str) {
    return Array.from(str).map(char => char.charCodeAt(0));
}

describe("Segwit Addresses", function () {
    this.timeout(100000);

    describe("Decoding", function () {

        before(async () => {
            circuit_dec_2_9 = await wasm_tester(
                path.join(__dirname, "circuits", "segwit_addr_decode", "segwit_addr_decode_2_9.circom")
            );
            circuit_dec_2_12 = await wasm_tester(
                path.join(__dirname, "circuits", "segwit_addr_decode", "segwit_addr_decode_2_12.circom")
            );
            circuit_dec_2_14 = await wasm_tester(
                path.join(__dirname, "circuits", "segwit_addr_decode", "segwit_addr_decode_2_14.circom")
            );
            circuit_dec_2_36 = await wasm_tester(
                path.join(__dirname, "circuits", "segwit_addr_decode", "segwit_addr_decode_2_36.circom")
            );
            circuit_dec_2_37 = await wasm_tester(
                path.join(__dirname, "circuits", "segwit_addr_decode", "segwit_addr_decode_2_37.circom")
            );
            circuit_dec_2_42 = await wasm_tester(
                path.join(__dirname, "circuits", "segwit_addr_decode", "segwit_addr_decode_2_42.circom")
            );
            circuit_dec_2_62 = await wasm_tester(
                path.join(__dirname, "circuits", "segwit_addr_decode", "segwit_addr_decode_2_62.circom")
            );
            circuit_dec_2_74 = await wasm_tester(
                path.join(__dirname, "circuits", "segwit_addr_decode", "segwit_addr_decode_2_74.circom")
            );
            circuit_dec_2_76 = await wasm_tester(
                path.join(__dirname, "circuits", "segwit_addr_decode", "segwit_addr_decode_2_76.circom")
            );
        });

        it("Should decode address with only upper case letters", async function () {
            const addr = "BC1QW508D6QEJXTDG4Y5R3ZARVARY0C5XW7KV8F3T4";
            const hrp = "bc";
            const int_addr = stringToAsciiArray(addr);
            const int_hrp = stringToAsciiArray(hrp);
            const expected_witver = 0;
            const expected_witprog = [117, 30, 118, 232, 25, 145, 150, 212, 84, 148, 28, 69, 209, 179, 163, 35, 241, 67, 59, 214];
            const w = await circuit_dec_2_42.calculateWitness({ "hrp": int_hrp, "addr": int_addr });
            await circuit_dec_2_42.checkConstraints(w);
            await circuit_dec_2_42.assertOut(w, { valid_input: 1, witver: expected_witver, witprog: expected_witprog });
        });

        it("Should decode valid address", async function () {
            const addr = "bc1pw508d6qejxtdg4y5r3zarvary0c5xw7kw508d6qejxtdg4y5r3zarvary0c5xw7k7grplx";
            const hrp = "bc";
            const int_addr = stringToAsciiArray(addr);
            const int_hrp = stringToAsciiArray(hrp);
            const expected_witver = 1;
            const expected_witprog = [117, 30, 118, 232, 25, 145, 150, 212, 84, 148, 28, 69, 209, 179, 163, 35, 241, 67, 59, 214, 117, 30, 118, 232, 25, 145, 150, 212, 84, 148, 28, 69, 209, 179, 163, 35, 241, 67, 59, 214];
            const w = await circuit_dec_2_74.calculateWitness({ "hrp": int_hrp, "addr": int_addr });
            await circuit_dec_2_74.checkConstraints(w);
            await circuit_dec_2_74.assertOut(w, { valid_input: 1, witver: expected_witver, witprog: expected_witprog });
        });

        it("Should decode", async function () {
            const addr = "bc1zw508d6qejxtdg4y5r3zarvaryvg6kdaj";
            const hrp = "bc";
            const int_addr = stringToAsciiArray(addr);
            const int_hrp = stringToAsciiArray(hrp);
            const expected_witver = 2;
            const expected_witprog = [117, 30, 118, 232, 25, 145, 150, 212, 84, 148, 28, 69, 209, 179, 163, 35];
            const w = await circuit_dec_2_36.calculateWitness({ "hrp": int_hrp, "addr": int_addr });
            await circuit_dec_2_36.checkConstraints(w);
            await circuit_dec_2_36.assertOut(w, { valid_input: 1, witver: expected_witver, witprog: expected_witprog });
        });

        it("Should decode valid address for hrp 'tb'", async function () {
            const addr = "tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7";
            const hrp = "tb";
            const int_addr = stringToAsciiArray(addr);
            const int_hrp = stringToAsciiArray(hrp);
            const expected_witver = 0;
            const expected_witprog = [24, 99, 20, 60, 20, 197, 22, 104, 4, 189, 25, 32, 51, 86, 218, 19, 108, 152, 86, 120, 205, 77, 39, 161, 184, 198, 50, 150, 4, 144, 50, 98];
            const w = await circuit_dec_2_62.calculateWitness({ "hrp": int_hrp, "addr": int_addr });
            await circuit_dec_2_62.checkConstraints(w);
            await circuit_dec_2_62.assertOut(w, { valid_input: 1, witver: expected_witver, witprog: expected_witprog });
        });

        it("Should decode ", async function () {
            const addr = "tb1qqqqqp399et2xygdj5xreqhjjvcmzhxw4aywxecjdzew6hylgvsesrxh6hy";
            const hrp = "tb";
            const int_addr = stringToAsciiArray(addr);
            const int_hrp = stringToAsciiArray(hrp);
            const expected_witver = 0;
            const expected_witprog = [0, 0, 0, 196, 165, 202, 212, 98, 33, 178, 161, 135, 144, 94, 82, 102, 54, 43, 153, 213, 233, 28, 108, 226, 77, 22, 93, 171, 147, 232, 100, 51];
            const w = await circuit_dec_2_62.calculateWitness({ "hrp": int_hrp, "addr": int_addr });
            await circuit_dec_2_62.checkConstraints(w);
            await circuit_dec_2_62.assertOut(w, { valid_input: 1, witver: expected_witver, witprog: expected_witprog });
        });

        it("Should fail to decode when hrp does not match ", async function () {
            const addr = "tc1qw508d6qejxtdg4y5r3zarvary0c5xw7kg3g4ty";
            const hrp = "tb";
            const int_addr = stringToAsciiArray(addr);
            const int_hrp = stringToAsciiArray(hrp);
            const expected_witver = 0;
            const expected_witprog = new Array(20).fill(0);
            const w = await circuit_dec_2_42.calculateWitness({ "hrp": int_hrp, "addr": int_addr });
            await circuit_dec_2_42.checkConstraints(w);
            await circuit_dec_2_42.assertOut(w, { valid_input: 0, witver: expected_witver, witprog: expected_witprog });
        });

        it("Should fail to decode when invalid checksum ", async function () {
            const addr = "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t5";
            const hrp = "bc";
            const int_addr = stringToAsciiArray(addr);
            const int_hrp = stringToAsciiArray(hrp);
            const expected_witver = 0;
            const expected_witprog = new Array(20).fill(0);
            const w = await circuit_dec_2_42.calculateWitness({ "hrp": int_hrp, "addr": int_addr });
            await circuit_dec_2_42.checkConstraints(w);
            await circuit_dec_2_42.assertOut(w, { valid_input: 0, witver: expected_witver, witprog: expected_witprog });
        });

        it("Should fail to decode when witness version larger than 16 ", async function () {
            const addr = "BC13W508D6QEJXTDG4Y5R3ZARVARY0C5XW7KN40WF2";
            const hrp = "bc";
            const int_addr = stringToAsciiArray(addr);
            const int_hrp = stringToAsciiArray(hrp);
            const expected_witver = 0;
            const expected_witprog = new Array(20).fill(0);
            const w = await circuit_dec_2_42.calculateWitness({ "hrp": int_hrp, "addr": int_addr });
            await circuit_dec_2_42.checkConstraints(w);
            await circuit_dec_2_42.assertOut(w, { valid_input: 0, witver: expected_witver, witprog: expected_witprog });
        });

        it("Should fail to decode when witness program too long", async function () {
            const addr = "bc10w508d6qejxtdg4y5r3zarvary0c5xw7kw508d6qejxtdg4y5r3zarvary0c5xw7kw5rljs90";
            const hrp = "bc";
            const int_addr = stringToAsciiArray(addr);
            const int_hrp = stringToAsciiArray(hrp);
            const expected_witver = 0;
            const expected_witprog = new Array(41).fill(0);
            const w = await circuit_dec_2_76.calculateWitness({ "hrp": int_hrp, "addr": int_addr });
            await circuit_dec_2_76.checkConstraints(w);
            await circuit_dec_2_76.assertOut(w, { valid_input: 0, witver: expected_witver, witprog: expected_witprog });
        });

        it("Should fail to decode when witness program too short for witness version 0", async function () {
            const addr = "BC1QR508D6QEJXTDG4Y5R3ZARVARYV98GJ9P";
            const hrp = "bc";
            const int_addr = stringToAsciiArray(addr);
            const int_hrp = stringToAsciiArray(hrp);
            const expected_witver = 0;
            const expected_witprog = new Array(16).fill(0);
            const w = await circuit_dec_2_36.calculateWitness({ "hrp": int_hrp, "addr": int_addr });
            await circuit_dec_2_36.checkConstraints(w);
            await circuit_dec_2_36.assertOut(w, { valid_input: 0, witver: expected_witver, witprog: expected_witprog });
        });

        it("Should fail to decode when using mixed case", async function () {
            const addr = "tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sL5k7";
            const hrp = "tb";
            const int_addr = stringToAsciiArray(addr);
            const int_hrp = stringToAsciiArray(hrp);
            const expected_witver = 0;
            const expected_witprog = new Array(32).fill(0);
            const w = await circuit_dec_2_62.calculateWitness({ "hrp": int_hrp, "addr": int_addr });
            await circuit_dec_2_62.checkConstraints(w);
            await circuit_dec_2_62.assertOut(w, { valid_input: 0, witver: expected_witver, witprog: expected_witprog });
        });

        it("Should fail to decode when zero padding of more than 4 bits", async function () {
            const addr = "bc1zw508d6qejxtdg4y5r3zarvaryvqyzf3du";
            const hrp = "bc";
            const int_addr = stringToAsciiArray(addr);
            const int_hrp = stringToAsciiArray(hrp);
            const expected_witver = 0;
            const expected_witprog = new Array(16).fill(0);
            const w = await circuit_dec_2_37.calculateWitness({ "hrp": int_hrp, "addr": int_addr });
            await circuit_dec_2_37.checkConstraints(w);
            await circuit_dec_2_37.assertOut(w, { valid_input: 0, witver: expected_witver, witprog: expected_witprog });
        });

        it("Should fail to decode when non-zero padding in 8-to-5 conversion", async function () {
            const addr = "tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3pjxtptv";
            const hrp = "tb";
            const int_addr = stringToAsciiArray(addr);
            const int_hrp = stringToAsciiArray(hrp);
            const expected_witver = 0;
            const expected_witprog = new Array(32).fill(0);
            const w = await circuit_dec_2_62.calculateWitness({ "hrp": int_hrp, "addr": int_addr });
            await circuit_dec_2_62.checkConstraints(w);
            await circuit_dec_2_62.assertOut(w, { valid_input: 0, witver: expected_witver, witprog: expected_witprog });
        });

        it("Should fail to decode when data section is empty", async function () {
            const addr = "bc1gmk9yu";
            const hrp = "bc";
            const int_addr = stringToAsciiArray(addr);
            const int_hrp = stringToAsciiArray(hrp);
            const expected_witver = 0;
            const expected_witprog = [];
            const w = await circuit_dec_2_9.calculateWitness({ "hrp": int_hrp, "addr": int_addr });
            await circuit_dec_2_9.checkConstraints(w);
            await circuit_dec_2_9.assertOut(w, { valid_input: 0, witver: expected_witver, witprog: expected_witprog });
        });

    });

    describe("Encoding", function () {

        before(async () => {
            circuit_end_2_0 = await wasm_tester(
                path.join(__dirname, "circuits", "segwit_addr_encode", "segwit_addr_encode_2_0.circom")
            );
            circuit_end_2_16 = await wasm_tester(
                path.join(__dirname, "circuits", "segwit_addr_encode", "segwit_addr_encode_2_16.circom")
            );
            circuit_end_2_20 = await wasm_tester(
                path.join(__dirname, "circuits", "segwit_addr_encode", "segwit_addr_encode_2_20.circom")
            );
            circuit_end_2_32 = await wasm_tester(
                path.join(__dirname, "circuits", "segwit_addr_encode", "segwit_addr_encode_2_32.circom")
            );
            circuit_end_2_40 = await wasm_tester(
                path.join(__dirname, "circuits", "segwit_addr_encode", "segwit_addr_encode_2_40.circom")
            );
            circuit_end_2_41 = await wasm_tester(
                path.join(__dirname, "circuits", "segwit_addr_encode", "segwit_addr_encode_2_41.circom")
            );
        });

        it("Should encode address", async function () {
            const hrp = "bc";
            const witver = 0;
            const witprog = [117, 30, 118, 232, 25, 145, 150, 212, 84, 148, 28, 69, 209, 179, 163, 35, 241, 67, 59, 214];
            const int_hrp = stringToAsciiArray(hrp);
            const expected_addr = stringToAsciiArray("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4");
            const w = await circuit_end_2_20.calculateWitness({ "hrp": int_hrp, "witver": witver, "witprog": witprog });
            await circuit_end_2_20.checkConstraints(w);
            await circuit_end_2_20.assertOut(w, { success: 1, out: expected_addr });
        });

        it("Should encode with witness program of lenth 40", async function () {
            const hrp = "bc";
            const witver = 1;
            const witprog = [117, 30, 118, 232, 25, 145, 150, 212, 84, 148, 28, 69, 209, 179, 163, 35, 241, 67, 59, 214, 117, 30, 118, 232, 25, 145, 150, 212, 84, 148, 28, 69, 209, 179, 163, 35, 241, 67, 59, 214];
            const int_hrp = stringToAsciiArray(hrp);
            const expected_addr = stringToAsciiArray("bc1pw508d6qejxtdg4y5r3zarvary0c5xw7kw508d6qejxtdg4y5r3zarvary0c5xw7k7grplx");
            const w = await circuit_end_2_40.calculateWitness({ "hrp": int_hrp, "witver": witver, "witprog": witprog });
            await circuit_end_2_40.checkConstraints(w);
            await circuit_end_2_40.assertOut(w, { success: 1, out: expected_addr });
        });

        it("Should fail to encode when wittness program too long", async function () {
            const hrp = "bc";
            const witver = 0;
            const witprog = new Array(41).fill(0);
            const int_hrp = stringToAsciiArray(hrp);
            const expected_addr = new Array(76).fill(0);
            const w = await circuit_end_2_41.calculateWitness({ "hrp": int_hrp, "witver": witver, "witprog": witprog });
            await circuit_end_2_41.checkConstraints(w);
            await circuit_end_2_41.assertOut(w, { success: 0, out: expected_addr });
        });

        it("Should encode with non-zero witness version 2", async function () {
            const hrp = "bc";
            const witver = 2;
            const witprog = [117, 30, 118, 232, 25, 145, 150, 212, 84, 148, 28, 69, 209, 179, 163, 35];
            const int_hrp = stringToAsciiArray(hrp);
            const expected_addr = stringToAsciiArray("bc1zw508d6qejxtdg4y5r3zarvaryvg6kdaj");
            const w = await circuit_end_2_16.calculateWitness({ "hrp": int_hrp, "witver": witver, "witprog": witprog });
            await circuit_end_2_16.checkConstraints(w);
            await circuit_end_2_16.assertOut(w, { success: 1, out: expected_addr });
        });

        it("Should encode for hrp 'tb'", async function () {
            const hrp = "tb";
            const witver = 0;
            const witprog = [24, 99, 20, 60, 20, 197, 22, 104, 4, 189, 25, 32, 51, 86, 218, 19, 108, 152, 86, 120, 205, 77, 39, 161, 184, 198, 50, 150, 4, 144, 50, 98];
            const int_hrp = stringToAsciiArray(hrp);
            const expected_addr = stringToAsciiArray("tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7");
            const w = await circuit_end_2_32.calculateWitness({ "hrp": int_hrp, "witver": witver, "witprog": witprog });
            await circuit_end_2_32.checkConstraints(w);
            await circuit_end_2_32.assertOut(w, { success: 1, out: expected_addr });
        });

        it("Should encode for hrp 'tb'", async function () {
            const hrp = "tb";
            const witver = 0;
            const witprog = [0, 0, 0, 196, 165, 202, 212, 98, 33, 178, 161, 135, 144, 94, 82, 102, 54, 43, 153, 213, 233, 28, 108, 226, 77, 22, 93, 171, 147, 232, 100, 51];
            const int_hrp = stringToAsciiArray(hrp);
            const expected_addr = stringToAsciiArray("tb1qqqqqp399et2xygdj5xreqhjjvcmzhxw4aywxecjdzew6hylgvsesrxh6hy");
            const w = await circuit_end_2_32.calculateWitness({ "hrp": int_hrp, "witver": witver, "witprog": witprog });
            await circuit_end_2_32.checkConstraints(w);
            await circuit_end_2_32.assertOut(w, { success: 1, out: expected_addr });
        });

        it("Should encode when wittness version equals 16", async function () {
            const hrp = "tb";
            const witver = 16;
            const witprog = [0, 0, 0, 196, 165, 202, 212, 98, 33, 178, 161, 135, 144, 94, 82, 102, 54, 43, 153, 213, 233, 28, 108, 226, 77, 22, 93, 171, 147, 232, 100, 51];
            const int_hrp = stringToAsciiArray(hrp);
            const expected_addr = stringToAsciiArray("tb1sqqqqp399et2xygdj5xreqhjjvcmzhxw4aywxecjdzew6hylgvsesljdczg");
            const w = await circuit_end_2_32.calculateWitness({ "hrp": int_hrp, "witver": witver, "witprog": witprog });
            await circuit_end_2_32.checkConstraints(w);
            await circuit_end_2_32.assertOut(w, { success: 1, out: expected_addr });
        });

        it("Should fail to encode when wittness version larger than 16", async function () {
            const hrp = "tb";
            const witver = 17;
            const witprog = [0, 0, 0, 196, 165, 202, 212, 98, 33, 178, 161, 135, 144, 94, 82, 102, 54, 43, 153, 213, 233, 28, 108, 226, 77, 22, 93, 171, 147, 232, 100, 51];
            const int_hrp = stringToAsciiArray(hrp);
            const expected_addr = new Array(62).fill(0);
            const w = await circuit_end_2_32.calculateWitness({ "hrp": int_hrp, "witver": witver, "witprog": witprog });
            await circuit_end_2_32.checkConstraints(w);
            await circuit_end_2_32.assertOut(w, { success: 0, out: expected_addr });
        });

        it("Should fail to encode when witness program too short for witness version 0", async function () {
            const hrp = "bc";
            const witver = 0;
            const witprog = [117, 30, 118, 232, 25, 145, 150, 212, 84, 148, 28, 69, 209, 179, 163, 35];
            const int_hrp = stringToAsciiArray(hrp);
            const expected_addr = new Array(36).fill(0);
            const w = await circuit_end_2_16.calculateWitness({ "hrp": int_hrp, "witver": witver, "witprog": witprog });
            await circuit_end_2_16.checkConstraints(w);
            await circuit_end_2_16.assertOut(w, { success: 0, out: expected_addr });
        });

        it("Should fail to encode when witness program is empty", async function () {
            const hrp = "bc";
            const witver = 0;
            const witprog = [];
            const int_hrp = stringToAsciiArray(hrp);
            const expected_addr = new Array(10).fill(0);
            const w = await circuit_end_2_0.calculateWitness({ "hrp": int_hrp, "witver": witver, "witprog": witprog });
            await circuit_end_2_0.checkConstraints(w);
            await circuit_end_2_0.assertOut(w, { success: 0, out: expected_addr });
        });


    });

});