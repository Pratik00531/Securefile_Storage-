import React, { useState } from 'react';
import { motion } from 'framer-motion';

const HolographicInput = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  icon: Icon,
  required = false,
  error,
  ...props 
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="holographic-input-container" style={{ marginBottom: '20px' }}>
      {label && (
        <motion.label
          className="holographic-label"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'block',
            color: '#00ffff',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          {Icon && <Icon size={16} style={{ marginRight: '8px' }} />}
          {label}
          {required && <span style={{ color: '#ff0040' }}>*</span>}
        </motion.label>
      )}
      
      <motion.div
        className="input-wrapper"
        style={{
          position: 'relative',
          background: 'rgba(0, 255, 255, 0.05)',
          border: `2px solid ${focused ? '#00ffff' : 'rgba(0, 255, 255, 0.3)'}`,
          borderRadius: '8px',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
        whileHover={{ borderColor: '#00ffff60' }}
      >
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: '15px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#ffffff',
            fontSize: '16px',
            fontFamily: 'monospace'
          }}
          {...props}
        />
        
        {focused && (
          <motion.div
            className="input-glow"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #00ffff, transparent)',
              transformOrigin: 'center'
            }}
          />
        )}
      </motion.div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            color: '#ff0040',
            fontSize: '12px',
            marginTop: '5px',
            fontFamily: 'monospace'
          }}
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default HolographicInput;