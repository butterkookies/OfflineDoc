import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

interface SubtitleProps {
  text: string;
}

export const Subtitles: React.FC<SubtitleProps> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 36,
        left: '50%',
        transform: `translateX(-50%) translateY(${(1 - entrance) * 12}px)`,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 24px',
        borderRadius: 999,
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(226, 232, 240, 0.9)',
        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
        maxWidth: 1500,
        zIndex: 50,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#2563eb',
        }}
      />
      <span
        style={{
          color: '#1e293b',
          fontSize: 20,
          fontWeight: 600,
          fontFamily: 'Inter, system-ui, sans-serif',
          letterSpacing: '-0.01em',
        }}
      >
        "{text}"
      </span>
    </div>
  );
};