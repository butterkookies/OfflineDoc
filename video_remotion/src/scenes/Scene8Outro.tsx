import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { Badge } from '../components/Badge';

export const Scene8Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({ frame, fps, config: { damping: 12, stiffness: 90 } });
  const textSpring = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 100 } });
  const footerSpring = spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 100 } });

  const glowPulse = Math.sin(frame * 0.1) * 20 + 40;

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden' }}>
      <GridBackground accentColor="#0ea5e9" />

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1920,
          height: 960,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ opacity: textSpring, transform: `translateY(${(1 - textSpring) * 20}px)` }}>
          <Badge
            label="SOVEREIGN LOCAL AI FOR EVERY BARANGAY"
            color="#38bdf8"
            bgColor="rgba(14, 165, 233, 0.2)"
            icon={<span style={{ fontSize: 16 }}>🇵🇭</span>}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 40,
            marginTop: 28,
            transform: `scale(${logoSpring})`,
          }}
        >
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: 40,
              overflow: 'hidden',
              boxShadow: `0 0 ${glowPulse}px rgba(14, 165, 233, 0.8), 0 25px 50px rgba(0,0,0,0.7)`,
              border: '4px solid rgba(56, 189, 248, 0.8)',
              background: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Img
              src={staticFile('OfflineDoc-logo.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1
              style={{
                fontSize: 100,
                fontWeight: 900,
                color: '#ffffff',
                margin: 0,
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                textShadow: '0 4px 30px rgba(14, 165, 233, 0.5)',
              }}
            >
              Offline<span style={{ color: '#38bdf8' }}>Doc</span>
            </h1>
            <span
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: '#38bdf8',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginTop: 8,
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              Local Intelligence Anywhere
            </span>
          </div>
        </div>

        <h2
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: '#f8fafc',
            textAlign: 'center',
            maxWidth: 1200,
            margin: '36px 0 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
            opacity: textSpring,
            transform: `translateY(${(1 - textSpring) * 20}px)`,
          }}
        >
          Local Intelligence for Better Documentation, Anywhere.
        </h2>

        <div
          style={{
            display: 'flex',
            gap: 20,
            marginTop: 40,
            opacity: footerSpring,
            transform: `translateY(${(1 - footerSpring) * 20}px)`,
          }}
        >
          <div
            style={{
              padding: '14px 28px',
              borderRadius: 999,
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#e2e8f0',
              fontSize: 18,
              fontWeight: 700,
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            ⚡ Powered by Whisper & Llama C++
          </div>
          <div
            style={{
              padding: '14px 28px',
              borderRadius: 999,
              background: 'rgba(14, 165, 233, 0.2)',
              border: '1px solid #38bdf8',
              color: '#38bdf8',
              fontSize: 18,
              fontWeight: 700,
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            🇵🇭 Built for 42,000+ Philippine Barangays
          </div>
        </div>
      </div>

      <Subtitles text="OfflineDoc, local intelligence for better documentation, anywhere." />
    </div>
  );
};