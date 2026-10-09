import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';

export const Scene8Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({ frame, fps, config: { damping: 12, stiffness: 90 } });
  const textSpring = spring({ frame: frame - 12, fps, config: { damping: 14, stiffness: 100 } });
  const underlineWidth = interpolate(frame, [15, 60], [0, 480], { extrapolateRight: 'clamp' });

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#f5f7fb' }}>
      <GridBackground />

      {/* Center Grand Outro */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1920,
          height: 1080,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Main Logo Container */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            transform: `scale(${logoSpring})`,
          }}
        >
          {/* Document Logo with Pulse & Checkmark */}
          <div
            style={{
              position: 'relative',
              width: 120,
              height: 120,
              borderRadius: '50%',
              border: '2px solid #2563eb',
              backgroundColor: '#ffffff',
              boxShadow: '0 12px 30px rgba(37, 99, 235, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              {/* Pulse line */}
              <path d="M8 14h2l1-2 2 4 1-2h2" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {/* Checkmark badge */}
            <div
              style={{
                position: 'absolute',
                bottom: 2,
                right: 2,
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: '#2dd4bf',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                fontWeight: 900,
                boxShadow: '0 2px 8px rgba(45, 212, 191, 0.4)',
              }}
            >
              ✓
            </div>
          </div>

          {/* OfflineDoc Text */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1
              style={{
                fontSize: 104,
                fontWeight: 900,
                margin: 0,
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              <span style={{ color: '#0f172a' }}>Offline</span>
              <span style={{ color: '#2563eb' }}>Doc</span>
            </h1>

            {/* Horizontal Blue Underline Bar */}
            <div
              style={{
                marginTop: 12,
                width: underlineWidth,
                height: 5,
                backgroundColor: '#2563eb',
                borderRadius: 3,
              }}
            />
          </div>
        </div>

        {/* Grand Slogan */}
        <h2
          style={{
            fontSize: 26,
            fontWeight: 800,
            textAlign: 'center',
            margin: '44px 0 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            opacity: textSpring,
            transform: `translateY(${(1 - textSpring) * 20}px)`,
          }}
        >
          <span style={{ color: '#94a3b8' }}>LOCAL INTELLIGENCE FOR BETTER </span>
          <span style={{ color: '#2563eb' }}>DOCUMENTATION, ANYWHERE.</span>
        </h2>
      </div>

      <Subtitles text="OfflineDoc, local intelligence for better documentation, anywhere." />
    </div>
  );
};