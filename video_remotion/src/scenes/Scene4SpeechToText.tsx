import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { Badge } from '../components/Badge';

export const Scene4SpeechToText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const leftSpring = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 100 } });
  const rightSpring = spring({ frame: frame - 12, fps, config: { damping: 14, stiffness: 100 } });

  // Typewriter effect for authentic Taglish BHW clinical speech
  const fullTranscript =
    'Pangatlong checkup po ni Maria Santos, 28 years old, taga Purok 2. 32 weeks na po ang tiyan, BP ay isang daan at dalawampu over otsenta. Wala na pong manas sa paa, maayos ang pakiramdam. Niresetahan ng ferrous sulfate para tuloy-tuloy ang iron.';

  const charsShown = Math.floor(
    interpolate(frame, [15, 180], [0, fullTranscript.length], { extrapolateRight: 'clamp' })
  );
  const displayedTranscript = fullTranscript.slice(0, charsShown);

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
        <Badge label="WORKING FEATURE 01 • ON-DEVICE VOICE RECOGNITION" dotColor="#2563eb" textColor="#2563eb" />
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
          SPEAK NATURALLY IN TAGLISH.
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
          Simply record a patient visit summary. OfflineDoc transforms speech into text using faster-whisper INT8.
        </p>
      </div>

      {/* Main Content: Intake Modal (Left) & Verbatim Transcription Output (Right) */}
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
        {/* Left Bento: Kindle Calm Intake Modal Step 1 */}
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
                color: '#0284c7',
                letterSpacing: '0.06em',
                fontFamily: 'Inter, system-ui, sans-serif',
                textTransform: 'uppercase',
              }}
            >
              KINDLE CALM INTAKE MODAL (STEP 1: RECORD)
            </div>

            {/* 3 Step Wizard Pills */}
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              {['1. Record', '2. Review & Gaps', '3. Confirm & Export'].map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    textAlign: 'center',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 800,
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: idx === 0 ? '#2563eb' : '#f1f5f9',
                    color: idx === 0 ? '#ffffff' : '#64748b',
                    boxShadow: idx === 0 ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none',
                  }}
                >
                  {step}
                </div>
              ))}
            </div>

            <div
              style={{
                fontSize: 14,
                color: '#64748b',
                marginTop: 20,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
              }}
            >
              Speak a 20-45s summary in Taglish or English:
            </div>

            {/* Instruction Card */}
            <div
              style={{
                marginTop: 10,
                padding: '16px 20px',
                backgroundColor: '#f8fafc',
                borderRadius: 14,
                border: '1px solid #e2e8f0',
                fontSize: 14,
                color: '#475569',
                fontFamily: 'Inter, sans-serif',
                lineHeight: 1.45,
              }}
            >
              "State patient name, age, purok, vitals (BP/weight), symptoms, and medications. 100% on device."
            </div>

            {/* Centered Microphone Orb with Pulse */}
            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  backgroundColor: '#eff6ff',
                  border: '2px solid #bfdbfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(37, 99, 235, 0.2)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    backgroundColor: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: 28,
                  }}
                >
                  🎙️
                </div>
              </div>

              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: '#0f172a',
                  fontFamily: 'Inter, monospace',
                  marginTop: 14,
                }}
              >
                00:20
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: '#dc2626',
                  letterSpacing: '0.06em',
                  fontFamily: 'Inter, sans-serif',
                  marginTop: 2,
                }}
              >
                [REC] RECORDING LIVE AUDIO (16 kHz)
              </div>
            </div>
          </div>

          {/* Equalizer Visualizer Bars */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              height: 48,
              padding: '10px 0',
            }}
          >
            {[18, 32, 44, 26, 48, 36, 22, 40, 50, 30, 24, 42, 38, 20, 46, 28].map((h, i) => {
              const pulse = Math.sin((frame + i * 12) * 0.25) * 12;
              const barHeight = Math.max(10, h + pulse);
              return (
                <div
                  key={i}
                  style={{
                    width: 7,
                    height: barHeight,
                    backgroundColor: '#2563eb',
                    borderRadius: 4,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Right Bento: Verbatim Clinical Transcription & Benchmark Card */}
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
              VERBATIM CLINICAL TRANSCRIPTION (WHISPER INT8)
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
              Recognizes authentic rural Philippine Taglish clinical terminology.
            </div>

            {/* Verbatim Transcript Box with Typewriter Effect */}
            <div
              style={{
                marginTop: 24,
                padding: '24px 28px',
                backgroundColor: '#f8fafc',
                borderRadius: 18,
                border: '1px solid #cbd5e1',
                minHeight: 180,
                boxSizing: 'border-box',
              }}
            >
              <p
                style={{
                  fontSize: 22,
                  lineHeight: 1.55,
                  color: '#1e40af',
                  fontWeight: 600,
                  margin: 0,
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                "{displayedTranscript}
                <span
                  style={{
                    display: 'inline-block',
                    width: 3,
                    height: 22,
                    backgroundColor: '#2563eb',
                    marginLeft: 4,
                    verticalAlign: 'middle',
                    opacity: frame % 16 < 8 ? 1 : 0,
                  }}
                />
                "
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Speed Benchmark Box */}
            <div
              style={{
                padding: '20px 24px',
                backgroundColor: '#eff6ff',
                borderRadius: 16,
                border: '1px solid #bfdbfe',
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: '#1d4ed8',
                  letterSpacing: '0.06em',
                  fontFamily: 'Inter, sans-serif',
                  textTransform: 'uppercase',
                }}
              >
                SPEED • FASTER-WHISPER INT8 INFERENCE BENCHMARK
              </div>
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: 14, color: '#1e3a8a', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  • <strong>Speech Recognition Latency:</strong> 2.14s on standard laptop CPU (Zero GPU required)
                </div>
                <div style={{ fontSize: 14, color: '#1e3a8a', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  • <strong>Taglish Number Normalizer:</strong> 'isang daan at dalawampu' &rarr; automatically converted to 120
                </div>
              </div>
            </div>

            {/* Privacy Card */}
            <div
              style={{
                padding: '16px 20px',
                backgroundColor: '#f0fdf4',
                borderRadius: 14,
                border: '1px solid #bbf7d0',
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#166534',
                  letterSpacing: '0.04em',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                VERIFIED • PRIVACY BY DESIGN: TEMPORARY AUDIO WIPED
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: '#15803d',
                  marginTop: 4,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                }}
              >
                Audio buffer is processed entirely in RAM and purged immediately after transcription.
              </div>
            </div>
          </div>
        </div>
      </div>

      <Subtitles text="Simply record a patient visit summary, and OfflineDoc transforms speech into text using on-device speech recognition." />
    </div>
  );
};