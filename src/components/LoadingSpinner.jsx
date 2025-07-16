import React from 'react';

const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : '';
  
  return (
    <div className="d-flex justify-content-center align-items-center p-3">
      <div className={`spinner-border text-primary ${sizeClass}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;