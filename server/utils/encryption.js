import crypto from 'crypto';
import fs from 'fs';

// Use AES-256-CBC with proper IV for security
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // For AES, this is always 16

export const generateEncryptionKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateIV = () => {
  return crypto.randomBytes(IV_LENGTH);
};

export const encryptFile = (filePath, encryptionKey) => {
  return new Promise((resolve, reject) => {
    try {
      const key = Buffer.from(encryptionKey, 'hex');
      const iv = generateIV();
      const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
      
      const input = fs.createReadStream(filePath);
      const output = fs.createWriteStream(filePath + '.encrypted');
      
      // Write IV at the beginning of the encrypted file
      output.write(iv);
      
      input.pipe(cipher).pipe(output, { end: false });
      
      cipher.on('end', () => {
        output.end();
      });
      
      output.on('finish', () => {
        fs.unlinkSync(filePath); // Remove original file
        resolve(filePath + '.encrypted');
      });
      
      output.on('error', reject);
      cipher.on('error', reject);
      input.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

export const decryptFile = (encryptedPath, encryptionKey, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const key = Buffer.from(encryptionKey, 'hex');
      const input = fs.createReadStream(encryptedPath);
      const output = fs.createWriteStream(outputPath);
      
      // Read IV from the beginning of the encrypted file
      let iv = null;
      let ivBuffer = Buffer.alloc(IV_LENGTH);
      let ivBytesRead = 0;
      
      input.on('readable', () => {
        if (!iv) {
          const chunk = input.read(IV_LENGTH - ivBytesRead);
          if (chunk) {
            chunk.copy(ivBuffer, ivBytesRead);
            ivBytesRead += chunk.length;
            
            if (ivBytesRead === IV_LENGTH) {
              iv = ivBuffer;
              const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
              
              input.pipe(decipher).pipe(output);
              
              decipher.on('error', reject);
              output.on('finish', () => resolve(outputPath));
              output.on('error', reject);
            }
          }
        }
      });
      
      input.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

export const encryptData = (data, key) => {
  try {
    const keyBuffer = Buffer.from(key, 'hex');
    const iv = generateIV();
    const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Prepend IV to encrypted data
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    throw new Error('Encryption failed: ' + error.message);
  }
};

export const decryptData = (encryptedData, key) => {
  try {
    const keyBuffer = Buffer.from(key, 'hex');
    const parts = encryptedData.split(':');
    
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed: ' + error.message);
  }
};