import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { Badge } from '../components/Badge';

export const Scene2NoInternet: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const leftCardSpring = spring({ frame: frame - 12, fps, config: { damping: 14, stiffness: 100 } });
  const rightCardSpring = spring({ frame: frame - 25, fps, config: { damping: 14, stiffness: 100 } });

  const pulse = Math.sin(frame * 0.15) * 0.15 + 0.85;

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden' }}>
      <GridBackground accentColor="#f59e0b" />

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
          label="THE CONNECTIVITY BARRIER"
          color="#fbbf24"
          bgColor="rgba(245, 158, 11, 0.15)"
          icon={<span style={{ fontSize: 16 }}>📡</span>}
        />
        <h1
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#ffffff',
            margin: '16px 0 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
            letterSpacing: '-0.02em',
          }}
        >
          When There's No Internet, Cloud AI Fails.
        </h1>
        <p
          style={{
            fontSize: 24,
            color: '#94a3b8',
            margin: '10px 0 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
            maxWidth: 1000,
          }}
        >
          Rural, mountain, and island barangays have zero cellular signal. Cloud-dependent health systems become useless paperweights.
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 290,
          left: 180,
          right: 180,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 40,
        }}
      >
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(239, 68, 68, 0.4)',
            borderRadius: 28,
            padding: 44,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            transform: `translateY(${(1 - leftCardSpring) * 40}px)`,
            opacity: leftCardSpring,
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                ☁️ CLOUD-BASED AI TOOLS
              </span>
              <span
                style={{
                  color: '#ef4444',
                  fontWeight: 800,
                  fontSize: 18,
                  transform: `scale(${pulse})`,
                }}
              >
                🔴 DISCONNECTED
              </span>
            </div>

            <h3 style={{ color: '#fff', fontSize: 32, fontWeight: 800, margin: '20px 0 8px 0' }}>
              504 Gateway Timeout
            </h3>
            <p style={{ color: '#94a3b8', fontSize: 17, lineHeight: 1.5, margin: 0 }}>
              Requires continuous 4G/5G signal, expensive cloud API tokens, and uploads private patient data across foreign servers.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 24 }}>
              {[
                'ChatGPT / Claude / OpenAI API ❌ (Requires WiFi)',
                'Cloud Hospital EHRs ❌ (Unreachable in GIDA)',
                'Monthly API Bills & Subscriptions ❌ ($$$)',
                'Privacy Risk: Data leaves local device ❌',
              ].map((text, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 18px',
                    borderRadius: 12,
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#fca5a5',
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(245, 158, 11, 0.4)',
            borderRadius: 28,
            padding: 44,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            transform: `translateY(${(1 - rightCardSpring) * 40}px)`,
            opacity: rightCardSpring,
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#fbbf24',
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                🏝️ GEOGRAPHIC REALITY
              </span>
              <span style={{ color: '#fbbf24', fontWeight: 800, fontSize: 18 }}>
                📶 0 BARS SIGNAL
              </span>
            </div>

            <h3 style={{ color: '#fff', fontSize: 32, fontWeight: 800, margin: '20px 0 8px 0' }}>
              Geographically Isolated Areas
            </h3>
            <p style={{ color: '#94a3b8', fontSize: 17, lineHeight: 1.5, margin: 0 }}>
              Over 50% of rural Philippine health centers operate under intermittent or non-existent internet coverage.
            </p>

            <div
              style={{
                marginTop: 28,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
              }}
            >
              <div
                style={{
                  padding: '20px',
                  borderRadius: 16,
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 36, fontWeight: 900, color: '#fbbf24' }}>7,641</div>
                <div style={{ color: '#cbd5e1', fontSize: 14, fontWeight: 600, marginTop: 4 }}>
                  Islands Nationwide
                </div>
              </div>
              <div
                style={{
                  padding: '20px',
                  borderRadius: 16,
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 36, fontWeight: 900, color: '#fbbf24' }}>0.00 Mbps</div>
                <div style={{ color: '#cbd5e1', fontSize: 14, fontWeight: 600, marginTop: 4 }}>
                  Island Signal Average
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 24,
                padding: '16px 20px',
                borderRadius: 14,
                background: 'rgba(14, 165, 233, 0.1)',
                border: '1px solid rgba(14, 165, 233, 0.3)',
                color: '#38bdf8',
                fontSize: 16,
                fontWeight: 700,
                textAlign: 'center',
              }}
            >
              💡 Healthcare cannot pause just because the signal dropped.
            </div>
          </div>
        </div>
      </div>

      <Subtitles text="And when there's no internet, cloud-based tools may not be an option." />
    </div>
  );
};