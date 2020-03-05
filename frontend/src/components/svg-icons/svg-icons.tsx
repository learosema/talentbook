import React, { SetStateAction, Dispatch } from 'react';

import './svg-icons.scss';

type SvgIconProps = {
  width?: number;
  height?: number;
  alt?: string;
};

type DarkModeIconProps = {
  width?: number;
  height?: number;
  alt?: string;
  darkMode?: boolean;
};

export const UserIcon: React.FC<SvgIconProps> = ({
  width = 64,
  height = 64,
  alt = 'My profile'
}) => (
  <svg viewBox="0 0 64 64" width={width} height={height}>
    <title>{alt}</title>
    <desc>{alt}</desc>
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="32" cy="20" r="12" />
      <path d="M8,60 c0,-32 48,-32 48,0Z" />
    </g>
  </svg>
);

export const CloseIcon: React.FC<SvgIconProps> = ({
  width = 64,
  height = 64,
  alt = 'Close '
}) => (
  <svg viewBox={[0, 0, width, height].join(' ')} width={width} height={height}>
    <title>{alt}</title>
    <desc>{alt}</desc>
    <g fill="none" stroke="currentColor" strokeWidth="4">
      <path d="M4,4 l56,56 m0,-56 l-56,56" />
    </g>
  </svg>
);

export const Logo: React.FC<SvgIconProps> = ({
  width = 64,
  height = 64,
  alt = 'talent book'
}) => (
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
    <use
      xlinkHref="#svgUserIcon"
      x="0"
      y="0"
      width="32"
      height="32"
      fill="red"
      strokeWidth="4"
    ></use>
    <use
      xlinkHref="#svgUserIcon"
      x="32"
      y="0"
      width="32"
      height="32"
      fill="deeppink"
      strokeWidth="4"
    ></use>
    <use
      xlinkHref="#svgUserIcon"
      x="0"
      y="32"
      width="32"
      height="32"
      fill="rebeccapurple"
      strokeWidth="4"
    ></use>
    <use
      xlinkHref="#svgUserIcon"
      x="32"
      y="32"
      width="32"
      height="32"
      fill="hotpink"
      strokeWidth="4"
    ></use>
  </svg>
);

export const SkillIcon: React.FC<SvgIconProps> = ({
  width = 64,
  height = 64,
  alt = 'skills'
}) => (
  <svg className="skill-icon" viewBox="0 0 64 64" width={width} height={height}>
    <title>{alt}</title>
    <g
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      fill="none"
    >
      <path d="M40,28 l12,0 l-24,32 l0,-24 l-12,0 l24,-32Z" />
    </g>
  </svg>
);

export const HomeIcon: React.FC<SvgIconProps> = ({
  width = 32,
  height = 32,
  alt = 'Location'
}) => (
  <svg viewBox={[0, 0, width, height].join(' ')} width={width} height={height}>
    <title>{alt}</title>
    <path
      strokeWidth={2}
      stroke="currentColor"
      fill="none"
      strokeLinejoin="round"
      d="M 3.5 29 l0 -15 l 12.5 -12.5 l 12.5 12.5 l 0 15Z"
    />
  </svg>
);

export const DarkmodeIcon: React.FC<DarkModeIconProps> = ({
  width = 64,
  height = 64,
  alt = 'toggle dark mode',
  darkMode = true
}) => (
  <svg
    className={'darkmode-icon' + (darkMode ? ' dark' : '')}
    viewBox="0 0 64 64"
    width="64"
    height="64"
  >
    <clipPath id="sun">
      <circle cx="32" cy="32" r="12" />
    </clipPath>
    <circle className="sun" cx="32" cy="32" r="12" />
    <circle
      className="moon-shadow"
      cx={darkMode ? 40 : 60}
      cy="32"
      r="12"
      clipPath="url(#sun)"
    />
    <circle className="sun-stroke" cx="32" cy="32" r="12" />
    <g className="rays">
      <path d="M32 4 L32 16" />
      <path d="M51.79898987322333 12.20101012677667 L43.31370849898476 20.68629150101524" />
      <path d="M60 32 L48 32" />
      <path d="M51.798989873223334 51.79898987322333 L43.31370849898476 43.31370849898476" />
      <path d="M32 60 L32 48" />
      <path d="M12.201010126776673 51.798989873223334 L20.68629150101524 43.31370849898477" />
      <path d="M4 32.00000000000001 L16 32" />
      <path d="M12.201010126776666 12.201010126776673 L20.686291501015237 20.68629150101524" />
    </g>
  </svg>
);
