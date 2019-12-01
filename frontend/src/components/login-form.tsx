import React, { Dispatch, SetStateAction, useRef, useEffect } from 'react';
import { CloseIcon } from './svg-icons';

type LoginFormProps = {
  loginVisible: boolean;
  setLoginVisible: Dispatch<SetStateAction<boolean>>;
}

const LoginForm : React.FC<LoginFormProps> = ({loginVisible, setLoginVisible }) => {
  const close = () => {
    setLoginVisible(false);
  }
  const usernameInput = useRef<HTMLInputElement|null>(null);
  const passwordInput = useRef<HTMLInputElement|null>(null);
  const layer = useRef<HTMLDivElement|null>(null);

  const keyUpHandler = (ev: React.KeyboardEvent) => {
    if (loginVisible && ev.keyCode === 27) {
      close();
    }
  };

  useEffect(() => {
    console.log('loginVisible changed :)');
    if (loginVisible && usernameInput.current !== null) {
      usernameInput.current.focus();
    }
  }, [loginVisible]);


  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    close();
  }
  

  return (
    <div ref={layer} onKeyUp={keyUpHandler} 
      className={['login', loginVisible ? '' : 'login--hidden'].join(' ')} 
      onClick={e => {if (e.target === layer.current) close()}}>
      
      <form className="login__form" onSubmit={submitHandler}>
        <button type="button" className="login__close-button" onClick={e => close()}>
          <CloseIcon />
        </button>  
        <nav className="login__nav">
          <ul className="login__nav-list">
            <li className="login__nav-list-item"><button type="button" className="active">Login</button></li>
            <li className="login__nav-list-item"><button type="button">Sign Up</button></li>
          </ul>
        </nav>
        <div className="login__field">
          <label className="login__label" htmlFor="loginUsername">Username</label>
          <input id="loginUsername" ref={usernameInput} className="login__input" required />
        </div>
        <div className="login__field">
          <label className="login__label" htmlFor="loginPassword">Password</label>
          <input type="password" id="loginPassword" ref={passwordInput} className="login__input--password" required />
        </div>
        <div className="login__field">
          <button className="login__submit"> login </button>
        </div>
      </form> 
    </div>
  );
};
  
export default LoginForm;