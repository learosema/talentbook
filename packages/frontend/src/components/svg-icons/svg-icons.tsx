import React from 'react';

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
  alt = 'My profile',
}) => {
  return <svg role="img" className="icon" viewBox="0 0 64 64" width={width} height={height} aria-hidden={alt ? undefined : 'true'} aria-label={alt || undefined}>
    <g fill="none" stroke="currentColor">
      <circle cx="32" cy="20" r="12" />
      <path d="M8,60 c0,-32 48,-32 48,0Z" />
    </g>
  </svg>
};

export const CloseIcon: React.FC<SvgIconProps> = ({
  width = 64,
  height = 64,
  alt = 'Close',
}) => (
  <svg className="icon" viewBox="0 0 64 64" width={width} height={height} aria-hidden={alt ? undefined : 'true'} aria-label={alt || undefined}>
    <g fill="none" stroke="currentColor" strokeWidth="4">
      <path d="M4,4 l56,56 m0,-56 l-56,56" />
    </g>
  </svg>
);

export const Logo: React.FC<SvgIconProps> = ({
  width = 64,
  height = 64,
  alt = 'talent book',
}) => (
  <svg className="icon" viewBox="0 0 64 64" width={width} height={height} aria-hidden={alt ? undefined : 'true'} aria-label={alt || undefined}>
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
  alt = 'skills',
}) => (
<svg className="icon" viewBox="0 0 72 72" width={width} height={height} aria-hidden={alt ? undefined : 'true'} aria-label={alt || undefined}>
  <g id="line" stroke="currentColor" fill="none">
    <path strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="m52.55 23.75c0 3.985-1.785 5.908-3.754 10.5-0.5028 1.172-4.211 13.38-4.211 13.38h-17.17s-2.981-11.67-3.546-12.62c-2.37-3.998-4.419-6.91-4.419-11.26 0-9.141 7.41-16.55 16.55-16.55 9.141 0 16.55 7.41 16.55 16.55z"/>
    <line x1="36" x2="36" y1="47.22" y2="35.28" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/>
    <line x1="41.97" x2="30.03" y1="35.28" y2="35.28" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.696" d="m44.16 58.79c0 3.24-3.651 5.867-8.155 5.867-4.504 0-8.155-2.627-8.155-5.867z"/>
    <line x1="27.99" x2="44.01" y1="54.98" y2="51.51" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.965"/>
    <line x1="38.2" x2="43.98" y1="56.07" y2="54.89" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/>
    <line x1="28.02" x2="33.8" y1="51.6" y2="50.42" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/>
  </g>
</svg>
)

export const HomeIcon: React.FC<SvgIconProps> = ({
  width = 32,
  height = 32,
  alt = 'Location',
}) => (
  <svg className="icon" viewBox={[0, 0, width, height].join(' ')} width={width} height={height} aria-hidden={alt ? undefined : 'true'} aria-label={alt || undefined}>
    <title>{alt}</title>
    <path
      stroke="currentColor"
      fill="none"
      strokeLinejoin="round"
      d="M 3.5 29 l0 -15 l 12.5 -12.5 l 12.5 12.5 l 0 15Z"
    />
  </svg>
);

export const TrashcanIcon: React.FC<DarkModeIconProps> = ({
  width = 32,
  height = 32,
  alt = 'Remove',
  darkMode = true,
}) => (
  <svg
    viewBox={[0, 0, width, height].join(' ')}
    width={width}
    height={height}
    className={'trashcan-icon' + (darkMode ? ' dark' : '')}
    aria-hidden={alt ? undefined : 'true'} aria-label={alt || undefined}
  >
    <g stroke="currentColor" fill="none">
      <path d="M6 11l0 14 q0 5 5 5 l 10 0 q5 0 5 -5 l0 -14Z" />
      <path
        className="trashcan-icon__top"
        d="M6 8 q0 -4 4 -4 l4 0  q0 -2 2 -2 q2 0 2 2 l4 0 q4 0 4 4Z"
      />
      <path d="M11 14 l 0 12" strokeLinecap="round" />
      <path d="M16 14 l 0 12" strokeLinecap="round" />
      <path d="M21 14 l 0 12" strokeLinecap="round" />
    </g>
  </svg>
);

