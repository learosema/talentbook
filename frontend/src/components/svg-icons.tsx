import React from 'react';

type SvgIconProps = {
  width ?: number;
  height ?: number;
  alt ?: string;
}


export const UserIcon: React.FC<SvgIconProps> = ({width = 64, height = 64, alt = 'My profile' }) => (
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
);

export const Logo: React.FC<SvgIconProps> = ({width = 64, height = 64, alt = 'talent book' }) => (
  <svg viewBox={[0, 0, width, height].join(' ')} width={width} height={height}>
    <title>{alt}</title>
    <defs>
      <symbol id="svgUserIcon" viewBox="0 0 64 64" width="64" height="64">
      <g>
        <circle cx="32" cy="20" r="12" />
        <path d="M8,60 c0,-32 48,-32 48,0Z" />
      </g>
      </symbol>
    </defs>
    <use xlinkHref="#svgUserIcon" x="0" y="0" width="32" height="32" fill="red" strokeWidth="4"></use>
    <use xlinkHref="#svgUserIcon" x="32" y="0" width="32" height="32" fill="deeppink" strokeWidth="4"></use>
    <use xlinkHref="#svgUserIcon" x="0" y="32" width="32" height="32" fill="rebeccapurple" strokeWidth="4"></use>
    <use xlinkHref="#svgUserIcon" x="32" y="32" width="32" height="32" fill="hotpink" strokeWidth="4"></use>  
  </svg>
);

export const SkillIcon: React.FC<SvgIconProps> = ({width= 64, height = 64, alt = 'skills' }) => (
  <svg className="skill-icon" viewBox="0 0 64 64" width="128" height="128">
    <title>{alt}</title>
    <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none">
      <path d="M40,28 l12,0 l-24,32 l0,-24 l-12,0 l24,-32Z" />
    </g>
  </svg>
);
