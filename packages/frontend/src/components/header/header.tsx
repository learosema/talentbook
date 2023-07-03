import React from 'react';
import { Link } from 'react-router-dom';
import { MenuItem, NavMenu } from '../nav-menu';

import {
  CogIcon,
  DarkmodeIcon,
  HomeIcon,
  Logo,
  LogoutIcon,
  SkillIcon,
  UserIcon,
} from '../svg-icons/svg-icons';
import { useIdentity, useTheme } from '../../store/app.context';

export type HeaderProps = {
  toggleDarkMode: () => void;
  darkMode: boolean;
};

export const Header: React.FC = () => {
  const {theme, toggleTheme} = useTheme();
  const identity = useIdentity();

  return (
    <header className="header">
      <div className="header__content wrapper">
        <div className="header__logo">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <div className="header__title">
          <h2>talent book</h2>
        </div>
        <NavMenu>
          <MenuItem onClick={toggleTheme}>
            <DarkmodeIcon darkMode={theme === 'dark'} />
            <span>Theme</span>
          </MenuItem>
          {identity ?
            <>
              <MenuItem to="/">
                <HomeIcon />
                <span>Home</span>
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
              <MenuItem to="/logout">
                <LogoutIcon></LogoutIcon>
                <span>Logout</span>
              </MenuItem>
            </> : <>
              <MenuItem to="/login">
                <UserIcon></UserIcon>
                <span>Login</span>
              </MenuItem>
            </>
          }
        </NavMenu>
      </div>
    </header>
  );
};
