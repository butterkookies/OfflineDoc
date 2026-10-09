import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { Badge } from '../components/Badge';

export const Scene2NoInternet: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const leftSpring = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 100 } });
  const phoneSpring = spring({ frame: frame - 18, fps, config: { damping: 14, stiffness: 100 } });

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#f5f7fb' }}>
      <GridBackground />

      {/* Header section */}
      <div
        style={{
          position: 'absolute',
          top: 90,
          left: 140,
          transform: `translateY(${(1 - titleSpring) * 20}px)`,
          opacity: titleSpring,
        }}
      >
        <Badge label="NO INTERNET CONNECTION REQUIRED" dotColor="#10b981" textColor="#64748b" />
        <h1
          style={{
            fontSize: 68,
            fontWeight: 900,
            margin: '14px 0 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          <span style={{ color: '#0f172a' }}>NO INTERNET? </span>
          <span style={{ color: '#2563eb' }}>CLOUD TOOLS STOP.</span>
        </h1>
        <p
          style={{
            fontSize: 24,
            color: '#64748b',
            margin: '12px 0 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 500,
          }}
        >
          When connectivity drops, cloud-dependent software is cut off.
        </p>
      </div>

      {/* Left side: Broken Cloud Graphic */}
      <div
        style={{
          position: 'absolute',
          top: 360,
          left: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `translateY(${(1 - leftSpring) * 30}px)`,
          opacity: leftSpring,
        }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {/* Cloud SVG */}
          <svg width="220" height="150" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            {/* Strike-through diagonal line */}
            <line x1="2" y1="22" x2="22" y2="2" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
          </svg>

          {/* Dotted disconnected line */}
          <div
            style={{
              width: 140,
              height: 2,
              borderTop: '3px dashed #cbd5e1',
              margin: '0 20px',
            }}
          />

          {/* X circle */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              border: '2px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb',
              fontSize: 20,
              fontWeight: 900,
            }}
          >
            ✕
          </div>
        </div>

        <div
          style={{
            marginTop: 36,
            fontSize: 18,
            fontWeight: 800,
            color: '#2563eb',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontFamily: 'Inter, system-ui, sans-serif',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          INTERNET<br />CONNECTION LOST
        </div>
      </div>

      {/* Right side: Mobile Phone Mockup */}
      <div
        style={{
          position: 'absolute',
          top: 260,
          right: 220,
          width: 440,
          height: 640,
          backgroundColor: '#0f172a',
          borderRadius: 48,
          padding: '16px 14px',
          boxShadow: '0 30px 60px rgba(15, 23, 42, 0.25)',
          transform: `translateY(${(1 - phoneSpring) * 40}px)`,
          opacity: phoneSpring,
          boxSizing: 'border-box',
        }}
      >
        {/* Phone screen */}
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            borderRadius: 36,
            overflow: 'hidden',
            padding: '24px 24px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          {/* Top Notch */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 120,
              height: 20,
              backgroundColor: '#0f172a',
              borderRadius: '0 0 14px 14px',
            }}
          />

          <div>
            {/* App Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 12,
              }}
            >
              <span style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
                Offline<span style={{ color: '#2563eb' }}>Doc</span>
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: '#10b981',
                  backgroundColor: '#ecfdf5',
                  padding: '4px 10px',
                  borderRadius: 999,
                  letterSpacing: '0.06em',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                • OFFLINE
              </span>
            </div>

            {/* Visit Note Box */}
            <div style={{ marginTop: 28 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: '#64748b',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                VOICE VISIT NOTE
              </span>
              <h3
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: '#0f172a',
                  margin: '8px 0 4px 0',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Record visit summary
              </h3>
              <p style={{ fontSize: 14, color: '#64748b', margin: 0, fontFamily: 'Inter, sans-serif' }}>
                Speak naturally. Review before saving.
              </p>
            </div>

            {/* Sound Wave Container */}
            <div
              style={{
                marginTop: 24,
                padding: '24px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: 18,
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                height: 70,
              }}
            >
              {[25, 45, 30, 60, 40, 75, 50, 65, 80, 55, 35, 70, 45, 60, 30, 50].map((h, i) => {
                const animH = Math.max(12, Math.sin(frame * 0.25 + i * 0.5) * (h * 0.4) + h * 0.5);
                const isTeal = i % 3 === 0;
                return (
                  <div
                    key={i}
                    style={{
                      width: 5,
                      height: animH,
                      backgroundColor: isTeal ? '#10b981' : '#2563eb',
                      borderRadius: 3,
                    }}
                  />
                );
              })}
            </div>

            {/* Transcribing locally notification */}
            <div
              style={{
                marginTop: 20,
                padding: '12px 16px',
                backgroundColor: '#f1f5f9',
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981' }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#2563eb', fontFamily: 'Inter, sans-serif' }}>
                  TRANSCRIBING LOCALLY
                </div>
                <div style={{ fontSize: 12, color: '#64748b', fontFamily: 'Inter, sans-serif' }}>
                  Audio stays on this device
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Pill Badge */}
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: 14,
              color: '#065f46',
              fontSize: 14,
              fontWeight: 800,
              textAlign: 'center',
              letterSpacing: '0.04em',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            OFFLINE • STILL WORKING ✓
          </div>
        </div>
      </div>

      <Subtitles text="And when there's no internet, cloud-based tools may not be an option." />
    </div>
  );
};