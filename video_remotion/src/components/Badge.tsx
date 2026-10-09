import React from 'react';

export const Badge: React.FC<{
  label: string;
  dotColor?: string;
  textColor?: string;
}> = ({ label, dotColor = '#10b981', textColor = '#64748b' }) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 14,
        fontWeight: 800,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: textColor,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: dotColor,
        }}
      />
      <span>{label}</span>
    </div>
  );
};