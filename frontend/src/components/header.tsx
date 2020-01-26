import React from 'react';
import { Logo } from './svg-icons/svg-icons';
import { Link } from 'react-router-dom';

const Header : React.FC = (props) => {
  return (
    <header className="header">
      <div className="header__content">
        <div className="header__logo">
          <Link to="/"><Logo /></Link>
        </div>
        
        <div className="header__title">
          <h1>talent book</h1>
        </div>
        <nav className="header__menu">
          {props.children}
        </nav>
      </div>
    </header>
  );
}

export default Header;