import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { Badge } from '../components/Badge';

export const Scene1Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const stackSpring = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 100 } });
  const clockSpring = spring({ frame: frame - 20, fps, config: { damping: 14, stiffness: 100 } });

  const clockHandRotation = interpolate(frame, [0, 120], [45, 405]);
  const formsProgress = interpolate(frame, [0, 80], [0, 50], { extrapolateRight: 'clamp' });

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
        <Badge label="THE PAPERWORK PILE" dotColor="#10b981" textColor="#64748b" />
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
          <span style={{ color: '#0f172a' }}>DOCUMENTING PAPERS </span>
          <span style={{ color: '#2563eb' }}>TAKES TIME.</span>
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
          For health workers, every visit means another record to write.
        </p>
      </div>

      {/* Left Column: One page becomes a pile */}
      <div
        style={{
          position: 'absolute',
          top: 420,
          left: 140,
          width: 380,
          opacity: titleSpring,
        }}
      >
        <h2
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: '#0f172a',
            margin: 0,
            fontFamily: 'Inter, system-ui, sans-serif',
            lineHeight: 1.15,
          }}
        >
          One page becomes a pile.
        </h2>
        <p
          style={{
            fontSize: 20,
            color: '#2563eb',
            margin: '16px 0 0 0',
            fontWeight: 600,
            lineHeight: 1.4,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          And every page asks for your attention.
        </p>

        {/* Forms completed progress bar */}
        <div style={{ marginTop: 48 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13,
              fontWeight: 800,
              color: '#64748b',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            <span>FORMS COMPLETED</span>
            <span>4 / 8</span>
          </div>
          <div
            style={{
              width: 340,
              height: 10,
              backgroundColor: '#e2e8f0',
              borderRadius: 999,
              marginTop: 10,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${formsProgress}%`,
                height: '100%',
                background: 'linear-gradient(to right, #2563eb, #10b981)',
                borderRadius: 999,
              }}
            />
          </div>
        </div>
      </div>

      {/* Center: Stack of Paper Forms */}
      <div
        style={{
          position: 'absolute',
          top: 300,
          left: 720,
          width: 500,
          height: 520,
          transform: `translateY(${(1 - stackSpring) * 30}px)`,
          opacity: stackSpring,
        }}
      >
        {[
          { label: 'FORM 01 DOCUMENT DETAILS', top: 0, left: 0 },
          { label: 'FORM 02 DOCUMENT DETAILS', top: 35, left: 15 },
          { label: 'FORM 03 DOCUMENT DETAILS', top: 70, left: 30 },
          { label: 'FORM 04 DOCUMENT DETAILS', top: 105, left: 45 },
          { label: 'FORM 05 DOCUMENT DETAILS', top: 140, left: 60 },
          { label: 'FORM 06 DOCUMENT DETAILS', top: 190, left: 80, isFront: true },
        ].map((form, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: form.top,
              left: form.left,
              width: 440,
              height: 260,
              backgroundColor: '#ffffff',
              borderRadius: 20,
              border: '1px solid #cbd5e1',
              boxShadow: '0 16px 36px rgba(15, 23, 42, 0.08)',
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              zIndex: i,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: form.isFront ? '#2563eb' : '#475569',
                letterSpacing: '0.08em',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              {form.label}
            </div>
            {/* Mock text lines */}
            <div
              style={{
                marginTop: 30,
                height: 8,
                width: '80%',
                backgroundColor: '#e2e8f0',
                borderRadius: 4,
              }}
            />
            <div
              style={{
                marginTop: 14,
                height: 8,
                width: '65%',
                backgroundColor: '#e2e8f0',
                borderRadius: 4,
              }}
            />
            <div
              style={{
                marginTop: 14,
                height: 8,
                width: '90%',
                backgroundColor: '#e2e8f0',
                borderRadius: 4,
              }}
            />
          </div>
        ))}
      </div>

      {/* Right Column: Analog Clock */}
      <div
        style={{
          position: 'absolute',
          top: 350,
          right: 180,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `translateY(${(1 - clockSpring) * 20}px)`,
          opacity: clockSpring,
        }}
      >
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: '8px solid #f1f5f9',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Clock hour markers */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <div
              key={deg}
              style={{
                position: 'absolute',
                width: 2,
                height: deg % 90 === 0 ? 10 : 6,
                backgroundColor: '#94a3b8',
                top: 10,
                left: 101,
                transformOrigin: 'bottom center',
                transform: `rotate(${deg}deg) translateY(-85px)`,
              }}
            />
          ))}

          {/* Minute hand (blue) */}
          <div
            style={{
              position: 'absolute',
              width: 4,
              height: 65,
              backgroundColor: '#2563eb',
              top: 45,
              borderRadius: 3,
              transformOrigin: 'bottom center',
              transform: `rotate(${clockHandRotation}deg)`,
            }}
          />

          {/* Hour hand (navy) */}
          <div
            style={{
              position: 'absolute',
              width: 5,
              height: 45,
              backgroundColor: '#0f172a',
              top: 65,
              borderRadius: 3,
              transformOrigin: 'bottom center',
              transform: `rotate(${clockHandRotation * 0.15 + 90}deg)`,
            }}
          />

          {/* Center teal pivot */}
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: '#10b981',
              zIndex: 10,
              boxShadow: '0 0 6px rgba(16, 185, 129, 0.5)',
            }}
          />
        </div>

        <span
          style={{
            marginTop: 24,
            fontSize: 14,
            fontWeight: 800,
            color: '#64748b',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          TIME KEEPS MOVING
        </span>
      </div>

      <Subtitles text="For health workers, documenting every patient visit takes time." />
    </div>
  );
};