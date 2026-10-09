import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { Badge } from '../components/Badge';

export const Scene1Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const leftCardSpring = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 100 } });
  const rightCardSpring = spring({ frame: frame - 8, fps, config: { damping: 14, stiffness: 100 } });

  const clockRotation = interpolate(frame, [0, 120], [0, 360]);
  const hoursCount = interpolate(frame, [10, 80], [0.0, 3.8], { extrapolateRight: 'clamp' });

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#f5f7fb' }}>
      <GridBackground />

      {/* Header section */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 100,
          right: 100,
          transform: `translateY(${(1 - titleSpring) * 20}px)`,
          opacity: titleSpring,
        }}
      >
        <Badge label="THE FRONTLINE REALITY • BARANGAY HEALTH WORKERS" dotColor="#2563eb" textColor="#2563eb" />
        <h1
          style={{
            fontSize: 58,
            fontWeight: 900,
            margin: '12px 0 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
            letterSpacing: '-0.02em',
            color: '#0f172a',
            lineHeight: 1.1,
          }}
        >
          DOCUMENTING EVERY VISIT TAKES TIME.
        </h1>
        <p
          style={{
            fontSize: 22,
            color: '#475569',
            margin: '8px 0 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 500,
          }}
        >
          Under RA 7883, BHWs spend 3 to 4 hours every evening manually writing paper logs.
        </p>
      </div>

      {/* Main Content: Two Balanced Bento Cards */}
      <div
        style={{
          position: 'absolute',
          top: 220,
          left: 100,
          right: 100,
          display: 'grid',
          gridTemplateColumns: '1.25fr 1fr',
          gap: 36,
        }}
      >
        {/* Left Bento: Manual DOH Target Client List Logbooks */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.06)',
            padding: '36px 40px',
            transform: `translateY(${(1 - leftCardSpring) * 24}px)`,
            opacity: leftCardSpring,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: 670,
            boxSizing: 'border-box',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: '#0284c7',
                letterSpacing: '0.06em',
                fontFamily: 'Inter, system-ui, sans-serif',
                textTransform: 'uppercase',
              }}
            >
              MANUAL DOH TARGET CLIENT LIST (TCL) LOGBOOKS
            </div>
            <div
              style={{
                fontSize: 18,
                color: '#64748b',
                marginTop: 6,
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 500,
              }}
            >
              Community home visits yield piles of handwritten encounter sheets.
            </div>

            {/* 3 Real Cohort Logs */}
            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                {
                  code: 'DOH FORM 01',
                  title: 'FORM 01: MATERNAL CARE TCL LOG',
                  details: 'Maria Santos • 28yo • Purok 2 • Prenatal Visit 3 • BP 120/80',
                  delay: 0,
                },
                {
                  code: 'DOH FORM 02',
                  title: 'FORM 02: HYPERTENSION MONITORING LOG',
                  details: 'Teresa Ramos • 54yo • Purok 4 • BP 150/95 • Headache noted',
                  delay: 8,
                },
                {
                  code: 'DOH FORM 03',
                  title: 'FORM 03: CHILD IMMUNIZATION (EPI) REGISTER',
                  details: 'Baby Joshua Bautista • 9mo • Purok 3 • Pentavalent 3 & Vit A',
                  delay: 16,
                },
              ].map((item, idx) => {
                const itemSpring = spring({
                  frame: frame - item.delay,
                  fps,
                  config: { damping: 14, stiffness: 110 },
                });
                return (
                  <div
                    key={idx}
                    style={{
                      padding: '20px 24px',
                      backgroundColor: '#f8fafc',
                      borderRadius: 16,
                      border: '1px solid #e2e8f0',
                      transform: `translateY(${(1 - itemSpring) * 16}px)`,
                      opacity: Math.max(0.3, itemSpring),
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            backgroundColor: '#e0f2fe',
                            color: '#0369a1',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            fontFamily: 'Inter, system-ui, sans-serif',
                          }}
                        >
                          {item.code}
                        </span>
                        <span
                          style={{
                            fontSize: 16,
                            fontWeight: 800,
                            color: '#0f172a',
                            fontFamily: 'Inter, system-ui, sans-serif',
                          }}
                        >
                          {item.title}
                        </span>
                      </div>
                      <span
                        style={{
                          padding: '4px 12px',
                          backgroundColor: '#fef3c7',
                          color: '#b45309',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 800,
                          letterSpacing: '0.04em',
                          fontFamily: 'Inter, system-ui, sans-serif',
                        }}
                      >
                        MANUAL PENDING
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: 10,
                        fontSize: 15,
                        color: '#475569',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      {item.details}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              padding: '16px 20px',
              backgroundColor: '#eff6ff',
              borderRadius: 12,
              border: '1px solid #bfdbfe',
              fontSize: 15,
              fontWeight: 700,
              color: '#1d4ed8',
              fontFamily: 'Inter, system-ui, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span>📋</span>
            <span>Quadruple-entry burden: Same patient copied into Notebook, TCL, ITR, and Summary tables.</span>
          </div>
        </div>

        {/* Right Bento: Analog Clock & Time Lost Stats */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.06)',
            padding: '36px 40px',
            transform: `translateY(${(1 - rightCardSpring) * 24}px)`,
            opacity: rightCardSpring,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 670,
            boxSizing: 'border-box',
          }}
        >
          {/* Analog Clock Dial */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: 210,
                height: 210,
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '8px solid #f1f5f9',
                boxShadow: '0 16px 36px rgba(15, 23, 42, 0.08)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <div
                  key={deg}
                  style={{
                    position: 'absolute',
                    width: 3,
                    height: deg % 90 === 0 ? 12 : 7,
                    backgroundColor: '#94a3b8',
                    borderRadius: 2,
                    transform: `rotate(${deg}deg) translateY(-88px)`,
                  }}
                />
              ))}

              {/* Clock center pin */}
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  backgroundColor: '#2563eb',
                  zIndex: 10,
                  boxShadow: '0 0 8px rgba(37, 99, 235, 0.6)',
                }}
              />

              {/* Blue Clock hand */}
              <div
                style={{
                  position: 'absolute',
                  width: 5,
                  height: 70,
                  backgroundColor: '#2563eb',
                  borderRadius: 3,
                  transformOrigin: 'bottom center',
                  transform: `translateY(-35px) rotate(${clockRotation}deg)`,
                }}
              />
            </div>
            <div
              style={{
                marginTop: 14,
                fontSize: 13,
                fontWeight: 800,
                color: '#64748b',
                letterSpacing: '0.1em',
                fontFamily: 'Inter, system-ui, sans-serif',
                textTransform: 'uppercase',
              }}
            >
              TIME KEEPS MOVING
            </div>
          </div>

          {/* Red Lost Hours Card */}
          <div
            style={{
              width: '100%',
              backgroundColor: '#fff1f2',
              borderRadius: 18,
              border: '1px solid #fecdd3',
              padding: '24px 28px',
              textAlign: 'center',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                fontSize: 44,
                fontWeight: 900,
                color: '#e11d48',
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {hoursCount.toFixed(1)} Hours / Evening
            </div>
            <div
              style={{
                fontSize: 16,
                color: '#9f1239',
                marginTop: 8,
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 600,
              }}
            >
              Wasted on manual transcription and paper double-documentation.
            </div>
          </div>

          {/* Blue Legal Context Card */}
          <div
            style={{
              width: '100%',
              backgroundColor: '#f0f9ff',
              borderRadius: 16,
              border: '1px solid #bae6fd',
              padding: '18px 24px',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: '#0284c7',
                letterSpacing: '0.06em',
                fontFamily: 'Inter, system-ui, sans-serif',
                textTransform: 'uppercase',
              }}
            >
              LEGAL CONTEXT (REPUBLIC ACT 7883):
            </div>
            <div
              style={{
                fontSize: 14,
                color: '#0369a1',
                marginTop: 4,
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              BHWs are frontline volunteers mandated to monitor community primary care across 42,000+ barangays.
            </div>
          </div>
        </div>
      </div>

      <Subtitles text="For health workers, documenting every patient visit takes time." />
    </div>
  );
};