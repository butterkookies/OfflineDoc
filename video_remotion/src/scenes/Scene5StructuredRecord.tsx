import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { Badge } from '../components/Badge';

export const Scene5StructuredRecord: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const card1Spring = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 100 } });
  const card2Spring = spring({ frame: frame - 20, fps, config: { damping: 14, stiffness: 100 } });
  const card3Spring = spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 100 } });
  const card4Spring = spring({ frame: frame - 40, fps, config: { damping: 14, stiffness: 100 } });

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden' }}>
      <GridBackground accentColor="#6366f1" />

      <div
        style={{
          position: 'absolute',
          top: 65,
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
          label="STEP 2: LOCAL CLINICAL EXTRACTION"
          color="#818cf8"
          bgColor="rgba(99, 102, 241, 0.15)"
          icon={<span style={{ fontSize: 16 }}>🧠</span>}
        />
        <h1
          style={{
            fontSize: 58,
            fontWeight: 800,
            color: '#ffffff',
            margin: '12px 0 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
            letterSpacing: '-0.02em',
          }}
        >
          Structured Record with Verifiable Citations.
        </h1>
        <p
          style={{
            fontSize: 22,
            color: '#94a3b8',
            margin: '6px 0 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Every vital, symptom, and diagnosis links directly back to its exact audio transcript source.
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 250,
          left: 120,
          right: 120,
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr 1fr',
          gridTemplateRows: 'auto auto',
          gap: 24,
        }}
      >
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 24,
            padding: 28,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            transform: `translateY(${(1 - card1Spring) * 40}px)`,
            opacity: card1Spring,
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#38bdf8', fontSize: 14, fontWeight: 700 }}>PATIENT DEMOGRAPHICS</span>
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: 999,
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  color: '#fbbf24',
                  fontSize: 13,
                  fontWeight: 800,
                }}
              >
                🟡 MONITORING
              </span>
            </div>
            <h3 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '12px 0 4px 0' }}>
              Maria Santos, 48 F
            </h3>
            <span style={{ color: '#94a3b8', fontSize: 15 }}>Household #104 • Purok 3, Brgy. San Jose</span>
          </div>

          <div
            style={{
              marginTop: 18,
              padding: '12px 16px',
              borderRadius: 14,
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{ fontSize: 18 }}>🔗</span>
            <span style={{ color: '#c7d2fe', fontSize: 14, fontWeight: 600 }}>
              Extracted from: "Si Aling Maria, 48 years old..." [00:01]
            </span>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: 24,
            padding: 28,
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            transform: `translateY(${(1 - card2Spring) * 40}px)`,
            opacity: card2Spring,
          }}
        >
          <span style={{ color: '#38bdf8', fontSize: 14, fontWeight: 700 }}>CLINICAL VITALS</span>
          <div
            style={{
              marginTop: 14,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 14,
            }}
          >
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: 14 }}>
              <div style={{ color: '#94a3b8', fontSize: 13 }}>Blood Pressure</div>
              <div style={{ color: '#fb7185', fontSize: 24, fontWeight: 800 }}>135/85</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: 14 }}>
              <div style={{ color: '#94a3b8', fontSize: 13 }}>Temperature</div>
              <div style={{ color: '#f59e0b', fontSize: 24, fontWeight: 800 }}>38.3 °C</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: 14 }}>
              <div style={{ color: '#94a3b8', fontSize: 13 }}>Heart Rate</div>
              <div style={{ color: '#34d399', fontSize: 24, fontWeight: 800 }}>84 bpm</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: 14 }}>
              <div style={{ color: '#94a3b8', fontSize: 13 }}>Resp. Rate</div>
              <div style={{ color: '#38bdf8', fontSize: 24, fontWeight: 800 }}>18 cpm</div>
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 24,
            padding: 28,
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            transform: `translateY(${(1 - card3Spring) * 40}px)`,
            opacity: card3Spring,
          }}
        >
          <span style={{ color: '#38bdf8', fontSize: 14, fontWeight: 700 }}>CHIEF COMPLAINT</span>
          <h4 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: '10px 0 6px 0' }}>
            Productive Cough & Fever
          </h4>
          <p style={{ color: '#94a3b8', fontSize: 14, margin: 0, lineHeight: 1.4 }}>
            Duration: 3 days. Accompanied by mild body aches and elevated temperature.
          </p>
          <div
            style={{
              marginTop: 14,
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            {['Cough x 3d', 'Fever 38.3°C', 'Taglish Parsed'].map((pill, i) => (
              <span
                key={i}
                style={{
                  padding: '4px 10px',
                  borderRadius: 8,
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            gridColumn: 'span 3',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 24,
            padding: '24px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            transform: `translateY(${(1 - card4Spring) * 40}px)`,
            opacity: card4Spring,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
              }}
            >
              💊
            </div>
            <div>
              <div style={{ color: '#34d399', fontSize: 14, fontWeight: 800 }}>ACTION & TREATMENT PLAN</div>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                Paracetamol 500mg tab q4h PRN • Hydration • 48-Hour Barangay Follow-Up Visit
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid #10b981',
              color: '#34d399',
              fontSize: 15,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>✓ VERIFIED CITATION LINKED</span>
          </div>
        </div>
      </div>

      <Subtitles text="With local AI, information is organized into a structured visit record, with details linked to their original transcript for verification." />
    </div>
  );
};