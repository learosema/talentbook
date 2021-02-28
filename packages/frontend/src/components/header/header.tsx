import React from 'react';
import { Link } from 'react-router-dom';
import { MenuItem, NavMenu } from '../nav-menu';

import {
  CogIcon,
  DarkmodeIcon,
  Logo,
  SkillIcon,
  TeamIcon,
  UserIcon,
} from '../svg-icons/svg-icons';
import './header.scss';

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
            <DarkmodeIcon darkMode={darkMode} />
            <span>Theme</span>
          </MenuItem>
          <MenuItem to="/teams">
            <TeamIcon />
            <span>Teams</span>
          </MenuItem>
          <MenuItem to="/skill-details">
            <SkillIcon />
            <span>Skills</span>
          </MenuItem>
          <MenuItem to="/my-skills">
            <CogIcon />
            <span>My Skills</span>
          </MenuItem>
          <MenuItem to="/my-profile">
            <UserIcon />
            <span>My Profile</span>
          </MenuItem>
        </NavMenu>
      </div>
    </header>
  );
};
