import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { Badge } from '../components/Badge';

export const Scene4SpeechToText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const micSpring = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 100 } });
  const textStreamSpring = spring({ frame: frame - 25, fps, config: { damping: 14, stiffness: 100 } });

  const fullTranscript =
    "Si Aling Maria, 48 years old, may 3 days nang ubo at lagnat. Blood pressure is 135 over 85, temperature 38.3°C, pulse rate 84. Binigyan ng Paracetamol at pinaalalahanan bumalik kapag lumala ang ubo.";
  
  const charsShown = Math.floor(interpolate(frame, [25, 180], [0, fullTranscript.length], {
    extrapolateRight: 'clamp',
  }));
  const displayedText = fullTranscript.slice(0, charsShown);

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden' }}>
      <GridBackground accentColor="#0ea5e9" />

      <div
        style={{
          position: 'absolute',
          top: 75,
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
          label="STEP 1: ON-DEVICE SPEECH RECOGNITION"
          color="#38bdf8"
          bgColor="rgba(14, 165, 233, 0.15)"
          icon={<span style={{ fontSize: 16 }}>🎙️</span>}
        />
        <h1
          style={{
            fontSize: 60,
            fontWeight: 800,
            color: '#ffffff',
            margin: '14px 0 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
            letterSpacing: '-0.02em',
          }}
        >
          Simply Record the Patient Summary.
        </h1>
        <p
          style={{
            fontSize: 22,
            color: '#94a3b8',
            margin: '8px 0 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          OfflineDoc transforms spoken Filipino & Taglish into verified text with zero latency.
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 270,
          left: 140,
          right: 140,
          display: 'grid',
          gridTemplateColumns: '420px 1fr',
          gap: 36,
        }}
      >
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(14, 165, 233, 0.4)',
            borderRadius: 28,
            padding: 36,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            transform: `translateY(${(1 - micSpring) * 40}px)`,
            opacity: micSpring,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #0ea5e9 0%, #0369a1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 54,
              boxShadow: `0 0 ${Math.sin(frame * 0.2) * 15 + 30}px #0ea5e9`,
              position: 'relative',
            }}
          >
            🎙️
            <div
              style={{
                position: 'absolute',
                top: -10,
                left: -10,
                right: -10,
                bottom: -10,
                borderRadius: '50%',
                border: '2px solid #38bdf8',
                opacity: (Math.sin(frame * 0.2) + 1) / 2,
                transform: `scale(${1 + (frame % 30) * 0.015})`,
              }}
            />
          </div>

          <div
            style={{
              marginTop: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 18px',
              borderRadius: 999,
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                boxShadow: '0 0 10px #ef4444',
              }}
            />
            <span style={{ color: '#fca5a5', fontWeight: 700, fontSize: 15 }}>
              REC 00:18 • LISTENING
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 28, height: 48 }}>
            {[30, 60, 40, 80, 50, 95, 70, 45, 85, 65, 35, 90, 55, 75, 40].map((h, i) => {
              const animatedH = Math.max(12, Math.sin(frame * 0.25 + i * 0.5) * (h * 0.45) + h * 0.5);
              return (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: animatedH,
                    borderRadius: 4,
                    background: 'linear-gradient(to top, #0ea5e9, #38bdf8)',
                    boxShadow: '0 0 8px rgba(56, 189, 248, 0.5)',
                  }}
                />
              );
            })}
          </div>

          <div style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, marginTop: 16 }}>
            Engine: GGML Whisper Small (100% Offline CPU)
          </div>
        </div>

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
            transform: `translateY(${(1 - textStreamSpring) * 40}px)`,
            opacity: textStreamSpring,
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>📝</span>
                <span style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>
                  Live Voice Transcription
                </span>
              </div>
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: 8,
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#34d399',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                ⚡ REAL-TIME STREAM
              </span>
            </div>

            <div
              style={{
                marginTop: 24,
                padding: 24,
                borderRadius: 18,
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                minHeight: 180,
                fontSize: 24,
                lineHeight: 1.6,
                color: '#f1f5f9',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 500,
              }}
            >
              {displayedText}
              {charsShown < fullTranscript.length && (
                <span
                  style={{
                    display: 'inline-block',
                    width: 3,
                    height: 24,
                    backgroundColor: '#38bdf8',
                    marginLeft: 4,
                    verticalAlign: 'middle',
                    boxShadow: '0 0 10px #38bdf8',
                  }}
                />
              )}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 16,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <span style={{ color: '#94a3b8', fontSize: 14 }}>
              Language detected: <strong style={{ color: '#38bdf8' }}>Tagalog / English (99.8% conf)</strong>
            </span>
            <span style={{ color: '#34d399', fontSize: 14, fontWeight: 700 }}>
              ✓ 0 Bytes transmitted to internet
            </span>
          </div>
        </div>
      </div>

      <Subtitles text="Simply record a patient visit summary, and OfflineDoc transforms speech into text using on-device speech recognition." />
    </div>
  );
};