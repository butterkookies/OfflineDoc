import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { Badge } from '../components/Badge';

export const Scene5StructuredRecord: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const leftSpring = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 100 } });
  const rightSpring = spring({ frame: frame - 18, fps, config: { damping: 14, stiffness: 100 } });

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
        <Badge label="LOCAL AI • EVIDENCE LINKED" dotColor="#10b981" textColor="#64748b" />
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
          <span style={{ color: '#0f172a' }}>FROM TRANSCRIPT TO </span>
          <span style={{ color: '#2563eb' }}>VISIT RECORD.</span>
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
          Each detail stays linked to the exact words it came from for complete verification.
        </p>
      </div>

      {/* Main Grid: Left Source Transcript, Right Structured Record */}
      <div
        style={{
          position: 'absolute',
          top: 300,
          left: 140,
          right: 140,
          display: 'grid',
          gridTemplateColumns: '1fr 1.35fr',
          gap: 36,
        }}
      >
        {/* Left: Source Transcript with Highlight Pills */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 32,
            padding: '36px 40px',
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.07)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: 480,
            boxSizing: 'border-box',
            transform: `translateY(${(1 - leftSpring) * 30}px)`,
            opacity: leftSpring,
          }}
        >
          <div>
            <Badge label="SOURCE TRANSCRIPT" dotColor="#2dd4bf" textColor="#2563eb" />

            <div
              style={{
                marginTop: 32,
                fontSize: 28,
                fontWeight: 800,
                color: '#0f172a',
                fontFamily: 'Inter, system-ui, sans-serif',
                lineHeight: 1.7,
              }}
            >
              “{' '}
              <span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '4px 10px', borderRadius: 8 }}>
                Headache
              </span>{' '}
              began{' '}
              <span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '4px 10px', borderRadius: 8 }}>
                this morning
              </span>{' '}
              . Blood pressure is{' '}
              <span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '4px 10px', borderRadius: 8 }}>
                120 over 80
              </span>{' '}
              . Follow up in{' '}
              <span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '4px 10px', borderRadius: 8 }}>
                three days
              </span>{' '}
              .”
            </div>
          </div>

          <div
            style={{
              padding: '12px 18px',
              backgroundColor: '#f1f5f9',
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 800,
              color: '#475569',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            SYNTHETIC VISIT • EVIDENCE VERIFIED ↗
          </div>
        </div>

        {/* Right: Structured Visit Record Table */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 32,
            padding: '36px 40px',
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.07)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: 480,
            boxSizing: 'border-box',
            transform: `translateY(${(1 - rightSpring) * 30}px)`,
            opacity: rightSpring,
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0, fontFamily: 'Inter, sans-serif' }}>
                STRUCTURED VISIT RECORD
              </h3>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: '#10b981',
                  backgroundColor: '#ecfdf5',
                  padding: '4px 12px',
                  borderRadius: 999,
                  letterSpacing: '0.06em',
                }}
              >
                • REVIEW BEFORE CONFIRMING
              </span>
            </div>

            {/* Rows */}
            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'CHIEF COMPLAINT', value: 'Headache', quote: 'Headache began this morning.' },
                { label: 'SYMPTOMS', value: 'Started this morning', quote: 'Headache began this morning.' },
                { label: 'VITALS • BP', value: '120/80', quote: 'Blood pressure is 120 over 80.' },
                { label: 'FOLLOW-UP', value: 'In three days', quote: 'Follow up in three days.' },
              ].map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '150px 180px 1fr',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#64748b', letterSpacing: '0.04em' }}>
                    {row.label}
                  </span>
                  <span style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>
                    {row.value}
                  </span>
                  <div
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#eff6ff',
                      borderRadius: 10,
                      color: '#2563eb',
                      fontSize: 13,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    SOURCE ↗ "{row.quote}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              paddingTop: 14,
              borderTop: '1px solid #f1f5f9',
              fontSize: 13,
              fontWeight: 700,
              color: '#10b981',
            }}
          >
            ✓ Verifiable citation links guarantee zero hallucination
          </div>
        </div>
      </div>

      <Subtitles text="With local AI, information is organized into a structured visit record, with details linked to their original transcript for verification." />
    </div>
  );
};