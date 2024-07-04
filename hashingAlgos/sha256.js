function sha256(message) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
  
    const K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
      0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
      0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
      0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
      0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
      0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
      0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
      0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
      0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
  
    const messageLength = message.length * 8;
    const blockSize = 512;
    const paddedMessage = new Uint8Array((blockSize / 8) * Math.ceil((messageLength + 1 + 64) / blockSize));
    
    for (let i = 0; i < message.length; i++) {
      paddedMessage[i] = message.charCodeAt(i);
    }
  
    paddedMessage[message.length] = 0x80;
  
    const bitLength = paddedMessage.length * 8;
    paddedMessage[bitLength / 8 - 1] = messageLength & 0xff;
    paddedMessage[bitLength / 8 - 2] = (messageLength >>> 8) & 0xff;
    paddedMessage[bitLength / 8 - 3] = (messageLength >>> 16) & 0xff;
    paddedMessage[bitLength / 8 - 4] = (messageLength >>> 24) & 0xff;
    
    const chunks = paddedMessage.length / (blockSize / 8);
    const H = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];
  
    for (let chunk = 0; chunk < chunks; chunk++) {
      const words = new Array(64);
      for (let i = 0; i < 16; i++) {
        const index = chunk * 16 + i;
        words[i] =
          (paddedMessage[index * 4 + 0] << 24) |
          (paddedMessage[index * 4 + 1] << 16) |
          (paddedMessage[index * 4 + 2] << 8) |
          (paddedMessage[index * 4 + 3]);
      }
  
      for (let i = 16; i < 64; i++) {
        const s0 = rightRotate(words[i - 15], 7) ^ rightRotate(words[i - 15], 18) ^ (words[i - 15] >>> 3);
        const s1 = rightRotate(words[i - 2], 17) ^ rightRotate(words[i - 2], 19) ^ (words[i - 2] >>> 10);
        words[i] = (words[i - 16] + s0 + words[i - 7] + s1) & 0xffffffff;
      }
  
      let [a, b, c, d, e, f, g, h] = H;
  
      for (let i = 0; i < 64; i++) {
        const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
        const ch = (e & f) ^ (~e & g);
        const temp1 = (h + S1 + ch + K[i] + words[i]) & 0xffffffff;
        const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (S0 + maj) & 0xffffffff;
  
        h = g;
        g = f;
        f = e;
        e = (d + temp1) & 0xffffffff;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) & 0xffffffff;
      }
  
      H[0] = (H[0] + a) & 0xffffffff;
      H[1] = (H[1] + b) & 0xffffffff;
      H[2] = (H[2] + c) & 0xffffffff;
      H[3] = (H[3] + d) & 0xffffffff;
      H[4] = (H[4] + e) & 0xffffffff;
      H[5] = (H[5] + f) & 0xffffffff;
      H[6] = (H[6] + g) & 0xffffffff;
      H[7] = (H[7] + h) & 0xffffffff;
    }
  
    const hash = H.map(value => ('00000000' + value.toString(16)).slice(-8)).join('');
    return hash;
  }

  