import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import File from '../models/File.js';
import auth from '../middleware/auth.js';
import { encryptFile, decryptFile } from '../utils/encryption.js';

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types but you can add restrictions here
    cb(null, true);
  }
});

// Upload file
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Encrypt the file
    const encryptedPath = await encryptFile(req.file.path, req.user.encryptionKey);

    // Save file metadata to database
    const file = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      encryptedPath,
      owner: req.user._id
    });

    await file.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: file._id,
        originalName: file.originalName,
        size: file.size,
        uploadDate: file.createdAt
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Error uploading file' });
  }
});

// Get user files
router.get('/my-files', auth, async (req, res) => {
  try {
    const files = await File.find({ owner: req.user._id })
      .select('-encryptedPath -__v')
      .sort({ createdAt: -1 });

    res.json(files);
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Error fetching files' });
  }
});

// Download file
router.get('/download/:fileId', auth, async (req, res) => {
  try {
    const file = await File.findOne({ 
      _id: req.params.fileId,
      owner: req.user._id 
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Create temporary decrypted file
    const tempPath = path.join(uploadsDir, 'temp-' + Date.now() + '-' + file.originalName);
    
    await decryptFile(file.encryptedPath, req.user.encryptionKey, tempPath);

    // Send file and clean up
    res.download(tempPath, file.originalName, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      // Clean up temporary file
      fs.unlink(tempPath, (unlinkErr) => {
        if (unlinkErr) console.error('Error cleaning up temp file:', unlinkErr);
      });
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Error downloading file' });
  }
});

// Delete file
router.delete('/:fileId', auth, async (req, res) => {
  try {
    const file = await File.findOne({ 
      _id: req.params.fileId,
      owner: req.user._id 
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete encrypted file from disk
    fs.unlink(file.encryptedPath, (err) => {
      if (err) console.error('Error deleting file from disk:', err);
    });

    // Delete file record from database
    await File.findByIdAndDelete(req.params.fileId);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Error deleting file' });
  }
});

export default router;