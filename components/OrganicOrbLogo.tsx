
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface OrganicOrbLogoProps {
  size?: number;
  className?: string;
}

const OrganicOrbLogo: React.FC<OrganicOrbLogoProps> = ({ size = 32, className = "" }) => {
  return (
    <div 
      className={`organic-orb-container ${className}`}
      style={{ 
        width: size, 
        height: size, 
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div className="orb-glow" />
      <div className="orb-core" />
      <style dangerouslySetInnerHTML={{ __html: `
        .organic-orb-container {
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
        }
        
        .orb-core {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, 
            #ffffff 0%, 
            #a855f7 30%, 
            #3b82f6 60%, 
            #000000 100%
          );
          background-size: 200% 200%;
          animation: orb-morph 8s ease-in-out infinite, orb-color 10s linear infinite;
          position: relative;
          z-index: 2;
          overflow: hidden;
        }

        .orb-core::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 50%);
          animation: orb-shimmer 4s ease-in-out infinite;
        }

        .orb-glow {
          position: absolute;
          width: 140%;
          height: 140%;
          background: radial-gradient(circle at center, rgba(168, 85, 247, 0.4) 0%, transparent 70%);
          border-radius: 50%;
          z-index: 1;
          filter: blur(8px);
          animation: orb-pulse 4s ease-in-out infinite;
        }

        @keyframes orb-morph {
          0%, 100% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; transform: scale(1); }
          25% { border-radius: 70% 30% 46% 54% / 30% 29% 71% 70%; transform: scale(1.05) rotate(5deg); }
          50% { border-radius: 50% 50% 34% 66% / 56% 68% 32% 44%; transform: scale(0.95) rotate(-5deg); }
          75% { border-radius: 46% 54% 50% 50% / 35% 61% 39% 65%; transform: scale(1.02) rotate(2deg); }
        }

        @keyframes orb-pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }

        @keyframes orb-shimmer {
          0%, 100% { transform: translate(-10%, -10%); }
          50% { transform: translate(10%, 10%); }
        }

        @keyframes orb-color {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}} />
    </div>
  );
};

export default OrganicOrbLogo;
