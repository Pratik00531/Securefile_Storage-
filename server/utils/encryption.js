import crypto from 'crypto';
import fs from 'fs';

const ALGORITHM = 'aes-256-cbc';

export const generateEncryptionKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const encryptFile = (filePath, encryptionKey) => {
  const cipher = crypto.createCipher(ALGORITHM, encryptionKey);
  const input = fs.createReadStream(filePath);
  const output = fs.createWriteStream(filePath + '.encrypted');
  
  return new Promise((resolve, reject) => {
    input.pipe(cipher).pipe(output);
    output.on('finish', () => {
      fs.unlinkSync(filePath); // Remove original file
      resolve(filePath + '.encrypted');
    });
    output.on('error', reject);
  });
};

export const decryptFile = (encryptedPath, encryptionKey, outputPath) => {
  const decipher = crypto.createDecipher(ALGORITHM, encryptionKey);
  const input = fs.createReadStream(encryptedPath);
  const output = fs.createWriteStream(outputPath);
  
  return new Promise((resolve, reject) => {
    input.pipe(decipher).pipe(output);
    output.on('finish', () => resolve(outputPath));
    output.on('error', reject);
  });
};

export const encryptData = (data, key) => {
  const cipher = crypto.createCipher(ALGORITHM, key);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export const decryptData = (encryptedData, key) => {
  const decipher = crypto.createDecipher(ALGORITHM, key);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};