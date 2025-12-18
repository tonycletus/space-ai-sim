import React, { useEffect, useRef, useState } from 'react';
import { OrbitType } from '../types';
import { R_EARTH } from '../constants';

interface OrbitVizProps {
  orbitType: OrbitType;
  altitude: number;
}

export const OrbitViz: React.FC<OrbitVizProps> = ({ orbitType, altitude }) => {
  const [angle, setAngle] = useState(0);
  const requestRef = useRef<number>();
  
  // Animation loop
  const animate = () => {
    setAngle(prev => (prev + 1) % 360);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  // Scaling Logic
  const earthRadiusKm = R_EARTH / 1000;
  const orbitRadiusKm = earthRadiusKm + altitude;
  const orbitPx = 100;
  const earthPx = (earthRadiusKm / orbitRadiusKm) * orbitPx;

  // Orbit parameters for visual flair
  const isSSO = orbitType === OrbitType.SSO;
  
  // Calculate satellite position
  const rad = (angle * Math.PI) / 180;
  const satX = 150 + orbitPx * Math.cos(rad);
  const satY = 150 + orbitPx * Math.sin(rad);

  // Eclipse Logic Visualization
  const isInShadow = satX < 150 && Math.abs(satY - 150) < earthPx * 0.8; // Simplified shadow check

  return (
    <div className="w-full relative">
      <div className="w-full aspect-square max-w-[320px] mx-auto relative bg-black rounded-full overflow-hidden border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.8)_inset]">
        {/* Starfield Background */}
        <div className="absolute inset-0 opacity-30" style={{ 
          backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
          backgroundSize: '20px 20px' 
        }}></div>

        <svg viewBox="0 0 300 300" className="w-full h-full relative z-10">
          <defs>
            <radialGradient id="earthGrad" cx="70%" cy="30%" r="90%">
              <stop offset="0%" stopColor="#2563eb" /> {/* blue-600 */}
              <stop offset="100%" stopColor="#0f172a" /> {/* slate-900 */}
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Sun Direction Indicator */}
          <path d="M 280 140 L 290 150 L 280 160" stroke="#fbbf24" strokeWidth="2" fill="none" />
          <line x1="250" y1="150" x2="290" y2="150" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 4" />
          <text x="250" y="140" fill="#fbbf24" fontSize="10" textAnchor="end">Sunlight</text>

          {/* Orbit Path */}
          <circle 
            cx="150" 
            cy="150" 
            r={orbitPx} 
            fill="none" 
            stroke="#475569" 
            strokeWidth="1" 
            strokeDasharray="5 5"
          />

          {/* Earth */}
          <circle 
            cx="150" 
            cy="150" 
            r={earthPx} 
            fill="url(#earthGrad)" 
            stroke="#1e3a8a"
            strokeWidth="1"
          />
          
          {/* Night Side Shadow Overlay on Earth */}
          <path 
            d={`M 150 ${150-earthPx} A ${earthPx} ${earthPx} 0 0 0 150 ${150+earthPx} Z`}
            fill="rgba(0,0,0,0.7)"
          />

          {/* Satellite */}
          <g filter="url(#glow)">
            <circle 
              cx={satX} 
              cy={satY} 
              r="4" 
              fill={isInShadow && orbitType !== OrbitType.SSO ? "#ef4444" : "#22d3ee"} 
              stroke="white" 
              strokeWidth="1.5"
            />
            {/* Solar Panels */}
            <line 
              x1={satX - 6} y1={satY - 6} 
              x2={satX + 6} y2={satY + 6} 
              stroke={isInShadow && orbitType !== OrbitType.SSO ? "#7f1d1d" : "#0ea5e9"} 
              strokeWidth="3" 
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
      
      {/* HTML Overlay Text (Outside SVG to prevent clipping/collisions) */}
      <div className="text-center mt-2 text-[10px] text-gray-400 font-mono tracking-wide">
        Scale: Earth r={earthRadiusKm.toFixed(0)}km | Orbit h={altitude.toFixed(0)}km
      </div>
    </div>
  );
};