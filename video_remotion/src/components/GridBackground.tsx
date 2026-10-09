import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export const GridBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const barWidth = interpolate(frame, [0, 45], [0, 600], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1920,
        height: 1080,
        backgroundColor: '#f5f7fb',
        backgroundImage: `
          radial-gradient(circle at 50% 10%, rgba(37, 99, 235, 0.03) 0%, transparent 60%),
          radial-gradient(circle at 90% 90%, rgba(16, 185, 129, 0.03) 0%, transparent 50%),
          linear-gradient(to right, rgba(15, 23, 42, 0.015) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(15, 23, 42, 0.015) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 60px 60px, 60px 60px',
        overflow: 'hidden',
      }}
    >
      {/* Subtle top ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: -200,
          left: '25%',
          width: 900,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Bottom left signature gradient bar like reference */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: barWidth,
          height: 6,
          background: 'linear-gradient(to right, #2563eb, #10b981)',
          borderRadius: '0 4px 0 0',
        }}
      />
    </div>
  );
};