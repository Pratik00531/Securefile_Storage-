import React from 'react';
import { motion } from 'framer-motion';

const NeonButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  loading = false,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: {
      color: '#00ffff',
      shadow: '0 0 20px #00ffff'
    },
    secondary: {
      color: '#ff00ff',
      shadow: '0 0 20px #ff00ff'
    },
    success: {
      color: '#00ff00',
      shadow: '0 0 20px #00ff00'
    },
    danger: {
      color: '#ff0040',
      shadow: '0 0 20px #ff0040'
    }
  };

  const currentVariant = variants[variant];

  return (
    <motion.button
      className={`neon-button ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: 'transparent',
        border: `2px solid ${currentVariant.color}`,
        color: currentVariant.color,
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: disabled ? 'none' : currentVariant.shadow,
        opacity: disabled ? 0.5 : 1
      }}
      {...props}
    >
      <motion.div
        className="button-glow"
        style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${currentVariant.color}40, transparent)`,
        }}
        animate={{
          left: disabled ? '-100%' : ['−100%', '100%']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      
      <span style={{ position: 'relative', zIndex: 1 }}>
        {loading ? (
          <div className="loading-spinner" style={{
            width: '20px',
            height: '20px',
            border: `2px solid ${currentVariant.color}40`,
            borderTop: `2px solid ${currentVariant.color}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            display: 'inline-block'
          }} />
        ) : children}
      </span>
    </motion.button>
  );
};

export default NeonButton;