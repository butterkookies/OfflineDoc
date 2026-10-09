import React from 'react';
import { useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { Badge } from '../components/Badge';

export const Scene6PdfAndReview: React.FC = () => {
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
        <Badge label="WORKING FEATURE 03 • POINT-OF-CARE RED FLAGS & PDF EXPORT" dotColor="#2563eb" textColor="#2563eb" />
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
          REVIEW, CONFIRM & GENERATE DOH ITR SLIPS.
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
          Automatic danger sign red flag checker + instant single-page Department of Health encounter slips.
        </p>
      </div>

      {/* Main Content: Safety Checker & DOH ITR PDF */}
      <div
        style={{
          position: 'absolute',
          top: 220,
          left: 100,
          right: 100,
          display: 'grid',
          gridTemplateColumns: '1.1fr 1.25fr',
          gap: 36,
        }}
      >
        {/* Left Bento: Point-of-Care Clinical Safety Checker */}
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
                fontSize: 15,
                fontWeight: 800,
                color: '#dc2626',
                letterSpacing: '0.06em',
                fontFamily: 'Inter, system-ui, sans-serif',
                textTransform: 'uppercase',
              }}
            >
              POINT-OF-CARE CLINICAL SAFETY CHECKER
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
              Automatically detects hypertensive crises and pre-eclampsia risks.
            </div>

            {/* Red Alert Card */}
            <div
              style={{
                marginTop: 24,
                padding: '20px 24px',
                backgroundColor: '#fff1f2',
                borderRadius: 16,
                border: '1px solid #fecdd3',
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 900,
                  color: '#e11d48',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.04em',
                }}
              >
                ALERT • DANGER SIGN: HYPERTENSIVE CRISIS (BP &gt;= 140/90)
              </div>
              <div style={{ marginTop: 8, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                Patient: Teresa Ramos (54yo, Purok 4)
              </div>
              <div style={{ marginTop: 4, fontSize: 14, color: '#9f1239', fontWeight: 600 }}>
                Blood Pressure: 150/95 mmHg with severe occipital headache.
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#be123c',
                  backgroundColor: '#ffe4e6',
                  padding: '6px 12px',
                  borderRadius: 8,
                  display: 'inline-block',
                }}
              >
                Protocol Triggered: Mandatory prompt RHU Physician Referral.
              </div>
            </div>

            {/* Green Normal Protocol Card */}
            <div
              style={{
                marginTop: 18,
                padding: '20px 24px',
                backgroundColor: '#f0fdf4',
                borderRadius: 16,
                border: '1px solid #bbf7d0',
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 900,
                  color: '#15803d',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.04em',
                }}
              >
                VERIFIED • MATERNAL PROTOCOL: Maria Santos (28yo, Purok 2)
              </div>
              <div style={{ marginTop: 6, fontSize: 14, color: '#166534', fontWeight: 600 }}>
                Trimester 3 prenatal vitals normal (120/80 mmHg). No proteinuric alert.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                padding: '16px',
                backgroundColor: '#2563eb',
                borderRadius: 12,
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: '0.04em',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
              }}
            >
              CONFIRM & COMMIT TO LOCAL LEDGER
            </div>

            <div
              style={{
                padding: '14px 18px',
                backgroundColor: '#f8fafc',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                fontSize: 12,
                color: '#475569',
                fontFamily: 'Inter, monospace',
              }}
            >
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>LOCAL JSON LEDGER ATOMIC COMMIT</div>
              <div>• Encounter saved to data/visits/visit_1791578264.json</div>
              <div>• Patient longitudinal timeline updated in data/patients/P-001.json</div>
            </div>
          </div>
        </div>

        {/* Right Bento: Official DOH Individual Treatment Record (ITR) PDF */}
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
                fontSize: 15,
                fontWeight: 800,
                color: '#0284c7',
                letterSpacing: '0.06em',
                fontFamily: 'Inter, system-ui, sans-serif',
                textTransform: 'uppercase',
              }}
            >
              OFFICIAL DOH INDIVIDUAL TREATMENT RECORD (ITR)
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
              Single-page printable PDF generated locally on device via fpdf2.
            </div>

            {/* Document Vector Preview */}
            <div
              style={{
                marginTop: 18,
                backgroundColor: '#ffffff',
                border: '1px solid #94a3b8',
                borderRadius: 10,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                padding: '16px 20px',
                height: 380,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                fontSize: 10,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {/* Official DOH Header */}
              <div style={{ textAlign: 'center', borderBottom: '1px solid #cbd5e1', paddingBottom: 8 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b' }}>REPUBLIC OF THE PHILIPPINES</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: '#0369a1' }}>DEPARTMENT OF HEALTH</div>
                <div style={{ fontSize: 8, color: '#475569' }}>
                  PRIMARY CARE SERVICES • RURAL HEALTH UNIT & BARANGAY HEALTH STATION
                </div>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                  INDIVIDUAL TREATMENT RECORD (ITR) — CLINICAL ENCOUNTER SLIP
                </div>
              </div>

              {/* Patient Meta Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 6,
                  backgroundColor: '#f8fafc',
                  padding: '6px 10px',
                  borderRadius: 6,
                  fontSize: 9,
                }}
              >
                <div><strong>Patient:</strong> Maria Santos</div>
                <div><strong>Age / Sex:</strong> 28 yo / Female</div>
                <div><strong>Purok / Sitio:</strong> Purok 2</div>
                <div><strong>TCL Category:</strong> Maternal Care</div>
                <div><strong>Encounter ID:</strong> ITR-2026-0042</div>
                <div><strong>Date/Time:</strong> 2026-10-10 05:27:11</div>
              </div>

              {/* Section I: Metrics Table */}
              <div>
                <div style={{ fontSize: 9, fontWeight: 800, color: '#0284c7' }}>I. TARGET CLIENT LIST (TCL) CLINICAL METRICS & VITALS</div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
                    fontSize: 8.5,
                    borderTop: '1px solid #e2e8f0',
                    padding: '4px 0',
                    marginTop: 4,
                  }}
                >
                  <span style={{ color: '#64748b' }}>Blood Pressure (BP)</span>
                  <span style={{ fontWeight: 700 }}>120/80 mmHg</span>
                  <span style={{ color: '#64748b' }}>Standard: 90/60 to 120/80</span>
                  <span style={{ color: '#16a34a', fontWeight: 800 }}>Normotensive</span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
                    fontSize: 8.5,
                    borderTop: '1px solid #f1f5f9',
                    padding: '4px 0',
                  }}
                >
                  <span style={{ color: '#64748b' }}>Gestational Age</span>
                  <span style={{ fontWeight: 700 }}>32 weeks AOG</span>
                  <span style={{ color: '#64748b' }}>Term: 37 to 40 weeks</span>
                  <span style={{ color: '#2563eb', fontWeight: 800 }}>Trimester 3</span>
                </div>
              </div>

              {/* Section II: Care Plan */}
              <div style={{ backgroundColor: '#fefce8', padding: '6px 10px', borderRadius: 6, fontSize: 8.5 }}>
                <div style={{ fontWeight: 800, color: '#a16207' }}>CARE PLAN & PRESCRIBED MEDICINES (GENERIC DISPENSATION):</div>
                <div style={{ color: '#854d0e', marginTop: 2 }}>
                  Ferrous sulfate 60mg OD (oral iron). Next RHU checkup scheduled in 2 weeks.
                </div>
              </div>

              {/* Signatures */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: 6, fontSize: 8 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>Maria Dela Cruz, BHW</div>
                  <div style={{ color: '#64748b' }}>Barangay Health Worker (Accredited RA 7883)</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700 }}>Doc Santos, MD</div>
                  <div style={{ color: '#64748b' }}>Rural Health Physician (License # 089124)</div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              backgroundColor: '#0284c7',
              borderRadius: 12,
              color: '#ffffff',
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: '0.04em',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 8px 20px rgba(2, 132, 199, 0.25)',
            }}
          >
            GENERATE OFFICIAL DOH ITR SLIP (PDF)
          </div>
        </div>
      </div>

      <Subtitles text="Health workers can review, edit, and confirm the information before generating a PDF visit report and follow-up checklist." />
    </div>
  );
};