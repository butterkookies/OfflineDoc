import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

interface SubtitleProps {
  text: string;
  tag?: string;
}

export const Subtitles: React.FC<SubtitleProps> = ({ text, tag = 'VOICEOVER' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 48,
        left: '50%',
        transform: `translateX(-50%) translateY(${(1 - entrance) * 15}px)`,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 28px',
        borderRadius: 999,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45)',
        maxWidth: 1600,
        zIndex: 50,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          borderRadius: 999,
          background: 'rgba(14, 165, 233, 0.2)',
          border: '1px solid rgba(14, 165, 233, 0.4)',
          color: '#38bdf8',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: '#38bdf8',
            boxShadow: '0 0 8px #38bdf8',
          }}
        />
        {tag}
      </span>
      <span
        style={{
          color: '#f8fafc',
          fontSize: 22,
          fontWeight: 600,
          fontFamily: 'Inter, system-ui, sans-serif',
          letterSpacing: '-0.01em',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        }}
      >
        "{text}"
      </span>
    </div>
  );
};