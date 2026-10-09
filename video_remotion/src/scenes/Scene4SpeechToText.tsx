import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { Badge } from '../components/Badge';

export const Scene4SpeechToText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const phoneSpring = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 100 } });
  const cardSpring = spring({ frame: frame - 18, fps, config: { damping: 14, stiffness: 100 } });

  const fullTranscript = "Headache began this morning. Blood pressure is 120 over 80. Follow up in three days.";
  const charsShown = Math.floor(interpolate(frame, [25, 170], [0, fullTranscript.length], {
    extrapolateRight: 'clamp',
  }));
  const displayedText = fullTranscript.slice(0, charsShown);
  const progressBar = interpolate(frame, [25, 170], [10, 65], { extrapolateRight: 'clamp' });

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
        <Badge label="OFFLINEDOC • VOICE NOTES" dotColor="#10b981" textColor="#64748b" />
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
          <span style={{ color: '#0f172a' }}>FROM VOICE TO </span>
          <span style={{ color: '#2563eb' }}>VISIT NOTE.</span>
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
          Record once. Review and confirm before export.
        </p>
      </div>

      {/* Main Grid: Left Phone, Right Transcript Card */}
      <div
        style={{
          position: 'absolute',
          top: 270,
          left: 140,
          right: 140,
          display: 'grid',
          gridTemplateColumns: '400px 1fr',
          gap: 40,
          alignItems: 'center',
        }}
      >
        {/* Left: Phone Mockup */}
        <div
          style={{
            width: 380,
            height: 600,
            backgroundColor: '#0f172a',
            borderRadius: 44,
            padding: '14px 12px',
            boxShadow: '0 25px 50px rgba(15, 23, 42, 0.2)',
            transform: `translateY(${(1 - phoneSpring) * 30}px)`,
            opacity: phoneSpring,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#ffffff',
              borderRadius: 34,
              overflow: 'hidden',
              padding: '24px 20px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            {/* Notch */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 100,
                height: 18,
                backgroundColor: '#0f172a',
                borderRadius: '0 0 12px 12px',
              }}
            />

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>
                  Offline<span style={{ color: '#2563eb' }}>Doc</span>
                </span>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981', backgroundColor: '#ecfdf5', padding: '3px 8px', borderRadius: 999 }}>
                  • OFFLINE
                </span>
              </div>

              <div style={{ marginTop: 22 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#64748b', letterSpacing: '0.08em' }}>
                  NEW VISIT
                </span>
                <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '4px 0 2px 0' }}>
                  Record summary
                </h3>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                  Speak naturally. Review note after.
                </p>
              </div>

              {/* Sound Wave */}
              <div
                style={{
                  marginTop: 20,
                  padding: '16px 12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  height: 60,
                }}
              >
                {[20, 45, 30, 60, 40, 75, 50, 65, 80, 55, 35, 70, 45, 60, 30, 50].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: 4,
                      height: Math.max(10, Math.sin(frame * 0.25 + i * 0.5) * (h * 0.4) + h * 0.5),
                      backgroundColor: i % 3 === 0 ? '#10b981' : '#2563eb',
                      borderRadius: 2,
                    }}
                  />
                ))}
              </div>

              <div
                style={{
                  marginTop: 14,
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#0f172a',
                  textAlign: 'center',
                }}
              >
                ✓ RECORDING SAVED • 00:28
              </div>
            </div>

            {/* Checkmark Button */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  fontWeight: 900,
                  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.35)',
                }}
              >
                ✓
              </div>

              <span
                style={{
                  marginTop: 14,
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#64748b',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                AUDIO CLEARED AFTER TRANSCRIPTION
              </span>
            </div>
          </div>
        </div>

        {/* Right: Transcript Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 32,
            padding: '44px 48px',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: 480,
            boxSizing: 'border-box',
            transform: `translateY(${(1 - cardSpring) * 30}px)`,
            opacity: cardSpring,
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Badge label="TRANSCRIPT • LOCAL SPEECH RECOGNITION" dotColor="#2dd4bf" textColor="#2563eb" />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: '#94a3b8',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                SYNTHETIC DEMO
              </span>
            </div>

            {/* Typewriter Text Box */}
            <div
              style={{
                marginTop: 40,
                fontSize: 34,
                fontWeight: 800,
                color: '#0f172a',
                fontFamily: 'Inter, system-ui, sans-serif',
                lineHeight: 1.5,
                minHeight: 180,
              }}
            >
              "{displayedText}
              <span
                style={{
                  display: 'inline-block',
                  width: 14,
                  height: 34,
                  backgroundColor: '#2563eb',
                  marginLeft: 6,
                  verticalAlign: 'text-bottom',
                  opacity: (Math.sin(frame * 0.3) + 1) / 2 > 0.4 ? 1 : 0,
                }}
              />
              "
            </div>
          </div>

          <div>
            {/* Progress Bar */}
            <div
              style={{
                width: '100%',
                height: 8,
                backgroundColor: '#e2e8f0',
                borderRadius: 999,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progressBar}%`,
                  height: '100%',
                  background: 'linear-gradient(to right, #2563eb, #2dd4bf)',
                  borderRadius: 999,
                }}
              />
            </div>

            <div
              style={{
                marginTop: 16,
                fontSize: 13,
                fontWeight: 800,
                color: '#64748b',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              RECORDED AUDIO → TRANSCRIPT GENERATED LOCALLY ON DEVICE
            </div>
          </div>
        </div>
      </div>

      <Subtitles text="Simply record a patient visit summary, and OfflineDoc transforms speech into text using on-device speech recognition." />
    </div>
  );
};