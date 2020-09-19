import React, { useState, useEffect, useRef } from 'react';

import { SkillApi, User } from '../../api/skill-api';
import { ErrorList, ErrorItem } from '../error-list/error-list';
import { Button, ButtonType, ButtonKind } from '../button/button';
import { TextInput } from '../text-input/text-input';

import './login.scss';
import { Actions } from '../../store/app.actions';
import { AppConfig } from '../../helpers/app-config';
import { useAppStore } from '../../store/app.context';

export const LoginPage: React.FC = () => {
  const { state, dispatch } = useAppStore();
  const { identity } = state;
  const usernameInput = useRef<HTMLInputElement | null>(null);
  const passwordInput = useRef<HTMLInputElement | null>(null);
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [signup, setSignup] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ErrorItem[]>([]);

  useEffect(() => {
    if (usernameInput.current !== null) {
      usernameInput.current.focus();
    }
  }, []);

  const githubAuthHandler = () => {
    if (AppConfig.githubClientId) {
      const clientId = AppConfig.githubClientId;
      document.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}`;
    } else {
      console.error('Github integration is currently not configured.');
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (signup) {
      try {
        await SkillApi.signup({
          name: userName,
          fullName: userName,
          password,
          email,
        } as User).send();
        await SkillApi.login({ name: userName, password }).send();
        const identity = await SkillApi.getLoginStatus().send();
        dispatch(Actions.setIdentity(identity));
      } catch (ex) {
        console.error(ex);
        setValidationErrors([{ message: ex.message }]);
      }
      return;
    }
    try {
      await SkillApi.login({ name: userName, password }).send();
      const identity = await SkillApi.getLoginStatus().send();
      dispatch(Actions.setIdentity(identity));
    } catch (ex) {
      console.error(ex);
      if (ex.details && ex.details.details instanceof Array) {
        setValidationErrors(ex.details.details);
      } else {
        setValidationErrors([{ message: ex.message }]);
      }
    }
  };

  const tabHandler = (value: boolean) => {
    return () => {
      setSignup(value);
      if (usernameInput.current) {
        usernameInput.current.focus();
      }
    };
  };

  if (identity) {
    return (
      <div className="login">
        <h3>Already logged in</h3>
      </div>
    );
  }

  return (
    <div className="login">
      <h3>Login</h3>
      <div className="login__container">
        <form className="login__form" onSubmit={submitHandler}>
          <nav className="login__nav">
            <ul className="login__nav-list">
              <li className="login__nav-list-item">
                <button
                  onClick={tabHandler(false)}
                  type="button"
                  className={signup === false ? 'active' : ''}
                >
                  Login
                </button>
              </li>
              <li className="login__nav-list-item">
                <button
                  onClick={tabHandler(true)}
                  type="button"
                  className={signup === true ? 'active' : ''}
                >
                  Sign Up
                </button>
              </li>
            </ul>
          </nav>
          <ErrorList details={validationErrors}></ErrorList>
          <div className="login__field">
            <label className="login__label" htmlFor="loginUsername">
              Username
            </label>
            <TextInput
              id="loginUsername"
              ref={usernameInput}
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              className="login__input"
              required
            />
          </div>
          {signup ? (
            <div className="login__field">
              <label className="login__label" htmlFor="loginEmail">
                Email
              </label>
              <TextInput
                id="signupEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </div>
          ) : (
            ''
          )}
          <div className="login__field">
            <label className="login__label" htmlFor="loginPassword">
              Password
            </label>
            <TextInput
              type="password"
              id="loginPassword"
              ref={passwordInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="login__field">
            <Button type={ButtonType.Submit}>
              {' '}
              {signup ? 'sign up' : 'login'}{' '}
            </Button>
          </div>
          {AppConfig.githubClientId && (
            <div className="login__field">
              <Button
                type={ButtonType.Button}
                onClick={githubAuthHandler}
                kind={ButtonKind.Secondary}
              >
                {signup ? 'Sign up with Github' : 'Sign in with Github'}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
