import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Access denied. No valid token provided.',
        code: 'NO_TOKEN'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Token has expired. Please login again.',
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

    // Check if user still exists
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        error: 'User associated with this token no longer exists.',
        code: 'USER_NOT_FOUND'
      });
    }

    // Check if user account is active (you can add an 'active' field to User model if needed)
    // if (!user.active) {
    //   return res.status(401).json({ 
    //     error: 'User account is deactivated.',
    //     code: 'ACCOUNT_DEACTIVATED'
    //   });
    // }

    // Add user info to request object
    req.user = user;
    req.token = token;
    
    // Log authentication for audit purposes
    console.log(`User ${user.username} (${user._id}) authenticated at ${new Date().toISOString()}`);
    
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ 
      error: 'Authentication server error.',
      code: 'AUTH_SERVER_ERROR'
    });
  }
};

export default auth;