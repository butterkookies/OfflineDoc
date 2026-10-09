import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { AnimatedSystemLogo } from '../components/AnimatedSystemLogo';

export const Scene8Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
        <AnimatedSystemLogo
          size={200}
          showText={true}
          slogan="LOCAL INTELLIGENCE FOR BETTER DOCUMENTATION, ANYWHERE."
          delay={5}
          layout="horizontal"
        />

        {/* Nationwide Deployment Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginTop: 48,
            opacity: frame > 45 ? Math.min(1, (frame - 45) / 20) : 0,
            transform: `translateY(${frame > 45 ? 0 : 12}px)`,
          }}
        >
          <div
            style={{
              padding: '10px 20px',
              backgroundColor: '#EFF6FF',
              borderRadius: 30,
              border: '1px solid #BFDBFE',
              fontSize: 14,
              fontWeight: 800,
              color: '#1E40AF',
              letterSpacing: '0.04em',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            100% AIR-GAPPED & LOCAL
          </div>
          <div
            style={{
              padding: '10px 20px',
              backgroundColor: '#F0FDF4',
              borderRadius: 30,
              border: '1px solid #BBF7D0',
              fontSize: 14,
              fontWeight: 800,
              color: '#166534',
              letterSpacing: '0.04em',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            DOH FORM 1 / KONSULTA READY
          </div>
          <div
            style={{
              padding: '10px 20px',
              backgroundColor: '#FAF5FF',
              borderRadius: 30,
              border: '1px solid #E9D5FF',
              fontSize: 14,
              fontWeight: 800,
              color: '#6B21A8',
              letterSpacing: '0.04em',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            RA 10173 & RA 7883 COMPLIANT
          </div>
        </div>
      </div>

      <Subtitles text="OfflineDoc, local intelligence for better documentation, anywhere." />
    </div>
  );
};