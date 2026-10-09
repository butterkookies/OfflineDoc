import React from 'react';
import { useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { Badge } from '../components/Badge';

export const Scene5StructuredRecord: React.FC = () => {
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
        <Badge label="WORKING FEATURE 02 • AUDITABLE CLINICAL EXTRACTION" dotColor="#2563eb" textColor="#2563eb" />
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
          STRUCTURED DOH RECORDS. VERIFIED EVIDENCE.
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
          Llama 3.2 1B maps Taglish phrases into Target Client List fields — with every detail linked to verbatim quotes.
        </p>
      </div>

      {/* Main Content: Two Bento Cards with Linking Line */}
      <div
        style={{
          position: 'absolute',
          top: 220,
          left: 100,
          right: 100,
          display: 'grid',
          gridTemplateColumns: '1.05fr 1.35fr',
          gap: 36,
        }}
      >
        {/* Left Bento: Verbatim Transcript Quotes */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.06)',
            padding: '32px 36px',
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
                fontSize: 15,
                fontWeight: 800,
                color: '#0284c7',
                letterSpacing: '0.06em',
                fontFamily: 'Inter, system-ui, sans-serif',
                textTransform: 'uppercase',
              }}
            >
              VERBATIM TRANSCRIPT (INPUT)
            </div>
            <div
              style={{
                fontSize: 16,
                color: '#64748b',
                marginTop: 4,
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 500,
              }}
            >
              Every extracted entity is grounded in a specific spoken quote.
            </div>

            {/* 6 Quote Cards */}
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { tag: 'Maria Santos', bg: '#eff6ff', tagColor: '#1d4ed8', quote: '"Pangatlong checkup po ni Maria Santos"' },
                { tag: '28yo, Purok 2', bg: '#fefce8', tagColor: '#b45309', quote: '"28 years old, taga Purok 2"' },
                { tag: '32 wks AOG', bg: '#f0fdf4', tagColor: '#15803d', quote: '"32 weeks na po ang tiyan"' },
                { tag: 'BP 120/80', bg: '#fff1f2', tagColor: '#e11d48', quote: '"BP ay 120 over 80"' },
                { tag: 'No Edema', bg: '#f8fafc', tagColor: '#475569', quote: '"Wala na pong manas sa paa"' },
                { tag: 'Iron Supps', bg: '#faf5ff', tagColor: '#6b21a8', quote: '"tuloy pa rin po ang ferrous sulfate"' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 18px',
                    backgroundColor: item.bg,
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        backgroundColor: '#ffffff',
                        color: item.tagColor,
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 800,
                        border: '1px solid #cbd5e1',
                      }}
                    >
                      {item.tag}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#0f172a',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {item.quote}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
                    Source Quote linked for statutory audit trail
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: '12px 18px',
              backgroundColor: '#eff6ff',
              borderRadius: 12,
              border: '1px solid #bfdbfe',
              fontSize: 13,
              fontWeight: 800,
              color: '#1d4ed8',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            SUB-SECOND • LLAMA 3.2 1B EDGE LATENCY: 0.79s (SUB-SECOND ON CPU)
          </div>
        </div>

        {/* Right Bento: DOH Target Client List Fields */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.06)',
            padding: '32px 36px',
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
                fontSize: 15,
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '0.06em',
                fontFamily: 'Inter, system-ui, sans-serif',
                textTransform: 'uppercase',
              }}
            >
              DOH TARGET CLIENT LIST (TCL) CLINICAL FIELDS
            </div>
            <div
              style={{
                fontSize: 16,
                color: '#64748b',
                marginTop: 4,
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 500,
              }}
            >
              Strict 'Null-Not-Guess' rule: unmentioned fields stay null.
            </div>

            {/* 7 Field Rows */}
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Patient Name:', val: 'Maria Santos', badge: 'VERIFIED MATCH', badgeBg: '#eff6ff', badgeColor: '#1d4ed8' },
                { label: 'Age / Sex / Purok:', val: '28 yo / Female / Purok 2', badge: 'CONFIRMED', badgeBg: '#fefce8', badgeColor: '#b45309' },
                { label: 'TCL Category:', val: 'Maternal Care (Prenatal Follow-up 3)', badge: 'ACTIVE COHORT', badgeBg: '#eff6ff', badgeColor: '#2563eb' },
                { label: 'Blood Pressure:', val: '120/80 mmHg (Systolic 120, Diastolic 80)', badge: 'NORMOTENSIVE', badgeBg: '#f0fdf4', badgeColor: '#15803d' },
                { label: 'Gestational Age:', val: '32 Weeks AOG • Weight: 54.0 kg', badge: 'ON SCHEDULE', badgeBg: '#f0fdf4', badgeColor: '#15803d' },
                { label: 'Pertinent Negatives:', val: 'No pedal edema (manas sa paa resolved)', badge: 'RESOLVED', badgeBg: '#f8fafc', badgeColor: '#475569' },
                { label: 'Prescribed Medicine:', val: 'Ferrous sulfate 60mg OD (oral iron)', badge: 'ADHERENT', badgeBg: '#faf5ff', badgeColor: '#6b21a8' },
              ].map((row, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 18px',
                    backgroundColor: '#f8fafc',
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b', width: 140 }}>
                      {row.label}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
                      {row.val}
                    </span>
                  </div>
                  <span
                    style={{
                      padding: '3px 10px',
                      backgroundColor: row.badgeBg,
                      color: row.badgeColor,
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {row.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: '12px 18px',
              backgroundColor: '#f0fdf4',
              borderRadius: 12,
              border: '1px solid #bbf7d0',
              fontSize: 13,
              fontWeight: 800,
              color: '#15803d',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            VERIFIED • CLINICAL SAFETY RULE PASSED: Normal maternal blood pressure. No danger signs flagged.
          </div>
        </div>
      </div>

      <Subtitles text="With local AI, information is organized into a structured visit record, with details linked to their original transcript for verification." />
    </div>
  );
};