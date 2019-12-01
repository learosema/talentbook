import React, { Dispatch, SetStateAction } from 'react';
import logo from '../assets/logo.svg';
import { LoginIcon } from './svg-icons';

type HeaderProps = {
  loginVisible: boolean;
  setLoginVisible: Dispatch<SetStateAction<boolean>>;
}

const Header : React.FC<HeaderProps> = ({loginVisible, setLoginVisible}) => {
  const toggleLoginForm = (e: React.MouseEvent) => {
    setLoginVisible(! loginVisible); 
  };
  return (
    <header className="header">
      <div className="header__content">
        <img src={logo} className="header__logo" alt="logo" />
        <div className="header__title">
          <h1>talent book</h1>
        </div>
        <nav className="header__menu">
          <button onClick={toggleLoginForm} title="login or sign up">
            <LoginIcon />
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;