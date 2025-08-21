import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import File from '../models/File.js';
import auth from '../middleware/auth.js';
import fileAuth from '../middleware/fileAuth.js';
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
    fileSize: 100 * 1024 * 1024 // 100MB limit (increased from 10MB)
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types with size validation
    const allowedTypes = [
      // Images
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      // Documents
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      // Text files
      'text/plain', 'text/csv', 'application/json', 'application/xml',
      // Archives
      'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
      // Videos
      'video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo',
      // Audio
      'audio/mpeg', 'audio/wav', 'audio/ogg',
      // Other common types
      'application/octet-stream'
    ];

    // For security, you can uncomment the line below to restrict file types
    // if (!allowedTypes.includes(file.mimetype)) {
    //   return cb(new Error('File type not allowed'), false);
    // }
    
    cb(null, true);
  }
});

// Upload file
router.post('/upload', fileAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Log upload attempt
    console.log(`File upload initiated by user ${req.user.username} (${req.user._id}): ${req.file.originalname}`);

    // File type validation and category detection
    const getFileCategory = (mimetype) => {
      if (mimetype.startsWith('image/')) return 'image';
      if (mimetype.startsWith('video/')) return 'video';
      if (mimetype.startsWith('audio/')) return 'audio';
      if (mimetype.includes('pdf')) return 'document';
      if (mimetype.includes('word') || mimetype.includes('document')) return 'document';
      if (mimetype.includes('excel') || mimetype.includes('sheet')) return 'spreadsheet';
      if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) return 'presentation';
      if (mimetype.includes('zip') || mimetype.includes('rar') || mimetype.includes('7z')) return 'archive';
      if (mimetype.startsWith('text/')) return 'text';
      return 'other';
    };

    const fileCategory = getFileCategory(req.file.mimetype);

    // Verify user has encryption key
    if (!req.user.encryptionKey) {
      // Clean up uploaded file if encryption key is missing
      fs.unlinkSync(req.file.path);
      return res.status(500).json({ 
        error: 'User encryption key not found. Cannot secure file.',
        code: 'ENCRYPTION_KEY_MISSING'
      });
    }

    // Encrypt the file using AES-256-CBC
    let encryptedPath;
    try {
      encryptedPath = await encryptFile(req.file.path, req.user.encryptionKey);
      console.log(`File encrypted successfully: ${encryptedPath}`);
    } catch (encryptionError) {
      console.error('File encryption failed:', encryptionError);
      // Clean up uploaded file if encryption fails
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(500).json({ 
        error: 'File encryption failed. Upload aborted for security.',
        code: 'ENCRYPTION_FAILED'
      });
    }

    // Save file metadata to database
    const file = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      category: fileCategory,
      encryptedPath,
      owner: req.user._id,
      encryptionStatus: 'encrypted', // Add encryption status field
      uploadedAt: new Date()
    });

    await file.save();

    // Log successful upload
    console.log(`File uploaded and encrypted successfully: ${file._id} by user ${req.user.username}`);

    res.status(201).json({
      message: 'File uploaded and encrypted successfully',
      file: {
        id: file._id,
        originalName: file.originalName,
        size: file.size,
        category: file.category,
        mimetype: file.mimetype,
        uploadDate: file.createdAt,
        encrypted: true
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up files on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    // Handle specific multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 100MB.' });
    }
    
    if (error.message === 'File type not allowed') {
      return res.status(400).json({ error: 'File type not supported.' });
    }
    
    res.status(500).json({ error: 'Error uploading file' });
  }
});

// Upload multiple files
router.post('/upload-multiple', fileAuth, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = [];
    const errors = [];

    for (const file of req.files) {
      try {
        const getFileCategory = (mimetype) => {
          if (mimetype.startsWith('image/')) return 'image';
          if (mimetype.startsWith('video/')) return 'video';
          if (mimetype.startsWith('audio/')) return 'audio';
          if (mimetype.includes('pdf')) return 'document';
          if (mimetype.includes('word') || mimetype.includes('document')) return 'document';
          if (mimetype.includes('excel') || mimetype.includes('sheet')) return 'spreadsheet';
          if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) return 'presentation';
          if (mimetype.includes('zip') || mimetype.includes('rar') || mimetype.includes('7z')) return 'archive';
          if (mimetype.startsWith('text/')) return 'text';
          return 'other';
        };

        const fileCategory = getFileCategory(file.mimetype);
        const encryptedPath = await encryptFile(file.path, req.user.encryptionKey);

        const newFile = new File({
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          category: fileCategory,
          encryptedPath,
          owner: req.user._id
        });

        await newFile.save();
        uploadedFiles.push({
          id: newFile._id,
          originalName: newFile.originalName,
          size: newFile.size,
          category: newFile.category,
          mimetype: newFile.mimetype,
          uploadDate: newFile.createdAt
        });
      } catch (error) {
        errors.push({
          filename: file.originalname,
          error: error.message
        });
      }
    }

    res.status(201).json({
      message: `${uploadedFiles.length} files uploaded successfully`,
      uploadedFiles,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ error: 'Error uploading files' });
  }
});

// Get user files with filtering and pagination
router.get('/my-files', fileAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    
    let query = { owner: req.user._id };
    
    // Add category filter
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Add search filter
    if (search) {
      query.originalName = { $regex: search, $options: 'i' };
    }
    
    const files = await File.find(query)
      .select('-encryptedPath -__v')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await File.countDocuments(query);

    res.json({
      files,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalFiles: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Error fetching files' });
  }
});

// Download file with enhanced security
router.get('/download/:fileId', fileAuth, async (req, res) => {
  try {
    const file = await File.findOne({ 
      _id: req.params.fileId,
      owner: req.user._id 
    });

    if (!file) {
      console.log(`Download attempt for non-existent file: ${req.params.fileId} by user ${req.user.username}`);
      return res.status(404).json({ error: 'File not found or access denied' });
    }

    // Check if encrypted file still exists
    if (!fs.existsSync(file.encryptedPath)) {
      console.error(`Encrypted file missing: ${file.encryptedPath}`);
      return res.status(404).json({ 
        error: 'File data not found on server',
        code: 'FILE_DATA_MISSING'
      });
    }

    console.log(`File download initiated: ${file.originalName} by user ${req.user.username}`);

    // Verify user has encryption key
    if (!req.user.encryptionKey) {
      return res.status(500).json({ 
        error: 'Decryption key not available',
        code: 'DECRYPTION_KEY_MISSING'
      });
    }

    // Create temporary decrypted file with unique name
    const tempPath = path.join(uploadsDir, `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.originalName}`);
    
    try {
      await decryptFile(file.encryptedPath, req.user.encryptionKey, tempPath);
      console.log(`File decrypted successfully: ${file.originalName}`);
    } catch (decryptionError) {
      console.error('File decryption failed:', decryptionError);
      return res.status(500).json({ 
        error: 'File decryption failed',
        code: 'DECRYPTION_FAILED'
      });
    }

    // Update download count
    file.downloadCount = (file.downloadCount || 0) + 1;
    file.lastDownloaded = new Date();
    await file.save();

    // Send file with proper headers and clean up
    res.download(tempPath, file.originalName, (err) => {
      if (err) {
        console.error('Download transmission error:', err);
        res.status(500).json({ error: 'Error transmitting file' });
      } else {
        console.log(`File downloaded successfully: ${file.originalName} by user ${req.user.username}`);
      }
      
      // Clean up temporary file
      fs.unlink(tempPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error cleaning up temp file:', unlinkErr);
        }
      });
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Error downloading file' });
  }
});

// Delete file
router.delete('/:fileId', fileAuth, async (req, res) => {
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