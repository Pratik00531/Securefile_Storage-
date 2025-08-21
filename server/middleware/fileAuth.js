import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

// Enhanced authentication middleware specifically for file operations
const fileAuth = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      await logFileAccess(req, null, 'UNAUTHORIZED_ACCESS_ATTEMPT', false);
      return res.status(401).json({ 
        error: 'Access denied. Authentication required for file operations.',
        code: 'NO_TOKEN'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify JWT token with enhanced validation
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'SecureFileStorage',
        audience: 'secure-file-users'
      });
    } catch (jwtError) {
      await logFileAccess(req, null, 'INVALID_TOKEN_ACCESS', false);
      
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Token has expired. Please login again to access files.',
          code: 'TOKEN_EXPIRED'
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          error: 'Invalid token format.',
          code: 'INVALID_TOKEN'
        });
      } else {
        return res.status(401).json({ 
          error: 'Token verification failed.',
          code: 'TOKEN_VERIFICATION_FAILED'
        });
      }
    }

    // Verify token type
    if (decoded.type !== 'access_token') {
      await logFileAccess(req, decoded.userId, 'INVALID_TOKEN_TYPE', false);
      return res.status(401).json({ 
        error: 'Invalid token type for file operations.',
        code: 'INVALID_TOKEN_TYPE'
      });
    }

    // Check if user still exists and is active
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      await logFileAccess(req, decoded.userId, 'USER_NOT_FOUND', false);
      return res.status(401).json({ 
        error: 'User associated with this token no longer exists.',
        code: 'USER_NOT_FOUND'
      });
    }

    // Check token freshness (optional: reject tokens older than certain time)
    const tokenAge = Date.now() / 1000 - decoded.iat;
    const MAX_TOKEN_AGE = 7 * 24 * 60 * 60; // 7 days in seconds
    
    if (tokenAge > MAX_TOKEN_AGE) {
      await logFileAccess(req, user._id, 'TOKEN_TOO_OLD', false);
      return res.status(401).json({ 
        error: 'Token is too old. Please login again.',
        code: 'TOKEN_TOO_OLD'
      });
    }

    // Add user info to request object
    req.user = user;
    req.token = token;
    req.tokenPayload = decoded;
    
    // Log successful authentication
    await logFileAccess(req, user._id, 'AUTHENTICATED_ACCESS', true);
    
    next();
  } catch (error) {
    console.error('File authentication middleware error:', error);
    await logFileAccess(req, null, 'AUTH_SERVER_ERROR', false);
    res.status(500).json({ 
      error: 'Authentication server error.',
      code: 'AUTH_SERVER_ERROR'
    });
  }
};

// Helper function to log file access attempts
const logFileAccess = async (req, userId, action, success) => {
  try {
    const auditLog = new AuditLog({
      userId: userId || null,
      action,
      resourceType: 'FILE_ACCESS',
      resourceId: req.params.fileId || req.body.fileId || null,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      success,
      metadata: {
        method: req.method,
        url: req.url,
        timestamp: new Date()
      }
    });
    
    await auditLog.save();
  } catch (logError) {
    console.error('Failed to log file access:', logError);
  }
};

export default fileAuth;
