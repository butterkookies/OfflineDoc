import React from 'react';
import { useCurrentFrame, spring, interpolate, useVideoConfig } from 'remotion';
import { GridBackground } from '../components/GridBackground';
import { Subtitles } from '../components/Subtitles';
import { Badge } from '../components/Badge';
import { AnimatedSystemLogo } from '../components/AnimatedSystemLogo';

export const Scene3Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Logo Reveal Entrance (Frames 0 to ~65)
  // Voice: "Meet OfflineDoc,"
  const logoOpacity = interpolate(frame, [52, 68], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const logoScale = interpolate(frame, [52, 68], [1, 0.95], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const logoBadgeSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });

  // Phase 2: Proceed to Features Transition (Frames 60 to 240)
  // Voice: "...a local AI documentation assistant designed to work directly on your device, even without an internet connection."
  const featuresSpring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const featuresOpacity = interpolate(frame, [60, 72], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#f5f7fb' }}>
      <GridBackground />

      {/* =========================================================================
          STAGE 1: "MEET OFFLINEDOC" LOGO REVEAL (Frames 0 - 68)
          ========================================================================= */}
      {frame < 72 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1920,
            height: 1080,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            zIndex: 10,
            pointerEvents: frame < 65 ? 'auto' : 'none',
          }}
        >
          {/* Top Intro Badge */}
          <div
            style={{
              marginBottom: 36,
              transform: `translateY(${(1 - logoBadgeSpring) * 16}px)`,
              opacity: logoBadgeSpring,
            }}
          >
            <Badge label="INTRODUCING OFFLINEDOC • 100% AIR-GAPPED CLINICAL AI" dotColor="#2563eb" textColor="#2563eb" />
          </div>

          {/* Majestic Animated System Logo */}
          <AnimatedSystemLogo
            size={220}
            showText={true}
            slogan="LOCAL INTELLIGENCE FOR BETTER DOCUMENTATION, ANYWHERE."
            delay={2}
            layout="horizontal"
          />

          {/* Three Feature Highlights Underneath */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginTop: 48,
              opacity: interpolate(frame, [20, 36], [0, 1], { extrapolateRight: 'clamp' }),
              transform: `translateY(${interpolate(frame, [20, 36], [14, 0], { extrapolateRight: 'clamp' })}px)`,
            }}
          >
            <div
              style={{
                padding: '10px 22px',
                backgroundColor: '#EFF6FF',
                borderRadius: 30,
                border: '1px solid #BFDBFE',
                fontSize: 14,
                fontWeight: 800,
                color: '#1E40AF',
                letterSpacing: '0.04em',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              100% AIR-GAPPED & LOCAL
            </div>
            <div
              style={{
                padding: '10px 22px',
                backgroundColor: '#F0FDF4',
                borderRadius: 30,
                border: '1px solid #BBF7D0',
                fontSize: 14,
                fontWeight: 800,
                color: '#166534',
                letterSpacing: '0.04em',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              FAST ON-DEVICE CPU INFERENCE
            </div>
            <div
              style={{
                padding: '10px 22px',
                backgroundColor: '#FAF5FF',
                borderRadius: 30,
                border: '1px solid #E9D5FF',
                fontSize: 14,
                fontWeight: 800,
                color: '#6B21A8',
                letterSpacing: '0.04em',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              NO INTERNET REQUIRED
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STAGE 2: PROCEED TO FEATURES (PWA BROWSER & ARCHITECTURE) (Frames 60 - 240)
          ========================================================================= */}
      {frame >= 56 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1920,
            height: 1080,
            opacity: featuresOpacity,
            transform: `translateY(${(1 - featuresSpring) * 20}px)`,
            zIndex: 5,
          }}
        >
          {/* Header section */}
          <div
            style={{
              position: 'absolute',
              top: 70,
              left: 100,
              right: 100,
            }}
          >
            <Badge label="MEET OFFLINEDOC • 100% AIR-GAPPED SYSTEM DESIGN" dotColor="#2563eb" textColor="#2563eb" />
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
              LOCAL AI. DIRECTLY ON YOUR DEVICE.
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
              Designed to work entirely on local hardware with zero cloud calls and zero internet required.
            </p>
          </div>

          {/* Main Content: Real PWA Browser View (Left) & Architecture Spec (Right) */}
          <div
            style={{
              position: 'absolute',
              top: 220,
              left: 100,
              right: 100,
              display: 'grid',
              gridTemplateColumns: '1.45fr 1fr',
              gap: 36,
            }}
          >
            {/* Left: Real OfflineDoc BHW Station PWA Browser Window */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 24,
                border: '1px solid #cbd5e1',
                boxShadow: '0 25px 50px rgba(15, 23, 42, 0.08)',
                overflow: 'hidden',
                height: 670,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Browser Window Header Chrome */}
              <div
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#f1f5f9',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                {/* Traffic Light Dots */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#ef4444' }} />
                  <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                  <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#10b981' }} />
                </div>

                {/* Address Bar */}
                <div
                  style={{
                    flex: 1,
                    backgroundColor: '#ffffff',
                    borderRadius: 8,
                    padding: '6px 14px',
                    fontSize: 13,
                    fontFamily: 'monospace',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ color: '#10b981' }}>🔒</span>
                  <span>http://127.0.0.1:8000 — 100% Air-Gapped Local Station</span>
                </div>
              </div>

              {/* Inner PWA App Shell Content */}
              <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* App Header Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: '#ffffff',
                        border: '1px solid #bfdbfe',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(37, 99, 235, 0.1)',
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 200 200" fill="none">
                        <path
                          d="M 68 45 L 118 45 L 142 69 L 142 145 C 142 151 137 155 131 155 L 68 155 C 62 155 58 151 58 145 L 58 55 C 58 49 62 45 68 45 Z"
                          fill="#FFFFFF"
                          stroke="#2563EB"
                          strokeWidth="8"
                        />
                        <path d="M 118 45 L 118 69 L 142 69 Z" fill="#2563EB" />
                        <rect x="75" y="123" width="30" height="10" rx="5" fill="#2563EB" />
                        <rect x="85" y="113" width="10" height="30" rx="5" fill="#2563EB" />
                        <circle cx="144" cy="136" r="20" fill="#2563EB" />
                        <line x1="134" y1="146" x2="154" y2="126" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
                        Barangay Health Worker <span style={{ color: '#2563eb' }}>✓</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', fontFamily: 'Inter, sans-serif' }}>
                        Barangay Health Station
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <span
                      style={{
                        padding: '5px 12px',
                        borderRadius: 20,
                        backgroundColor: '#f1f5f9',
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#475569',
                      }}
                    >
                      Pair Mobile
                    </span>
                    <span
                      style={{
                        padding: '5px 12px',
                        borderRadius: 20,
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        fontSize: 12,
                        fontWeight: 800,
                        color: '#166534',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#16a34a' }} />
                      100% OFFLINE STATION
                    </span>
                  </div>
                </div>

                {/* Greeting & Filter Pills */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
                    HI BHW, nice to see you!
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['All 4', "Today's visits 9", 'Maternal', 'Hypertension', 'Child/EPI', 'General'].map((pill, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 14,
                          fontSize: 11,
                          fontWeight: 700,
                          backgroundColor: i === 1 ? '#2563eb' : '#f8fafc',
                          color: i === 1 ? '#ffffff' : '#64748b',
                          border: i === 1 ? 'none' : '1px solid #e2e8f0',
                        }}
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Main Stage: Left Intake CTA + Right Patient Directory Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 16, flex: 1 }}>
                  {/* Left Column: Intake Studio & Station Metadata */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {/* Voice Intake Card */}
                    <div
                      style={{
                        padding: 18,
                        borderRadius: 16,
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        color: '#ffffff',
                        boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.9 }}>
                        <span>Field Intake</span>
                        <span>05:32 • Offline AI</span>
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 900, marginTop: 8 }}>Voice Clinical Intake Studio</div>
                      <div
                        style={{
                          marginTop: 12,
                          padding: '8px 12px',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: 10,
                          fontSize: 12,
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <span>🎙️</span>
                        <span>Tap to record encounter &gt;&gt;&gt;</span>
                      </div>
                    </div>

                    {/* Station Status Box */}
                    <div
                      style={{
                        padding: 14,
                        backgroundColor: '#f8fafc',
                        borderRadius: 14,
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        fontSize: 11,
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      <div style={{ color: '#16a34a', fontWeight: 800 }}>● 100% AIR-GAPPED STATION</div>
                      <div style={{ color: '#475569' }}>STT AUDIO ENGINE: <strong style={{ color: '#0f172a' }}>Faster-Whisper (INT8)</strong></div>
                      <div style={{ color: '#475569' }}>CLINICAL INTELLIGENCE: <strong style={{ color: '#0f172a' }}>Llama 3.2 1B (Edge)</strong></div>
                      <div style={{ color: '#475569' }}>OFFICIAL DOCUMENT: <strong style={{ color: '#0f172a' }}>DOH ITR & TCL Form</strong></div>
                      <div style={{ color: '#475569' }}>STATUTORY ALIGNMENT: <strong style={{ color: '#0f172a' }}>RA 7883 / RA 10173</strong></div>
                    </div>
                  </div>

                  {/* Right Column: 4 Real Community Cohorts Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      {
                        name: 'Maria Santos (28, F)',
                        purok: 'Purok 2 • ID: P-001',
                        cohort: 'Maternal Care',
                        note: 'G2P1 32 weeks pregnant. BP 120/80 normal. Adherent to iron.',
                        action: '+ Record Visit',
                      },
                      {
                        name: 'Teresa Ramos (54, F)',
                        purok: 'Purok 4 • ID: P-002',
                        cohort: 'Hypertension/Diabetes',
                        note: 'Stage 2 HTN. Occipital headache. BP spikes to 150/95 mmHg.',
                        action: '+ Record Visit',
                      },
                      {
                        name: 'Juan Dela Cruz (62, M)',
                        purok: 'Purok 1 • ID: P-003',
                        cohort: 'General Consultation',
                        note: 'Productive cough x 5 days, afebrile (36.8 C), BP 130/85.',
                        action: '+ Record Visit',
                      },
                      {
                        name: 'Baby Joshua (1, M)',
                        purok: 'Purok 3 • ID: P-004',
                        cohort: 'Child Immunization',
                        note: 'Infant 9mo. Completed BCG, HepB, Pentavalent 1-3. Scheduled MR.',
                        action: '+ Record Visit',
                      },
                    ].map((p, i) => (
                      <div
                        key={i}
                        style={{
                          padding: 12,
                          backgroundColor: '#ffffff',
                          borderRadius: 12,
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{p.name}</div>
                          <div style={{ fontSize: 10, color: '#64748b' }}>{p.purok}</div>
                          <span
                            style={{
                              display: 'inline-block',
                              marginTop: 4,
                              padding: '2px 6px',
                              backgroundColor: '#f1f5f9',
                              borderRadius: 4,
                              fontSize: 10,
                              fontWeight: 700,
                              color: '#0284c7',
                            }}
                          >
                            {p.cohort}
                          </span>
                          <div style={{ fontSize: 10, color: '#475569', marginTop: 4, lineHeight: 1.3 }}>
                            {p.note}
                          </div>
                        </div>
                        <div
                          style={{
                            marginTop: 6,
                            padding: '4px',
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            borderRadius: 6,
                            textAlign: 'center',
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                        >
                          {p.action}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Air-Gapped System Architecture Breakdown */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 24,
                border: '1px solid #e2e8f0',
                boxShadow: '0 20px 45px rgba(15, 23, 42, 0.06)',
                padding: '36px 40px',
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
                    color: '#0284c7',
                    letterSpacing: '0.06em',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    textTransform: 'uppercase',
                  }}
                >
                  AIR-GAPPED SYSTEM ARCHITECTURE
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
                  Every component runs on standard x86_64 or mobile CPU.
                </div>

                {/* 4 Architecture Pillars */}
                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    {
                      accent: '#2563eb',
                      title: 'STT ENGINE: Faster-Whisper (INT8)',
                      desc: 'Conditions on Taglish BHW clinical vocabulary. Transcribes 20-45s audio in ~2.1s.',
                    },
                    {
                      accent: '#10b981',
                      title: 'LLM ENGINE: Llama 3.2 1B Instruct (Edge)',
                      desc: "Strict 'Null-Not-Guess' entity extraction into DOH Target Client List format in ~0.79s.",
                    },
                    {
                      accent: '#06b6d4',
                      title: 'DOCUMENT ENGINE: Instant DOH ITR PDF',
                      desc: 'Compiles single-page Individual Treatment Record encounter slips with dual signatures.',
                    },
                    {
                      accent: '#8b5cf6',
                      title: 'STATUTORY SECURITY: RA 7883 & RA 10173',
                      desc: 'Zero external network calls. 100% patient data residency on barangay hardware.',
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '16px 20px',
                        backgroundColor: '#f8fafc',
                        borderRadius: 14,
                        border: '1px solid #e2e8f0',
                        borderLeft: `5px solid ${item.accent}`,
                      }}
                    >
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 13, color: '#64748b', marginTop: 4, fontFamily: 'Inter, sans-serif', lineHeight: 1.35 }}>
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  padding: '14px 18px',
                  backgroundColor: '#eff6ff',
                  borderRadius: 12,
                  border: '1px solid #bfdbfe',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#1d4ed8',
                  fontFamily: 'Inter, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span>🛡️</span>
                <span>Sub-4.0s turnaround • ₱0.00 cloud cost • 100% on-device residency</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Subtitles text="Meet OfflineDoc, a local AI documentation assistant designed to work directly on your device, even without an internet connection." />
    </div>
  );
};