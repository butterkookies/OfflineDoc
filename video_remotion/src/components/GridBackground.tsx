import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export const GridBackground: React.FC<{ accentColor?: string }> = ({
  accentColor = '#0ea5e9',
}) => {
  const frame = useCurrentFrame();
  const offsetY = (frame * 0.4) % 40;
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1920,
        height: 1080,
        backgroundColor: '#070b14',
        backgroundImage: `
          radial-gradient(circle at 50% 20%, ${accentColor}18 0%, transparent 65%),
          radial-gradient(circle at 80% 80%, #6366f112 0%, transparent 50%),
          linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
        backgroundPosition: `0 0, 0 0, 0 ${offsetY}px, 0 ${offsetY}px`,
        opacity,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -100,
          left: '10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
          filter: 'blur(60px)',
          transform: `translateY(${Math.sin(frame * 0.03) * 20}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -150,
          right: '15%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #3b82f61a 0%, transparent 70%)',
          filter: 'blur(70px)',
          transform: `translateY(${Math.cos(frame * 0.025) * 25}px)`,
        }}
      />
    </div>
  );
};