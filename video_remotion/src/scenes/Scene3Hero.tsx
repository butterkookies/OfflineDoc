import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { Badge } from '../components/Badge';

export const Scene3Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const card1Spring = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 100 } });
  const card2Spring = spring({ frame: frame - 18, fps, config: { damping: 14, stiffness: 100 } });
  const card3Spring = spring({ frame: frame - 26, fps, config: { damping: 14, stiffness: 100 } });

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
        <Badge label="MEET OFFLINEDOC" dotColor="#10b981" textColor="#64748b" />
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
          <span style={{ color: '#0f172a' }}>LOCAL AI. </span>
          <span style={{ color: '#2563eb' }}>ON YOUR DEVICE.</span>
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
          A documentation assistant designed to work directly on your device—even without an internet connection.
        </p>
      </div>

      {/* 3 Horizontal Bento Cards */}
      <div
        style={{
          position: 'absolute',
          top: 320,
          left: 140,
          right: 140,
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr 1.3fr',
          gap: 32,
        }}
      >
        {/* Card 1: 01 DOCTOR'S VOICE */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 28,
            padding: 36,
            boxShadow: '0 12px 36px rgba(15, 23, 42, 0.06)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: 380,
            boxSizing: 'border-box',
            transform: `translateY(${(1 - card1Spring) * 30}px)`,
            opacity: card1Spring,
          }}
        >
          <div>
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
              01 • HEALTH WORKER VOICE
            </span>
            <h3 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: '14px 0 6px 0' }}>
              Visit summary
            </h3>
            <p style={{ fontSize: 16, color: '#64748b', margin: 0 }}>
              Spoken naturally in the field
            </p>
          </div>

          <div
            style={{
              padding: '24px 20px',
              backgroundColor: '#f8fafc',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              height: 90,
            }}
          >
            {[20, 45, 30, 70, 50, 80, 40, 65, 85, 55, 30, 60, 40, 75].map((h, i) => (
              <div
                key={i}
                style={{
                  width: 5,
                  height: Math.max(12, Math.sin(frame * 0.2 + i * 0.4) * (h * 0.4) + h * 0.5),
                  backgroundColor: i % 3 === 0 ? '#10b981' : '#2563eb',
                  borderRadius: 3,
                }}
              />
            ))}
          </div>
        </div>

        {/* Card 2: 02 ON-DEVICE AI (Hero Highlight) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 28,
            padding: 36,
            boxShadow: '0 20px 45px rgba(37, 99, 235, 0.12)',
            border: '2px solid #2563eb',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'center',
            height: 380,
            boxSizing: 'border-box',
            transform: `translateY(${(1 - card2Spring) * 30}px)`,
            opacity: card2Spring,
            position: 'relative',
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: '#2563eb',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            02 • ON-DEVICE AI
          </span>

          {/* AI Chip Graphic */}
          <div style={{ position: 'relative', marginTop: 10 }}>
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: 26,
                backgroundColor: '#ffffff',
                border: '2px solid #93c5fd',
                boxShadow: '0 10px 25px rgba(37, 99, 235, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* Pins around chip */}
              <div style={{ position: 'absolute', top: -8, width: 36, height: 4, backgroundColor: '#2dd4bf', borderRadius: 2 }} />
              <div style={{ position: 'absolute', bottom: -8, width: 36, height: 4, backgroundColor: '#2dd4bf', borderRadius: 2 }} />
              <div style={{ position: 'absolute', left: -8, width: 4, height: 36, backgroundColor: '#2dd4bf', borderRadius: 2 }} />
              <div style={{ position: 'absolute', right: -8, width: 4, height: 36, backgroundColor: '#2dd4bf', borderRadius: 2 }} />

              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 14,
                  backgroundColor: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: 22,
                  fontWeight: 900,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                AI
              </div>
            </div>

            {/* Checkmark circle badge */}
            <div
              style={{
                position: 'absolute',
                bottom: -6,
                right: -6,
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: '#10b981',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                fontWeight: 900,
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
              }}
            >
              ✓
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>
              Runs on this device
            </h3>
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: '#2563eb',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              NO CLOUD CALLS • PRIVACY PRESERVED
            </span>
          </div>
        </div>

        {/* Card 3: 03 STRUCTURED OUTPUT */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 28,
            padding: 36,
            boxShadow: '0 12px 36px rgba(15, 23, 42, 0.06)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: 380,
            boxSizing: 'border-box',
            transform: `translateY(${(1 - card3Spring) * 30}px)`,
            opacity: card3Spring,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              03 • STRUCTURED OUTPUT
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: '#10b981',
                backgroundColor: '#ecfdf5',
                padding: '3px 8px',
                borderRadius: 999,
                letterSpacing: '0.06em',
              }}
            >
              VERIFIED
            </span>
          </div>

          <h3 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: '4px 0 16px 0' }}>
            Visit note
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
            }}
          >
            <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                CHIEF CONCERN
              </span>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
                Headache
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                SYMPTOMS
              </span>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
                This morning
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                SOURCE
              </span>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#2563eb', marginTop: 2 }}>
                Transcript linked
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                STATUS
              </span>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#10b981', marginTop: 2 }}>
                Ready to review
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer tags bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 110,
          left: 140,
          display: 'flex',
          gap: 28,
          alignItems: 'center',
          fontSize: 14,
          fontWeight: 800,
          color: '#64748b',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontFamily: 'Inter, sans-serif',
          opacity: card3Spring,
        }}
      >
        <span>• LOCAL SPEECH RECOGNITION (WHISPER.CPP)</span>
        <span>• LOCAL AI (LLAMA.CPP)</span>
        <span>• PRIVATE BY DESIGN</span>
      </div>

      <Subtitles text="Meet OfflineDoc, a local AI documentation assistant designed to work directly on your device, even without an internet connection." />
    </div>
  );
};