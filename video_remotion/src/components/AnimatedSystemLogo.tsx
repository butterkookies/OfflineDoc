import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, staticFile } from 'remotion';

interface AnimatedSystemLogoProps {
  size?: number;
  showText?: boolean;
  slogan?: string;
  delay?: number;
  layout?: 'horizontal' | 'vertical';
}

export const AnimatedSystemLogo: React.FC<AnimatedSystemLogoProps> = ({
  size = 180,
  showText = true,
  slogan = 'LOCAL INTELLIGENCE FOR BETTER DOCUMENTATION, ANYWHERE.',
  delay = 0,
  layout = 'horizontal',
}) => {
  const rawFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = Math.max(0, rawFrame - delay);

  // 1. Icon Container Spring (Scale & Fade)
  const iconSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.8 },
  });

  // 2. Concentric Outer Circle Draw Animation (Centered & Aligned like D:\animation.mp4)
  const ringProgress = interpolate(frame, [4, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 3. Text Slide & Reveal
  const textSlide = spring({
    frame: frame - 14,
    fps,
    config: { damping: 16, stiffness: 90 },
  });
  const textOpacity = interpolate(frame, [14, 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 4. Blue Underline Bar Width Animation (draws left to right like D:\animation.mp4)
  const lineProgress = interpolate(frame, [20, 44], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 5. Slogan Fade & Rise
  const sloganOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sloganY = interpolate(frame, [30, 50], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Outer ring radius & circumference
  const ringRadius = size * 0.54;
  const ringCircumference = 2 * Math.PI * ringRadius;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: layout === 'vertical' ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: layout === 'vertical' ? 24 : 36,
      }}
    >
      {/* --- LOGO ICON CONTAINER --- */}
      <div
        style={{
          width: size,
          height: size,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${iconSpring})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Squircle Card Container for Official System Logo Icon */}
        <div
          style={{
            width: size,
            height: size,
            borderRadius: size * 0.24,
            backgroundColor: '#ffffff',
            boxShadow: '0 20px 45px rgba(37, 99, 235, 0.14), 0 4px 14px rgba(15, 23, 42, 0.06)',
            border: '1.5px solid rgba(219, 234, 254, 0.9)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <img
            src={staticFile('logo_icon_perfect.png')}
            alt="OfflineDoc Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      </div>

      {/* --- TYPOGRAPHY & SLOGAN LOCKUP --- */}
      {showText && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: layout === 'vertical' ? 'center' : 'flex-start',
            opacity: textOpacity,
            transform: `translateX(${layout === 'horizontal' ? (1 - textSlide) * -30 : 0}px)`,
          }}
        >
          {/* Main Title: OfflineDoc */}
          <h1
            style={{
              fontSize: size * 0.58,
              fontWeight: 900,
              margin: 0,
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              letterSpacing: '-0.035em',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'baseline',
            }}
          >
            <span style={{ color: '#0F172A' }}>Offline</span>
            <span style={{ color: '#2563EB', marginLeft: '0.04em' }}>Doc</span>
          </h1>

          {/* Dynamic Expanding Underline Bar (Like D:\animation.mp4) */}
          <div
            style={{
              width: `${lineProgress * 100}%`,
              maxWidth: size * 2.6,
              height: 4,
              backgroundColor: '#2563EB',
              borderRadius: 2,
              marginTop: 14,
              marginBottom: 12,
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
            }}
          />

          {/* Tracked Slogan (Like D:\animation.mp4) */}
          {slogan && (
            <p
              style={{
                fontSize: Math.max(13, Math.round(size * 0.11)),
                fontWeight: 700,
                color: '#64748B',
                margin: 0,
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                opacity: sloganOpacity,
                transform: `translateY(${sloganY}px)`,
              }}
            >
              {slogan}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
