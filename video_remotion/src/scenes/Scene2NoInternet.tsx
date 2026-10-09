import React from 'react';
import { useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { Badge } from '../components/Badge';

export const Scene2NoInternet: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const leftSpring = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 100 } });
  const rightSpring = spring({ frame: frame - 12, fps, config: { damping: 14, stiffness: 100 } });

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
        <Badge label="THE CONNECTIVITY & PRIVACY BARRIER • ZERO CELLULAR COVERAGE" dotColor="#ef4444" textColor="#dc2626" />
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
          NO INTERNET IN RURAL HEALTH STATIONS.
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
          Cloud AI fails with zero signal — and uploading patient health records violates RA 10173 data privacy.
        </p>
      </div>

      {/* Main Content: Two Bento Cards */}
      <div
        style={{
          position: 'absolute',
          top: 220,
          left: 100,
          right: 100,
          display: 'grid',
          gridTemplateColumns: '1.1fr 1.2fr',
          gap: 36,
        }}
      >
        {/* Left Bento: Rural Signal Reality & Cloud Failure */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.06)',
            padding: '36px 40px',
            transform: `translateY(${(1 - leftSpring) * 24}px)`,
            opacity: leftSpring,
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
                color: '#dc2626',
                letterSpacing: '0.06em',
                fontFamily: 'Inter, system-ui, sans-serif',
                textTransform: 'uppercase',
              }}
            >
              RURAL BARANGAY SIGNAL REALITY
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
              Sitios and island health stations lack cellular infrastructure.
            </div>

            {/* Broken Cloud Graphic */}
            <div
              style={{
                marginTop: 32,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: 300,
                  height: 180,
                  borderRadius: 90,
                  backgroundColor: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  border: '1px solid #fecaca',
                }}
              >
                {/* Cloud Silhouette */}
                <svg width="150" height="96" viewBox="0 0 24 24" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1">
                  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                </svg>

                {/* Bold Red Diagonal Slash */}
                <svg
                  width="220"
                  height="160"
                  viewBox="0 0 220 160"
                  style={{ position: 'absolute', top: 10, left: 40 }}
                >
                  <line x1="20" y1="140" x2="200" y2="20" stroke="#dc2626" strokeWidth="8" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Red Signal Warning */}
            <div
              style={{
                padding: '16px 20px',
                backgroundColor: '#fff1f2',
                borderRadius: 14,
                border: '1px solid #fecdd3',
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: '#e11d48',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  letterSpacing: '0.04em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>📶</span>
                <span>CELLULAR SIGNAL: NO SERVICE (0 BARS)</span>
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: '#9f1239',
                  marginTop: 4,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 500,
                }}
              >
                Cloud speech APIs & LLMs timeout immediately with 504 Gateway errors.
              </div>
            </div>

            {/* Yellow Statutory Alert */}
            <div
              style={{
                padding: '16px 20px',
                backgroundColor: '#fefce8',
                borderRadius: 14,
                border: '1px solid #fef08a',
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: '#a16207',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  letterSpacing: '0.04em',
                }}
              >
                STATUTORY COMPLIANCE: DATA PRIVACY ACT (RA 10173)
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: '#854d0e',
                  marginTop: 4,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                Transmitting identifiable patient health info over cloud channels without enterprise DPO infrastructure is legally non-compliant.
              </div>
            </div>
          </div>
        </div>

        {/* Right Bento: Why Cloud-Based Tools Fail */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.06)',
            padding: '36px 40px',
            transform: `translateY(${(1 - rightSpring) * 24}px)`,
            opacity: rightSpring,
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
                color: '#0f172a',
                letterSpacing: '0.06em',
                fontFamily: 'Inter, system-ui, sans-serif',
                textTransform: 'uppercase',
              }}
            >
              WHY CLOUD-BASED HEALTH TOOLS FAIL
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
              Every dependency on external servers becomes a point of total failure.
            </div>

            {/* 3 Failure Items */}
            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                {
                  title: 'Cloud Speech Recognition (Google / OpenAI)',
                  desc: 'Requires 200kbps+ upstream audio streaming. Fails completely offline.',
                },
                {
                  title: 'Cloud LLM Extractions (ChatGPT / Gemini)',
                  desc: 'Exposes patient names and diagnoses to 3rd-party servers; illegal under RA 10173.',
                },
                {
                  title: 'Cloud Electronic Medical Records (EMR)',
                  desc: 'Locks BHW out of patient history during rural power or cell tower outages.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '20px 24px',
                    backgroundColor: '#fafaf9',
                    borderRadius: 16,
                    border: '1px solid #e7e5e4',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 18,
                  }}
                >
                  {/* Red Circle X */}
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      fontWeight: 900,
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    ✕
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: '#0f172a',
                          fontFamily: 'Inter, system-ui, sans-serif',
                        }}
                      >
                        {item.title}
                      </div>
                      <span
                        style={{
                          padding: '3px 10px',
                          backgroundColor: '#fee2e2',
                          color: '#b91c1c',
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 800,
                          letterSpacing: '0.04em',
                          fontFamily: 'Inter, system-ui, sans-serif',
                        }}
                      >
                        UNUSABLE
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 14,
                        color: '#64748b',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        lineHeight: 1.4,
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: '16px 20px',
              backgroundColor: '#f1f5f9',
              borderRadius: 12,
              border: '1px solid #cbd5e1',
              fontSize: 14,
              fontWeight: 700,
              color: '#334155',
              fontFamily: 'Inter, system-ui, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span>💡</span>
            <span>Healthcare cannot pause just because the cell tower went down.</span>
          </div>
        </div>
      </div>

      <Subtitles text="And when there's no internet, cloud-based tools may not be an option." />
    </div>
  );
};