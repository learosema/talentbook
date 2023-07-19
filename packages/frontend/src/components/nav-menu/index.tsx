import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonType, ButtonKind } from '../button/button';
import { useFocusTrap } from '../../hooks/use-focus-trap';


export type MenuItemProps = {
  to?: string;
  onClick?: () => void;
  children?: any;
};

export type NavMenuProps = {
  children ?: React.ReactNode;
};

export const MenuItem: React.FC<MenuItemProps> = ({
  children,
  to,
  onClick,
}) => {
  if (to) {
    return (
      <li>
        <Link to={to}>{children}</Link>
      </li>
    );
  }
  if (onClick) {
    return (
      <li>
        <Button
          type={ButtonType.Button}
          kind={ButtonKind.Unstyled}
          onClick={onClick}
        >
          {children}
        </Button>
      </li>
    );
  }
  return <li>{children}</li>;
};

export const NavMenu: React.FC<NavMenuProps> = ({ children }) => {
  const navMenuRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const layerClick = () => {
    if (menuOpen && window.innerWidth < 768) {
      setMenuOpen(false);
    }
  };
  useFocusTrap(navMenuRef, () => menuOpen && window.innerWidth < 768)
  return (
    <nav className="nav-menu" onClick={layerClick} ref={navMenuRef}>
      <button
        type="button"
        className="burger"
        aria-expanded={menuOpen}
        aria-label="Toggle navigation"
        aria-controls="top-nav"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div className="burger__icon" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      <ul className="nav-menu__container">
        {children}
      </ul>
    </nav>
  );
};
