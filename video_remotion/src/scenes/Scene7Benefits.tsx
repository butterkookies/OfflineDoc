import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { Badge } from '../components/Badge';

export const Scene7Benefits: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const leftCardSpring = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 100 } });
  const rightCardSpring = spring({ frame: frame - 18, fps, config: { damping: 14, stiffness: 100 } });

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
        <Badge label="PRIVACY-PRESERVING LOCAL AI" dotColor="#10b981" textColor="#64748b" />
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
          <span style={{ color: '#0f172a' }}>PATIENT INFO STAYS </span>
          <span style={{ color: '#2563eb' }}>ON THIS DEVICE.</span>
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
          Practical local AI supports efficient documentation while safeguarding patient confidentiality.
        </p>
      </div>

      {/* 2-Card Layout */}
      <div
        style={{
          position: 'absolute',
          top: 300,
          left: 140,
          right: 140,
          display: 'grid',
          gridTemplateColumns: '1.45fr 1fr',
          gap: 36,
        }}
      >
        {/* Left Card: Dark-bordered Security Enclave */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 36,
            border: '4px solid #0f172a',
            padding: '36px 44px',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: 480,
            boxSizing: 'border-box',
            transform: `translateY(${(1 - leftCardSpring) * 30}px)`,
            opacity: leftCardSpring,
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2dd4bf' }} />
                <span style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
                  127.0.0.1 (Localhost Only)
                </span>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: '#065f46',
                  backgroundColor: '#ecfdf5',
                  padding: '4px 12px',
                  borderRadius: 999,
                  letterSpacing: '0.06em',
                }}
              >
                • AIRPLANE MODE ACTIVE
              </span>
            </div>

            {/* Checklist */}
            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                'Audio cleared immediately after transcription',
                'Zero third-party cloud AI APIs used',
                'Strict JSON schema constrains local LLM output',
                'Unstated clinical values remain null, never hallucinated',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ color: '#10b981', fontSize: 18, fontWeight: 900 }}>✓</span>
                  <span style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: '14px 20px',
              backgroundColor: '#f1f5f9',
              borderRadius: 14,
              fontSize: 13,
              fontWeight: 800,
              color: '#475569',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            SYNTHETIC EVALUATION VERIFIED • RUNS ENTIRELY ON LOCAL HARDWARE
          </div>
        </div>

        {/* Right Card: Local Security Icon */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 36,
            border: '1px solid #e2e8f0',
            padding: '40px 36px',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 480,
            boxSizing: 'border-box',
            transform: `translateY(${(1 - rightCardSpring) * 30}px)`,
            opacity: rightCardSpring,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 900,
              color: '#2563eb',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            LOCAL SECURITY
          </span>

          {/* Document / Enclave Graphic */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: 170,
                height: 190,
                borderRadius: 24,
                border: '3px solid #0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc',
              }}
            >
              {/* Document SVG inside */}
              <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>

            {/* Checkmark circle badge */}
            <div
              style={{
                position: 'absolute',
                bottom: -10,
                right: -10,
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: '#2dd4bf',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: 900,
                boxShadow: '0 4px 12px rgba(45, 212, 191, 0.4)',
              }}
            >
              ✓
            </div>
          </div>

          <div
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: '#065f46',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            100% PRIVATE & OFFLINE
          </div>
        </div>
      </div>

      <Subtitles text="No cloud dependency, no unnecessary manual work, just practical AI designed to support efficient documentation while keeping patient information on the device." />
    </div>
  );
};