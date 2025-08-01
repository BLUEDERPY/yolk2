import React from 'react';

interface DividerProps {
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ className = '' }) => {
  return (
    <div className={`h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent ${className}`} />
  );
};