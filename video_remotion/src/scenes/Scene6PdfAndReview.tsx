import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { Badge } from '../components/Badge';

export const Scene6PdfAndReview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const leftPanelSpring = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 100 } });
  const pdfSpring = spring({ frame: frame - 25, fps, config: { damping: 14, stiffness: 100 } });
  const checkScale = spring({ frame: frame - 45, fps, config: { damping: 12, stiffness: 120 } });

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden' }}>
      <GridBackground accentColor="#0ea5e9" />

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
          label="STEP 3: REVIEW & OFFICIAL DOH EXPORT"
          color="#38bdf8"
          bgColor="rgba(14, 165, 233, 0.15)"
          icon={<span style={{ fontSize: 16 }}>📄</span>}
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
          Review, Edit & Export Instant DOH PDF Reports.
        </h1>
        <p
          style={{
            fontSize: 22,
            color: '#94a3b8',
            margin: '6px 0 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Health workers maintain full clinical control before generating standard PhilHealth Konsulta reports.
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 250,
          left: 120,
          right: 120,
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr',
          gap: 40,
        }}
      >
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 28,
            padding: 36,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            transform: `translateY(${(1 - leftPanelSpring) * 40}px)`,
            opacity: leftPanelSpring,
          }}
        >
          <div>
            <span style={{ color: '#38bdf8', fontSize: 14, fontWeight: 700 }}>CLINICAL VERIFICATION SUITE</span>
            <h3 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '10px 0 16px 0' }}>
              Human-In-The-Loop Safety
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { title: 'Click-to-Edit Records', desc: 'Modify any field or vital signs with instant inline updates' },
                { title: 'Teleprompter Guides', desc: '9 clinical presets for Hypertension, Prenatal, Cough & Diabetes' },
                { title: 'Live Camera Capture', desc: 'Attach photos of prescriptions, wounds, or skin lesions' },
                { title: 'Instant Audit Trail', desc: 'Tracks who recorded and validated the patient record' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: '14px 18px',
                    borderRadius: 14,
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid #10b981',
                      color: '#34d399',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 800,
                    }}
                  >
                    ✓
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>{item.title}</div>
                    <div style={{ color: '#94a3b8', fontSize: 13 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: '16px 20px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 10px 25px rgba(14, 165, 233, 0.4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>⚡</span>
              <span style={{ fontSize: 16, fontWeight: 700 }}>1-Tap Vector PDF Export</span>
            </div>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.2)',
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              0.04s EXPORT
            </span>
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: 24,
            padding: 36,
            color: '#0f172a',
            fontFamily: 'Inter, system-ui, sans-serif',
            boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
            transform: `translateY(${(1 - pdfSpring) * 40}px) scale(0.98)`,
            opacity: pdfSpring,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '2px solid #0f172a',
                paddingBottom: 16,
              }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', color: '#64748b' }}>
                  REPUBLIC OF THE PHILIPPINES • DEPARTMENT OF HEALTH
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginTop: 2 }}>
                  KONSULTA CLINICAL RECORD (FORM 1)
                </div>
              </div>
              <div
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  background: '#0284c7',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 800,
                }}
              >
                PHILHEALTH COMPLIANT
              </div>
            </div>

            <div
              style={{
                marginTop: 20,
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr 1fr',
                gap: 12,
                background: '#f8fafc',
                padding: 16,
                borderRadius: 12,
                border: '1px solid #e2e8f0',
              }}
            >
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>PATIENT NAME</span>
                <div style={{ fontSize: 16, fontWeight: 800 }}>Maria Santos</div>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>AGE / SEX</span>
                <div style={{ fontSize: 16, fontWeight: 800 }}>48 / Female</div>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>TRIAGE PRIORITY</span>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#d97706' }}>🟡 MONITORING</div>
              </div>
            </div>

            <div
              style={{
                marginTop: 16,
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 10,
                textAlign: 'center',
              }}
            >
              <div style={{ border: '1px solid #cbd5e1', padding: '8px', borderRadius: 8 }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>BP</span>
                <div style={{ fontSize: 16, fontWeight: 800 }}>135/85</div>
              </div>
              <div style={{ border: '1px solid #cbd5e1', padding: '8px', borderRadius: 8 }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>TEMP</span>
                <div style={{ fontSize: 16, fontWeight: 800 }}>38.3 °C</div>
              </div>
              <div style={{ border: '1px solid #cbd5e1', padding: '8px', borderRadius: 8 }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>HR</span>
                <div style={{ fontSize: 16, fontWeight: 800 }}>84 bpm</div>
              </div>
              <div style={{ border: '1px solid #cbd5e1', padding: '8px', borderRadius: 8 }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>RR</span>
                <div style={{ fontSize: 16, fontWeight: 800 }}>18 cpm</div>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>CHIEF COMPLAINT & FINDINGS</span>
              <div style={{ fontSize: 14, marginTop: 4, lineHeight: 1.4, color: '#334155' }}>
                Productive cough with low-grade fever for 3 days. Clear breath sounds bilaterally. Hydration emphasized.
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: '2px dashed #cbd5e1',
              paddingTop: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>OFFICIALLY VERIFIED BY BHW</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Purok 3 Health Station • San Jose</div>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#10b981',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                transform: `scale(${checkScale})`,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
              }}
            >
              ✓
            </div>
          </div>
        </div>
      </div>

      <Subtitles text="Health workers can review, edit, and confirm the information before generating a PDF visit report and follow-up checklist." />
    </div>
  );
};