import React from 'react';

type SvgIconProps = {
  width ?: number;
  height ?: number;
  alt ?: string;
}


export const LoginIcon: React.FC<SvgIconProps> = ({width = 64, height = 64, alt = 'Login' }) => (
  <svg viewBox={[0, 0, width, height].join(' ')} width={width} height={height}>
    <title>{alt}</title>
    <desc>{alt}</desc>
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="32" cy="20" r="12" />
      <path d="M8,60 c0,-32 48,-32 48,0Z" />
    </g>
  </svg>
);

export const CloseIcon: React.FC<SvgIconProps> = ({width = 64, height = 64, alt = 'Close '}) => (
  <svg viewBox={[0, 0, width, height].join(' ')} width={width} height={height}>
    <title>{alt}</title>
    <desc>{alt}</desc>
    <g fill="none" stroke="currentColor" strokeWidth="4">
      <path d="M4,4 l56,56 m0,-56 l-56,56" />
    </g>
  </svg>
)