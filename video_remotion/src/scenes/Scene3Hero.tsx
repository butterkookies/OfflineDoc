import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { Badge } from '../components/Badge';

export const Scene3Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({ frame, fps, config: { damping: 12, stiffness: 90 } });
  const textSpring = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 100 } });
  const featureSpring = spring({ frame: frame - 35, fps, config: { damping: 14, stiffness: 100 } });

  const glowPulse = Math.sin(frame * 0.08) * 15 + 35;
  const rotation = Math.sin(frame * 0.03) * 3;

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
            label="THE NEXT-GEN HEALTHCARE SOLUTION"
            color="#38bdf8"
            bgColor="rgba(14, 165, 233, 0.2)"
            icon={<span style={{ fontSize: 16 }}>🚀</span>}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 40,
            marginTop: 28,
            transform: `scale(${logoSpring}) rotate(${rotation}deg)`,
          }}
        >
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: 36,
              overflow: 'hidden',
              boxShadow: `0 0 ${glowPulse}px rgba(14, 165, 233, 0.6), 0 20px 40px rgba(0,0,0,0.6)`,
              border: '3px solid rgba(56, 189, 248, 0.6)',
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
                fontSize: 92,
                fontWeight: 900,
                color: '#ffffff',
                margin: 0,
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                textShadow: '0 4px 20px rgba(14, 165, 233, 0.4)',
              }}
            >
              Offline<span style={{ color: '#38bdf8' }}>Doc</span>
            </h1>
            <span
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: '#38bdf8',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginTop: 6,
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              Autonomous Medical Intelligence
            </span>
          </div>
        </div>

        <p
          style={{
            fontSize: 34,
            fontWeight: 600,
            color: '#e2e8f0',
            textAlign: 'center',
            maxWidth: 1100,
            margin: '32px 0 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
            opacity: textSpring,
            transform: `translateY(${(1 - textSpring) * 20}px)`,
          }}
        >
          A local AI documentation assistant designed to work directly on your device,{' '}
          <span style={{ color: '#38bdf8', fontWeight: 800 }}>even without an internet connection.</span>
        </p>

        <div
          style={{
            display: 'flex',
            gap: 24,
            marginTop: 44,
            opacity: featureSpring,
            transform: `translateY(${(1 - featureSpring) * 30}px)`,
          }}
        >
          {[
            { icon: '🔒', title: '100% Air-Gapped', desc: 'Zero data leaves hardware' },
            { icon: '⚡', title: 'Whisper + Llama C++', desc: 'Native C++ CPU speed' },
            { icon: '🇵🇭', title: 'Trained for Taglish', desc: 'Medical & Filipino speech' },
            { icon: '₱0', title: 'Zero Cloud Bills', desc: 'No monthly API costs' },
          ].map((card, i) => (
            <div
              key={i}
              style={{
                padding: '20px 28px',
                borderRadius: 20,
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                boxShadow: '0 15px 30px rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'rgba(14, 165, 233, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {card.icon}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#ffffff', fontSize: 18, fontWeight: 700 }}>
                  {card.title}
                </span>
                <span style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500 }}>
                  {card.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Subtitles text="Meet OfflineDoc, a local AI documentation assistant designed to work directly on your device, even without an internet connection." />
    </div>
  );
};