export const DarkmodeIcon: React.FC<DarkModeIconProps> = ({
  width = 64,
  height = 64,
  darkMode = true,
  alt,
}) => (
  <svg
    className={'icon darkmode-icon' + (darkMode ? ' dark' : '')}
    viewBox="0 0 64 64"
    width={width}
    height={height}
    aria-hidden={alt ? undefined : 'true'} aria-label={alt || undefined}
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

export const CogIcon: React.FC<SvgIconProps> = ({
  width = 64,
  height = 64,
  alt,
}) => (
  <svg viewBox="0 0 64 64" className="icon cog-icon" width={width} height={height} aria-hidden={alt ? undefined : 'true'} aria-label={alt || undefined}>
    <g fill="none" stroke="currentColor" strokeLinejoin="round">
      <path d="M52 32A20 20 0 0 1 51.02113032590307 38.180339887498945L55.24441214720629 41.20311381711695A25 25 0 0 1 53.108198137550374 45.39566987447492L48.180339887498945 43.75570504584947A20 20 0 0 1 43.75570504584947 48.180339887498945L45.39566987447491 53.108198137550374A25 25 0 0 1 41.20311381711695 55.24441214720628L38.180339887498945 51.02113032590307A20 20 0 0 1 32 52L30.430237011767165 56.95066821070679A25 25 0 0 1 25.782752820878635 56.21457902821578L25.819660112501055 51.02113032590307A20 20 0 0 1 20.24429495415054 48.180339887498945L16.064400256282756 51.262831069394736A25 25 0 0 1 12.737168930605272 47.93559974371725L15.819660112501055 43.75570504584947A20 20 0 0 1 12.97886967409693 38.18033988749895L7.785420971784223 38.21724717912137A25 25 0 0 1 7.049331789293213 33.56976298823284L12 32A20 20 0 0 1 12.978869674096927 25.819660112501055L8.755587852793713 22.79688618288305A25 25 0 0 1 10.891801862449622 18.604330125525088L15.819660112501051 20.24429495415054A20 20 0 0 1 20.244294954150533 15.819660112501055L18.604330125525074 10.89180186244963A25 25 0 0 1 22.796886182883057 8.755587852793713L25.819660112501047 12.97886967409693A20 20 0 0 1 31.999999999999996 12L33.569762988232824 7.049331789293213A25 25 0 0 1 38.21724717912137 7.785420971784223L38.180339887498945 12.978869674096927A20 20 0 0 1 43.75570504584946 15.819660112501047L47.93559974371723 12.737168930605261A25 25 0 0 1 51.262831069394736 16.06440025628276L48.180339887498945 20.244294954150533A20 20 0 0 1 51.02113032590307 25.819660112501047L56.21457902821577 25.782752820878617A25 25 0 0 1 56.95066821070679 30.43023701176717Z" />
      <circle cx="32" cy="32" r="6.666666666666667" />
    </g>
  </svg>
);

export const CompanyIcon: React.FC<SvgIconProps> = ({
  width = 32,
  height = 32,
  alt,
}) => (
  <svg viewBox="0 0 32 32" width={width} height={height} aria-hidden={alt ? undefined : 'true'} aria-label={alt || undefined}>
    <g fill="none" strokeLinejoin="round" stroke="currentColor">
      <path d="M4 31l0 -30 l24 0 l0 30Z" />
      <path d="M8 6 l2 0 l0 2 l-2 0Z M15 6 l2 0 l0 2 l-2 0Z M22 6 l2 0 l0 2 l-2 0Z" />
      <path d="M8 14 l2 0 l0 2 l-2 0Z M15 14 l2 0 l0 2 l-2 0Z M22 14 l2 0 l0 2 l-2 0Z" />

      <path d="M12 22 l8 0 l0 9 l-8 0 Z M16 22 l0 9" />
    </g>
  </svg>
);

export const GlobeIcon: React.FC<SvgIconProps> = ({
  width = 32,
  height = 32,
  alt,
}) => (
  <svg viewBox="-16 -16 32 32" width={width} height={height} aria-hidden={alt ? undefined : 'true'} aria-label={alt || undefined}>
    <g stroke="currentColor" fill="none">
      <circle r="14" />
      <path
        d="M 0 -14 l0 28 
           M 0 -14 q 14 14 0 28 
           M 0 -14 q -14 14 0 28
           M -14 0 l 28 0
           M -13 -6 q 13 -2 26 0
           M -13 6 q 13 2 26 0   
           "
      />
    </g>
  </svg>
);

export const TeamIcon: React.FC<SvgIconProps> = ({
  width = 64,
  height = 64,
  alt,
}) => (
  <svg viewBox="0 0 64 64" width={width} height={height} aria-hidden={alt ? undefined : 'true'} role={alt ? 'img' : undefined} aria-label={alt}>
    <g fill="currentColor" stroke="currentColor">
      <circle cx="32" cy="32" r="25" fill="none" />
      <circle cx="32" cy="7" r="6" />
      <circle cx="53" cy="45.5" r="6" />
      <circle cx="11.5" cy="45.5" r="6" />
    </g>
  </svg>
);

export const LogoutIcon: React.FC<SvgIconProps> = ({
  width = 64,
  height = 64,
  alt,
}) => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 72 72" aria-hidden={alt ? undefined : 'true'} role={alt ? 'img' : undefined} aria-label={alt}>
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10">
      <path d="M29.3333 17C21.5654 19.7553 16 27.1899 16 35.929C16 47.0139 24.9543 56 36 56C47.0457 56 56 47.0139 56 35.929C56 27.1899 50.4346 19.7553 42.6667 17"/>
      <path d="M36 11V36"/>
    </g>
  </svg>
);
