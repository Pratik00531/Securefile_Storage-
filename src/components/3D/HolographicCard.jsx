import React from 'react';
import { motion } from 'framer-motion';

const HolographicCard = ({ children, className = '', glowColor = '#00ffff', ...props }) => {
  return (
    <motion.div
      className={`holographic-card ${className}`}
      initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      whileHover={{ 
        scale: 1.02, 
        rotateY: 5,
        boxShadow: `0 0 30px ${glowColor}40`
      }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(255, 0, 255, 0.1) 100%)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${glowColor}40`,
        borderRadius: '15px',
        boxShadow: `0 0 20px ${glowColor}20, inset 0 0 20px rgba(255, 255, 255, 0.1)`,
        position: 'relative',
        overflow: 'hidden'
      }}
      {...props}
    >
      <div 
        className="holographic-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${glowColor}20, transparent)`,
          animation: 'holographic-sweep 3s infinite'
        }}
      />
      {children}
    </motion.div>
  );
};

export default HolographicCard;