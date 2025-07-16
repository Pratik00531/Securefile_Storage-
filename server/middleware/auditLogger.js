import AuditLog from '../models/AuditLog.js';

// Middleware to create audit logs
export const auditLogger = (action, includeFileId = false) => {
  return async (req, res, next) => {
    // Store original res.json to intercept response
    const originalJson = res.json;

    res.json = function(data) {
      // Only log if the request was successful (status < 400)
      if (res.statusCode < 400) {
        // Prepare audit log data
        const auditData = {
          user: req.user?._id,
          action: action,
          ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
          userAgent: req.get('User-Agent') || 'unknown',
          sessionId: req.sessionID,
          success: true,
          details: {
            method: req.method,
            url: req.originalUrl,
            body: req.method !== 'GET' ? req.body : undefined,
            params: req.params,
            query: req.query
          }
        };

        // Include file ID if specified and available
        if (includeFileId) {
          if (req.params.id) {
            auditData.file = req.params.id;
          } else if (data.file && data.file._id) {
            auditData.file = data.file._id;
          } else if (data.file && data.file.id) {
            auditData.file = data.file.id;
          }
        }

        // Log the action asynchronously
        AuditLog.logAction(auditData).catch(err => {
          console.error('Audit logging failed:', err);
        });
      } else {
        // Log failed action
        const auditData = {
          user: req.user?._id,
          action: action,
          ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
          userAgent: req.get('User-Agent') || 'unknown',
          sessionId: req.sessionID,
          success: false,
          errorMessage: data.error || 'Unknown error',
          details: {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode
          }
        };

        AuditLog.logAction(auditData).catch(err => {
          console.error('Audit logging failed:', err);
        });
      }

      // Call the original res.json
      return originalJson.call(this, data);
    };

    next();
  };
};

// Specific audit middleware for common actions
export const auditFileUpload = auditLogger('file_upload', true);
export const auditFileDownload = auditLogger('file_download', true);
export const auditFileDelete = auditLogger('file_delete', true);
export const auditFileShare = auditLogger('file_share', true);
export const auditUserLogin = auditLogger('user_login');
export const auditUserRegister = auditLogger('user_register');
export const auditProfileUpdate = auditLogger('profile_update');
