import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { Badge } from '../components/Badge';

export const Scene7Benefits: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const card1Spring = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 100 } });
  const card2Spring = spring({ frame: frame - 25, fps, config: { damping: 14, stiffness: 100 } });
  const card3Spring = spring({ frame: frame - 40, fps, config: { damping: 14, stiffness: 100 } });

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden' }}>
      <GridBackground accentColor="#10b981" />

      <div
        style={{
          position: 'absolute',
          top: 75,
          left: 100,
          right: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          transform: `translateY(${(1 - titleSpring) * 30}px)`,
          opacity: titleSpring,
        }}
      >
        <Badge
          label="THE SOVEREIGN ADVANTAGE"
          color="#34d399"
          bgColor="rgba(16, 185, 129, 0.15)"
          icon={<span style={{ fontSize: 16 }}>🛡️</span>}
        />
        <h1
          style={{
            fontSize: 62,
            fontWeight: 800,
            color: '#ffffff',
            margin: '14px 0 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
            letterSpacing: '-0.02em',
          }}
        >
          No Cloud Dependency. Total Patient Privacy.
        </h1>
        <p
          style={{
            fontSize: 24,
            color: '#94a3b8',
            margin: '8px 0 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
            maxWidth: 1000,
          }}
        >
          Practical AI designed to support efficient documentation while keeping patient information strictly on the device.
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 290,
          left: 140,
          right: 140,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 32,
        }}
      >
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: 28,
            padding: 40,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            transform: `translateY(${(1 - card1Spring) * 40}px)`,
            opacity: card1Spring,
          }}
        >
          <div>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: 'rgba(14, 165, 233, 0.15)',
                border: '1px solid rgba(14, 165, 233, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
              }}
            >
              🛡️
            </div>
            <h3 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '24px 0 10px 0' }}>
              100% Air-Gapped Privacy
            </h3>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.6, margin: 0 }}>
              Zero health data leaves the physical device. Fully compliant with RA 10173 (Data Privacy Act).
            </p>
          </div>

          <div
            style={{
              marginTop: 24,
              padding: '12px 16px',
              borderRadius: 12,
              background: 'rgba(14, 165, 233, 0.1)',
              color: '#38bdf8',
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            🔒 Zero third-party telemetry
          </div>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 28,
            padding: 40,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            transform: `translateY(${(1 - card2Spring) * 40}px)`,
            opacity: card2Spring,
          }}
        >
          <div>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
              }}
            >
              ⚡
            </div>
            <h3 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '24px 0 10px 0' }}>
              80% Time Saved
            </h3>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.6, margin: 0 }}>
              Replaces tedious handwriting with 20-second spoken Taglish summaries and automatic PhilHealth formatting.
            </p>
          </div>

          <div
            style={{
              marginTop: 24,
              padding: '12px 16px',
              borderRadius: 12,
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#34d399',
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            ⏱️ 20 seconds vs 45 minutes
          </div>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: 28,
            padding: 40,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            transform: `translateY(${(1 - card3Spring) * 40}px)`,
            opacity: card3Spring,
          }}
        >
          <div>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: 'rgba(168, 85, 247, 0.15)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
              }}
            >
              💰
            </div>
            <h3 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '24px 0 10px 0' }}>
              ₱0.00 Operating Cost
            </h3>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.6, margin: 0 }}>
              No monthly OpenAI / Anthropic bills. Runs forever on existing barangay laptops, desktops, or tablets.
            </p>
          </div>

          <div
            style={{
              marginTop: 24,
              padding: '12px 16px',
              borderRadius: 12,
              background: 'rgba(168, 85, 247, 0.1)',
              color: '#c084fc',
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            🇵🇭 Sovereign & Accessible
          </div>
        </div>
      </div>

      <Subtitles text="No cloud dependency, no unnecessary manual work, just practical AI designed to support efficient documentation while keeping patient information on the device." />
    </div>
  );
};