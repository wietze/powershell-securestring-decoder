# PowerShell: ConvertFrom-SecureString decoder
## ConvertTo/From-SecureString
PowerShell provides the `ConvertTo-SecureString` cmdlet [[1]] as a means to convert (sensitive) plain text data to a `SecureString` object. `SecureString` objects are encrypted in memory and should reduce the risks attached to the use of plaintext passwords in PowerShell scripts [[2]]. The `ConvertFrom-SecureString` cmdlet [[3]] can be used to serialize such objects. If the `-Key` argument is used, the `SecureString` will be encrypted with the supplied key instead of the user's profile key. This is a way of making the serialized `SecureString` object usable across different environments.

## Obfuscation technique
The `ConvertFrom-SecureString` cmdlet can be (and has been) used for PowerShell obfuscation [[4], [5]]. Attackers encode a malicious payload on their machine using `ConvertFrom-SecureString` with a fixed key. Decoding this on the victim's machine is easy because it relies on a built-in PowerShell feature, whilst it makes detection and analysis harder.

## About this repo
This is a simple web app for decoding `ConvertFrom-SecureString` outputs. The code is minimalist by design (no JavaScript frameworks are used, just pure JavaScript) and does not rely on external resources (and can therefore be used offline). Please contribute if you want to help improve this page.


👉 **Check out the tool here: > [LIVE DEMO](https://wietze.github.io/powershell-securestring-decoder) <**

## Example
Entering the following two lines in PowerShell:

```ps
$Key = (3,4,2,3,56,34,254,222,1,1,2,23,42,54,33,233,1,34,2,7,6,5,35,43)
ConvertFrom-SecureString (ConvertTo-SecureString "Never gonna give you up, never gonna let you down" -AsPlainText -Force) -Key $Key
```

Might* result in:

```
76492d1116743f0423413b16050a5345MgB8AFIAZwBiAHQAZAA3ADYARgBSAEEAUgBoADgAQgBYADkAZgA4ADAAbgBRAFEAPQA9AHwAMgAwADEAZAA5AGQANwBhAGYAZABkAGYAYQAzADIAYQAwADUAMgBmADAAMgA3AGQAMQBhADAAMgBjAGIAYQBmADQAYwA1AGMANABlAGQAZAAyADUAYgA5AGEAYwAxAGIAYgBjAGUAZQAzAGEAYwA2ADQANgA4ADAAYwAwADAAMwBiAGEAMQAwADIAMgA2ADcAZgBmADEAOABlADQAZABkADkANwBmAGQAMgBjADYAMABlADUAZQA0ADIAOQAyADEAYQA1ADEANQA2AGEAZgA0ADQAYQBhADcANgBmADUAMQA5AGQAOQA1ADMANQAwADUAMgBiADMAMAAzAGYAMgA4AGIAYwAwAGEAMAA1AGQAZQAwADQAMgBhADEAMAAzADgAYQBmADcAZgAxAGUAMQA0ADMAMgBiADAANgBkADMANQBhADgAMgAzADkAYQA2ADgAMQBiAGQAMQA2AGIAMQAzAGIANwBjAGIAYgA2ADUANQBiAGEAOAA0ADgAMQA4ADkAZgA4ADcAYQA5AGMANwA3AGIAZABlAGEAYQA0ADgAMABiADAANgAxADAAOAA3ADQAYwBjADQAMwA0ADMANQAwAA==
```
*: _Because the initialization vector (IV) will be different on every ConvertFrom-SecureString execution, the output is different every time it is run._

Entering the output together with the key on this page will successfully decode the ciphertext. Click here to try it yourself.

## Acknowledgements
Thanks to Richard Moore for aes-js [[6]], a JavaScript implementation of AES.

[1]: https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.security/convertto-securestring
[2]: https://social.technet.microsoft.com/wiki/contents/articles/4546.working-with-passwords-secure-strings-and-credentials-in-windows-powershell.aspx
[3]: https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.security/convertfrom-securestring
[4]: https://www.sans.org/cyber-security-summit/archives/file/summit-archive-1492186586.pdf
[5]: https://www.hybrid-analysis.com/sample/e6b92d2b0a55c2253f1e89d601d5c3262df3b30b3c6fd31b04ed7260bbb835b1
[6]: https://github.com/ricmoo/aes-js
