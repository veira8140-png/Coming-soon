
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
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`organic-orb-svg ${className}`}
    >
      <defs>
        <linearGradient id="orb-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--orb-violet)" />
          <stop offset="100%" stopColor="var(--orb-pink)" />
        </linearGradient>
        <filter id="orb-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <circle 
        cx="16" 
        cy="16" 
        r="14" 
        fill="url(#orb-gradient)" 
        filter={variant === 'hero' ? 'url(#orb-glow)' : ''}
      />
      <circle cx="12" cy="12" r="4" fill="white" fillOpacity="0.2" />
    </svg>
  );
};

export default OrganicOrbLogo;
