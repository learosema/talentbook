import React from 'react';
import { Link } from 'react-router-dom';
import { MenuItem, NavMenu } from '../nav-menu';

import {
  CogIcon,
  DarkmodeIcon,
  Logo,
  SkillIcon,
  UserIcon,
} from '../svg-icons/svg-icons';

export type HeaderProps = {
  toggleDarkMode: () => void;
  darkMode: boolean;
};

export const Header: React.FC<HeaderProps> = ({ toggleDarkMode, darkMode }) => {
  return (
    <header className="header">
      <div className="header__content">
        <div className="header__logo">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <div className="header__title">
          <h1>talent book</h1>
        </div>
        <NavMenu>
          <MenuItem onClick={toggleDarkMode}>
            <DarkmodeIcon darkMode={darkMode} alt='' />
            <span>Theme</span>
          </MenuItem>
          <MenuItem to="/skill-details">
            <SkillIcon alt='' />
            <span>Skills</span>
          </MenuItem>
          <MenuItem to="/my-skills">
            <CogIcon alt='' />
            <span>My Skills</span>
          </MenuItem>
          <MenuItem to="/my-profile">
            <UserIcon alt='' />
            <span>My Profile</span>
          </MenuItem>
        </NavMenu>
      </div>
    </header>
  );
};
