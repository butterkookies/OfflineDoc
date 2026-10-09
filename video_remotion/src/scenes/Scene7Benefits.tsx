import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { Badge } from '../components/Badge';

export const Scene7Benefits: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const card1Spring = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 100 } });
  const card2Spring = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 100 } });
  const card3Spring = spring({ frame: frame - 16, fps, config: { damping: 14, stiffness: 100 } });

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
        <Badge label="FRONT-LINE CLINICAL BENEFITS • DESIGNED FOR BARANGAY HEALTH STATIONS" dotColor="#10b981" textColor="#10b981" />
        <h1
          style={{
            fontSize: 58,
            fontWeight: 900,
            margin: '12px 0 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          <span style={{ color: '#0f172a' }}>PATIENT INFO STAYS </span>
          <span style={{ color: '#2563eb' }}>ON THIS DEVICE.</span>
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
          No cloud dependency, no manual transcription, zero third-party data transmission.
        </p>
      </div>

      {/* 3-Column Bento Layout */}
      <div
        style={{
          position: 'absolute',
          top: 220,
          left: 100,
          right: 100,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 32,
        }}
      >
        {/* Card 1: 100% AIR-GAPPED */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            border: '2px solid #0f172a',
            padding: '36px 32px',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: 670,
            boxSizing: 'border-box',
            transform: `translateY(${(1 - card1Spring) * 24}px)`,
            opacity: card1Spring,
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: '#2563eb',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                01 • 100% AIR-GAPPED
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#065f46',
                  backgroundColor: '#ecfdf5',
                  padding: '4px 10px',
                  borderRadius: 999,
                  letterSpacing: '0.04em',
                }}
              >
                AIRPLANE MODE OK
              </span>
            </div>

            <div
              style={{
                fontSize: 38,
                fontWeight: 900,
                color: '#0f172a',
                marginTop: 18,
                letterSpacing: '-0.02em',
                fontFamily: 'Inter, sans-serif',
                lineHeight: 1.1,
              }}
            >
              0 KB Cloud Data Sent
            </div>

            <div
              style={{
                fontSize: 15,
                color: '#64748b',
                marginTop: 8,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              Faster-Whisper & Llama 3.2 run entirely on CPU in deep rural sitios.
            </div>

            {/* Checklist */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { title: 'Local Speech-to-Text', desc: 'Faster-Whisper INT8 runs offline' },
                { title: 'Local Entity Extraction', desc: 'Llama 3.2 1B strictly on local CPU' },
                { title: 'Zero Cloud APIs', desc: 'No OpenAI, Google, or AWS endpoints' },
                { title: 'Ephemeral Audio Buffer', desc: 'Audio wiped from RAM immediately' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      backgroundColor: '#ecfdf5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 900,
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    ✓
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', fontFamily: 'Inter, sans-serif' }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: '14px 18px',
              backgroundColor: '#f1f5f9',
              borderRadius: 14,
              fontSize: 12,
              fontWeight: 800,
              color: '#334155',
              letterSpacing: '0.04em',
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            ENCLAVE: 127.0.0.1 LOCALHOST ONLY
          </div>
        </div>

        {/* Card 2: 95% TIME SAVED */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            border: '2px solid #2563eb',
            padding: '36px 32px',
            boxShadow: '0 20px 45px rgba(37, 99, 235, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: 670,
            boxSizing: 'border-box',
            transform: `translateY(${(1 - card2Spring) * 24}px)`,
            opacity: card2Spring,
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: '#2563eb',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                02 • 95% TIME SAVED
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#1e40af',
                  backgroundColor: '#eff6ff',
                  padding: '4px 10px',
                  borderRadius: 999,
                  letterSpacing: '0.04em',
                }}
              >
                SUB-4s INFERENCE
              </span>
            </div>

            <div
              style={{
                fontSize: 38,
                fontWeight: 900,
                color: '#2563eb',
                marginTop: 18,
                letterSpacing: '-0.02em',
                fontFamily: 'Inter, sans-serif',
                lineHeight: 1.1,
              }}
            >
              &lt; 4 Sec vs 4 Hours
            </div>

            <div
              style={{
                fontSize: 15,
                color: '#64748b',
                marginTop: 8,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              Transforms 3–4 hours of evening paperwork into a 30s Taglish voice dictation.
            </div>

            {/* Performance Stats */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Voice Audio Input', value: '20 - 45s', note: 'Natural Taglish dictation' },
                { label: 'Whisper STT Latency', value: '~2.1s', note: 'INT8 quantized speech inference' },
                { label: 'Llama 3.2 1B Extraction', value: '~0.79s', note: 'Maps Taglish to DOH TCL fields' },
                { label: 'DOH PDF ITR Generation', value: '< 0.4s', note: 'Instant official encounter slip' },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    padding: '10px 14px',
                    backgroundColor: '#f8fafc',
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'Inter, sans-serif' }}>
                      {stat.note}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 900,
                      color: '#2563eb',
                      fontFamily: 'Inter, monospace',
                    }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: '14px 18px',
              backgroundColor: '#eff6ff',
              borderRadius: 14,
              fontSize: 12,
              fontWeight: 800,
              color: '#1d4ed8',
              letterSpacing: '0.04em',
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            END-TO-END TURNAROUND: &lt; 3.8 SECONDS
          </div>
        </div>

        {/* Card 3: STATUTORY PRIVACY */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            border: '2px solid #10b981',
            padding: '36px 32px',
            boxShadow: '0 20px 45px rgba(16, 185, 129, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: 670,
            boxSizing: 'border-box',
            transform: `translateY(${(1 - card3Spring) * 24}px)`,
            opacity: card3Spring,
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: '#059669',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                03 • STATUTORY PRIVACY
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#065f46',
                  backgroundColor: '#ecfdf5',
                  padding: '4px 10px',
                  borderRadius: 999,
                  letterSpacing: '0.04em',
                }}
              >
                LEGAL COMPLIANCE
              </span>
            </div>

            <div
              style={{
                fontSize: 38,
                fontWeight: 900,
                color: '#059669',
                marginTop: 18,
                letterSpacing: '-0.02em',
                fontFamily: 'Inter, sans-serif',
                lineHeight: 1.1,
              }}
            >
              RA 10173 & RA 7883
            </div>

            <div
              style={{
                fontSize: 15,
                color: '#64748b',
                marginTop: 8,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              100% on-device residency; zero PHI cloud transmission, safeguarding BHWs & patients.
            </div>

            {/* Legal / Compliance Points */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                {
                  code: 'RA 10173',
                  title: 'Data Privacy Act of 2012',
                  desc: 'Patient health information never leaves barangay premises.',
                },
                {
                  code: 'RA 7883',
                  title: 'BHW Benefits & Incentives Act',
                  desc: 'Empowers volunteer health workers without tedious paper log burden.',
                },
                {
                  code: 'DOH ITR',
                  title: 'Official Konsulta Alignment',
                  desc: 'Generates standardized clinical records ready for physician audit.',
                },
                {
                  code: 'LOCAL',
                  title: 'Cryptographic Integrity',
                  desc: 'Deterministic hashes & auditable encounter logs stored locally.',
                },
              ].map((law, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#ecfdf5',
                      color: '#047857',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 800,
                      fontFamily: 'Inter, monospace',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {law.code}
                  </span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
                      {law.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', fontFamily: 'Inter, sans-serif' }}>
                      {law.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: '14px 18px',
              backgroundColor: '#ecfdf5',
              borderRadius: 14,
              fontSize: 12,
              fontWeight: 800,
              color: '#065f46',
              letterSpacing: '0.04em',
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            NPC CIRCULAR & DOH GUIDELINES READY
          </div>
        </div>
      </div>

      <Subtitles text="No cloud dependency, no unnecessary manual work, just practical AI designed to support efficient documentation while keeping patient information on the device." />
    </div>
  );
};