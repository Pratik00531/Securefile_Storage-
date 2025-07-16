import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Some actions like registration happen before user creation
  },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: false // Some actions might not involve a specific file
  },
  action: {
    type: String,
    required: true,
    enum: [
      'USER_REGISTER',
      'USER_LOGIN',
      'USER_LOGOUT',
      'USER_LOGIN_FAILED',
      'USER_PASSWORD_CHANGE',
      'FILE_UPLOAD',
      'FILE_DOWNLOAD',
      'FILE_DELETE',
      'FILE_SHARE',
      'FILE_UNSHARE',
      'FILE_VIEW',
      'ADMIN_ACTION'
    ]
  },
  details: {
    type: mongoose.Schema.Types.Mixed, // Flexible field for action-specific data
    default: {}
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: false
  },
  success: {
    type: Boolean,
    default: true
  },
  errorMessage: {
    type: String,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false // We're using our own timestamp field
});

// Indexes for efficient querying
auditLogSchema.index({ user: 1, timestamp: -1 });
auditLogSchema.index({ file: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ ipAddress: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });

// TTL index to automatically remove old logs after 1 year
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 31536000 }); // 365 days

// Static method to log an action
auditLogSchema.statics.logAction = async function(actionData) {
  try {
    const log = new this(actionData);
    await log.save();
    return log;
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw error to avoid breaking the main operation
  }
};

// Static method to get user activity
auditLogSchema.statics.getUserActivity = async function(userId, limit = 50) {
  return this.find({ user: userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('file', 'originalName mimetype')
    .lean();
};

// Static method to get file activity
auditLogSchema.statics.getFileActivity = async function(fileId, limit = 20) {
  return this.find({ file: fileId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('user', 'username email')
    .lean();
};

export default mongoose.model('AuditLog', auditLogSchema);
