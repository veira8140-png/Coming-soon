
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
  const rootStyle: React.CSSProperties = {
    width: size,
    height: size,
  };

  return (
    <div 
      className={`organic-orb-root ${variant === 'hero' ? 'orb-hero' : ''} ${className}`} 
      style={rootStyle}
    >
      <div className="orb-visual">
        {variant === 'hero' && (
          <>
            <div className="orb-rim" />
            <div className="orb-streak" />
          </>
        )}
      </div>
    </div>
  );
};

export default OrganicOrbLogo;
