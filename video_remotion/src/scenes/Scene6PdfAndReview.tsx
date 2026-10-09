import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { Badge } from '../components/Badge';

export const Scene6PdfAndReview: React.FC = () => {
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
        <Badge label="THE HEALTH WORKER STAYS IN CONTROL" dotColor="#10b981" textColor="#64748b" />
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
          <span style={{ color: '#0f172a' }}>REVIEW. EDIT. </span>
          <span style={{ color: '#2563eb' }}>CONFIRM.</span>
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
          Health workers verify the note before generating exportable records.
        </p>
      </div>

      {/* Three Cards Layout */}
      <div
        style={{
          position: 'absolute',
          top: 310,
          left: 140,
          right: 140,
          display: 'grid',
          gridTemplateColumns: '1.2fr 1.1fr 1.1fr',
          gap: 32,
        }}
      >
        {/* Card 1: Visit Note (Editable) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 28,
            padding: 36,
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.07)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: 420,
            boxSizing: 'border-box',
            transform: `translateY(${(1 - card1Spring) * 30}px)`,
            opacity: card1Spring,
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0, fontFamily: 'Inter, sans-serif' }}>
                VISIT NOTE
              </h3>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#64748b', letterSpacing: '0.08em' }}>
                CONFIRMED RECORD
              </span>
            </div>

            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'CHIEF CONCERN', value: 'Headache' },
                { label: 'SYMPTOMS', value: 'Started this morning' },
                { label: 'VITALS • BP', value: '120/80' },
              ].map((field, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#64748b' }}>{field.label}</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{field.value}</span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: '#2563eb',
                      backgroundColor: '#eff6ff',
                      padding: '4px 10px',
                      borderRadius: 6,
                    }}
                  >
                    EDIT
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: '14px 20px',
              backgroundColor: '#047857',
              color: '#ffffff',
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 800,
              textAlign: 'center',
              letterSpacing: '0.04em',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 8px 20px rgba(4, 120, 87, 0.25)',
            }}
          >
            ✓ VISIT NOTE CONFIRMED
          </div>
        </div>

        {/* Card 2: PDF Visit Report */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 28,
            padding: 36,
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.07)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: 420,
            boxSizing: 'border-box',
            transform: `translateY(${(1 - card2Spring) * 30}px)`,
            opacity: card2Spring,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  padding: '3px 6px',
                  borderRadius: 4,
                  border: '1px solid #bfdbfe',
                }}
              >
                PDF
              </span>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#2563eb', letterSpacing: '0.08em' }}>
                OFFLINEDOC VISIT REPORT
              </span>
            </div>

            <h3 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: '18px 0 20px 0' }}>
              Patient visit summary
            </h3>

            {/* Document lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ height: 8, width: '95%', backgroundColor: '#cbd5e1', borderRadius: 4 }} />
              <div style={{ height: 8, width: '90%', backgroundColor: '#e2e8f0', borderRadius: 4 }} />
              <div style={{ height: 8, width: '70%', backgroundColor: '#e2e8f0', borderRadius: 4 }} />
            </div>
          </div>

          <div
            style={{
              padding: '12px 18px',
              backgroundColor: '#ecfdf5',
              color: '#065f46',
              borderRadius: 14,
              fontSize: 13,
              fontWeight: 800,
              textAlign: 'center',
              letterSpacing: '0.04em',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            ✓ CONFIRMED BY HEALTH WORKER
          </div>
        </div>

        {/* Card 3: Follow-Up Checklist */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 28,
            padding: 36,
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.07)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: 420,
            boxSizing: 'border-box',
            transform: `translateY(${(1 - card3Spring) * 30}px)`,
            opacity: card3Spring,
          }}
        >
          <div>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#2563eb', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              FOLLOW-UP CHECKLIST
            </span>

            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                'Follow up in 3 days',
                'Re-check BP (baseline 120/80)',
                'Monitor headache recovery',
              ].map((task, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      backgroundColor: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 900,
                    }}
                  >
                    ✓
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{task}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: '12px 18px',
              backgroundColor: '#f1f5f9',
              color: '#475569',
              borderRadius: 14,
              fontSize: 12,
              fontWeight: 800,
              textAlign: 'center',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            READY FOR COMMUNITY WORKER
          </div>
        </div>
      </div>

      <Subtitles text="Health workers can review, edit, and confirm the information before generating a PDF visit report and follow-up checklist." />
    </div>
  );
};