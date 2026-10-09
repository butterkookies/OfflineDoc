import React from 'react';

export const Badge: React.FC<{
  label: string;
  color?: string;
  bgColor?: string;
  icon?: React.ReactNode;
}> = ({ label, color = '#38bdf8', bgColor = 'rgba(14, 165, 233, 0.15)', icon }) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 16px',
        borderRadius: 999,
        background: bgColor,
        border: `1px solid ${color}44`,
        color,
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontFamily: 'Inter, system-ui, sans-serif',
        boxShadow: `0 0 20px ${color}22`,
      }}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};