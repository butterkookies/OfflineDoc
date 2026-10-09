import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { Badge } from '../components/Badge';

export const Scene1Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const card1Spring = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 100 } });
  const card2Spring = spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 100 } });
  const card3Spring = spring({ frame: frame - 45, fps, config: { damping: 14, stiffness: 100 } });

  const clockHandRotation = interpolate(frame, [0, 120], [0, 720]);
  const counterVisits = Math.floor(interpolate(frame, [0, 90], [0, 42000], { extrapolateRight: 'clamp' }));

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden' }}>
      <GridBackground accentColor="#ef4444" />

      <div
        style={{
          position: 'absolute',
          top: 80,
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
          label="THE FRONTLINE REALITY"
          color="#f87171"
          bgColor="rgba(239, 68, 68, 0.15)"
          icon={<span style={{ fontSize: 16 }}>⚠️</span>}
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
          Documenting Every Patient Visit Takes Time.
        </h1>
        <p
          style={{
            fontSize: 24,
            color: '#94a3b8',
            margin: '10px 0 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
            maxWidth: 900,
          }}
        >
          Barangay Health Workers endure hours of repetitive manual handwriting after full house-to-house visitations.
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 290,
          left: 140,
          right: 140,
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr',
          gap: 28,
        }}
      >
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 24,
            padding: 36,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            transform: `translateY(${(1 - card1Spring) * 40}px)`,
            opacity: card1Spring,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ color: '#ef4444', fontWeight: 700, fontSize: 14, letterSpacing: '0.05em' }}>
                BURDEN #1: TIME DRAIN
              </span>
              <h3 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '8px 0 0 0' }}>
                45+ Mins Lost
              </h3>
              <p style={{ color: '#94a3b8', fontSize: 16, margin: '6px 0 0 0' }}>
                Per patient visit spent handwriting notes and duplicating registries.
              </p>
            </div>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                border: '3px solid #ef4444',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(239, 68, 68, 0.1)',
                boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: 3,
                  height: 24,
                  backgroundColor: '#ef4444',
                  top: 12,
                  borderRadius: 2,
                  transformOrigin: 'bottom center',
                  transform: `rotate(${clockHandRotation}deg)`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: 4,
                  height: 16,
                  backgroundColor: '#f87171',
                  top: 20,
                  borderRadius: 2,
                  transformOrigin: 'bottom center',
                  transform: `rotate(${clockHandRotation * 0.1}deg)`,
                }}
              />
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#fff', zIndex: 2 }} />
            </div>
          </div>

          <div
            style={{
              marginTop: 24,
              padding: '16px 20px',
              borderRadius: 14,
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 24 }}>⏳</span>
            <span style={{ color: '#fca5a5', fontSize: 16, fontWeight: 600 }}>
              60% of BHW shift spent on paperwork rather than direct care
            </span>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 24,
            padding: 36,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            transform: `translateY(${(1 - card2Spring) * 40}px)`,
            opacity: card2Spring,
          }}
        >
          <div>
            <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: 14, letterSpacing: '0.05em' }}>
              BURDEN #2: PAPER RECORDS
            </span>
            <h3 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '8px 0 0 0' }}>
              Physical Logbooks
            </h3>
            <p style={{ color: '#94a3b8', fontSize: 16, margin: '6px 0 0 0' }}>
              Vulnerable to water damage, lost records, and unsearchable filing cabinets.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            {['Heavy physical notebooks', 'Prone to human transcription error', 'No searchability in emergencies'].map(
              (item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: '#ef4444', fontSize: 18 }}>✕</span>
                  <span style={{ color: '#cbd5e1', fontSize: 15 }}>{item}</span>
                </div>
              )
            )}
          </div>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 24,
            padding: 36,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            transform: `translateY(${(1 - card3Spring) * 40}px)`,
            opacity: card3Spring,
          }}
        >
          <div>
            <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: 14, letterSpacing: '0.05em' }}>
              NATIONAL SCALE
            </span>
            <div style={{ fontSize: 52, fontWeight: 900, color: '#38bdf8', margin: '4px 0 0 0' }}>
              {counterVisits.toLocaleString()}+
            </div>
            <h4 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: '0' }}>
              Philippine Barangays
            </h4>
            <p style={{ color: '#94a3b8', fontSize: 15, margin: '6px 0 0 0' }}>
              Serving over 115 million citizens across 7,641 islands.
            </p>
          </div>

          <div
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              color: '#bae6fd',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            🇵🇭 200,000+ Active Barangay Health Workers
          </div>
        </div>
      </div>

      <Subtitles text="For health workers, documenting every patient visit takes time." />
    </div>
  );
};