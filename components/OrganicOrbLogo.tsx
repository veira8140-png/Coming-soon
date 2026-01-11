
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface OrganicOrbLogoProps {
  size?: number;
  className?: string;
  variant?: 'nav' | 'hero';
}

const OrganicOrbLogo: React.FC<OrganicOrbLogoProps> = ({ 
  size = 32, 
  className = "",
  variant = 'nav'
}) => {
  return (
    <div className={`organic-orb-container ${variant} ${className}`} style={{ width: size, height: size }}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="organic-orb-svg"
      >
        <defs>
          <linearGradient id="orb-gradient-main" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--orb-violet)" />
            <stop offset="100%" stopColor="var(--orb-pink)" />
          </linearGradient>
          
          <radialGradient id="orb-highlight" cx="30%" cy="30%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          <filter id="orb-inner-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* The "Living" Base */}
        <path 
          className="orb-morphing-base"
          d="M16 2C24 2 30 8 30 16C30 24 24 30 16 30C8 30 2 24 2 16C2 8 8 2 16 2Z"
          fill="url(#orb-gradient-main)"
          filter={variant === 'hero' ? 'url(#orb-inner-glow)' : ''}
        />
        
        {/* Subtle highlight for dimensionality */}
        <circle cx="12" cy="12" r="8" fill="url(#orb-highlight)" />
        
        {/* Subtle noise/texture would go here in a real SVG, but we use CSS for fluid feel */}
      </svg>
    </div>
  );
};

export default OrganicOrbLogo;
