function DecodeUTF16LE(binaryStr) {
    var cp = [];
    for (var i = 0; i < binaryStr.length; i += 2) {
        cp.push(
            binaryStr.charCodeAt(i) |
            (binaryStr.charCodeAt(i + 1) << 8)
        );
    }

    return String.fromCharCode.apply(String, cp);
}
function StrToUTF16Bytes(str) {
    const bytes = [];
    for (ii = 0; ii < str.length; ii++) {
        const code = str.charCodeAt(ii);
        bytes.push(code & 255, code >> 8);
    }
    return bytes;
}

function UTF16BytesToStr(array) {
    var dec = new TextDecoder('utf-16le');
    return dec.decode(array);
}

function decryptSecureString(input, key) {
    HEADER = "76492d1116743f0423413b16050a5345";
    decode_b64 = (x) => DecodeUTF16LE(atob(x))

    // Check if header is present
    if (input.substr(0, HEADER.length) == HEADER) {
        var decoded_input = decode_b64(input.substr(HEADER.length));

        // Extract IV and payload
        var split = decoded_input.split('|')
        var iv = StrToUTF16Bytes(decode_b64(split[1]));
        var payload = aesjs.utils.hex.toBytes(split[2]);

        // Create new AES CBC decryptor with given key and found IV
        var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
        var decryptedBytesWithPadding = aesCbc.decrypt(payload);
        // Remove padding
        var decryptedBytePadding = decryptedBytesWithPadding[decryptedBytesWithPadding.length - 1];
        decryptedBytes = decryptedBytesWithPadding.slice(0, decryptedBytesWithPadding.length - decryptedBytePadding)

        // Convert to text
        return UTF16BytesToStr(decryptedBytes);
    }
}

document.getElementById('demo').addEventListener("click", function (e) {
    document.getElementById('key').value = "(3,4,2,3,56,34,254,222,1,1,2,23,42,54,33,233,1,34,2,7,6,5,35,43)";
    document.getElementById('encoded').value = "76492d1116743f0423413b16050a5345MgB8AFIAZwBiAHQAZAA3ADYARgBSAEEAUgBoADgAQgBYADkAZgA4ADAAbgBRAFEAPQA9AHwAMgAwADEAZAA5AGQANwBhAGYAZABkAGYAYQAzADIAYQAwADUAMgBmADAAMgA3AGQAMQBhADAAMgBjAGIAYQBmADQAYwA1AGMANABlAGQAZAAyADUAYgA5AGEAYwAxAGIAYgBjAGUAZQAzAGEAYwA2ADQANgA4ADAAYwAwADAAMwBiAGEAMQAwADIAMgA2ADcAZgBmADEAOABlADQAZABkADkANwBmAGQAMgBjADYAMABlADUAZQA0ADIAOQAyADEAYQA1ADEANQA2AGEAZgA0ADQAYQBhADcANgBmADUAMQA5AGQAOQA1ADMANQAwADUAMgBiADMAMAAzAGYAMgA4AGIAYwAwAGEAMAA1AGQAZQAwADQAMgBhADEAMAAzADgAYQBmADcAZgAxAGUAMQA0ADMAMgBiADAANgBkADMANQBhADgAMgAzADkAYQA2ADgAMQBiAGQAMQA2AGIAMQAzAGIANwBjAGIAYgA2ADUANQBiAGEAOAA0ADgAMQA4ADkAZgA4ADcAYQA5AGMANwA3AGIAZABlAGEAYQA0ADgAMABiADAANgAxADAAOAA3ADQAYwBjADQAMwA0ADMANQAwAA==";
}, false);

document.getElementById('submit').addEventListener("click", function (e) {
    var input_missing = document.getElementById('encoded').required = document.getElementById('encoded').value.length == 0;
    var key_missing = document.getElementById('key').required = document.getElementById('key').value.length == 0;

    if (input_missing || key_missing) {
        alert_msg = key_missing ? "key " + (input_missing ? "and input were" : "was") : "input was";
        alert("No " + alert_msg + " given. Please check your inputs or check the example in the readme on the right.")
    } else {
        document.getElementById('result').value = '';
        key = document.getElementById('key').value.match(/\d+/g).map(str => parseInt(str, 10));
        console.log("A " + (key.length * 8) + " bit key was found")
        if (key.length != 16 && key.length != 24 && key.length != 32) {
            alert('No valid key (128, 192 or 256 bit) was given. Please check your encryption key.')
        } else {
            try {
                result = decryptSecureString(document.getElementById('encoded').value.trim(), key);
            } catch {
                alert("An error occured. Check if the provided key and Base64 are valid, or consider opening an issue on GitHub.")
            }
            if (result === undefined) {
                alert("No output could be generated. Check if the provided Base64 is valid, or consider opening an issue on GitHub.")
            }
            document.getElementById('result').value = decryptSecureString(document.getElementById('encoded').value.trim(), key);
        }
    }
}, false);
