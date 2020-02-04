import React, {useState, useEffect, useRef, SetStateAction, Dispatch } from "react";
import { SkillApi, User, Identity } from "../api/skill-api";
import { ValidationErrors } from "./validation-errors";
import { ValidationErrorItem } from "@hapi/joi";
import { ApiException } from "../api/ajax";

type LoginPageProps = {
  identity: Identity|null|undefined;
  setIdentity: Dispatch<SetStateAction<Identity|null|undefined>>;
}
export const LoginPage: React.FC<LoginPageProps> = (props) => {
  const { identity, setIdentity } = props;
  const usernameInput = useRef<HTMLInputElement|null>(null);
  const passwordInput = useRef<HTMLInputElement|null>(null);
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [signup, setSignup] = useState(false);
  const [apiError, setApiError] = useState<string|null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrorItem[]>([]);
  
  useEffect(() => {
    if (usernameInput.current !== null) {
      usernameInput.current.focus();
    }
  }, []);

  const submitHandler = async (e: React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (signup) {
      try {
        await SkillApi.signup({name: userName, fullName: userName, password, email} as User).send();
        await SkillApi.login({name: userName, password}).send();
        setIdentity(await SkillApi.getLoginStatus().send());
      } catch (ex) {
        console.error(ex);
        setApiError(ex.message);
      }
      return;
    }
    try {
      await SkillApi.login({name: userName, password}).send();
      setIdentity(await SkillApi.getLoginStatus().send());
    } catch (ex) {
      console.error(ex);
      if (ex.details && ex.details.details instanceof Array) {
        setValidationErrors(ex.details.details);
      } else {
        setApiError(ex.message);
      }
    }
  }
  
  const tabHandler = (value: boolean) => {
    return (e: React.MouseEvent) => {
      setSignup(value);
      if (usernameInput.current) {
        usernameInput.current.focus();
      }
    }
  };
  
  if (identity) {
    return <div className="login">
      <h3>Already logged in</h3>
    </div>
  }

  return (<div className="login">
      <h3>Login</h3>
      <div className="login__container">
        <form className="login__form" onSubmit={submitHandler}>
              
          <nav className="login__nav">
            <ul className="login__nav-list">
              <li className="login__nav-list-item">
                <button onClick={tabHandler(false)} type="button" className={signup === false ? 'active' : ''}>Login</button>
              </li>
              <li className="login__nav-list-item">
                <button onClick={tabHandler(true)} type="button" className={signup === true ? 'active' : ''}>Sign Up</button>
              </li>
            </ul>
          </nav>
          <ValidationErrors details={validationErrors}></ValidationErrors>
          {apiError && <div className="login__error">
            {apiError}
          </div>}
          <div className="login__field">
            <label className="login__label" htmlFor="loginUsername">Username</label>
            <input id="loginUsername" ref={usernameInput} value={userName} onChange={e => setUsername(e.target.value)} className="login__input" required />
          </div>
          {signup ? <div className="login__field">
            <label className="login__label" htmlFor="loginEmail">Email</label>
            <input id="signupEmail" className="login__input" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
          </div>: ''
          }
          <div className="login__field">
            <label className="login__label" htmlFor="loginPassword">Password</label>
            <input type="password" id="loginPassword" ref={passwordInput} value={password} onChange={e => setPassword(e.target.value)} className="login__input--password" required />
          </div>
          <div className="login__field">
            <button type="submit" className="login__submit"> {signup ? 'sign up' : 'login'} </button>
          </div>
        </form>
      </div>
  </div>);
}