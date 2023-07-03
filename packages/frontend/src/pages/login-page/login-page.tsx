import React, { useState, useEffect, useRef } from 'react';

import { SkillApi, User } from '../../client/skill-api';
import { ErrorList, ErrorItem } from '../../components/error-list/error-list';
import { Button, ButtonType, ButtonKind } from '../../components/button/button';
import { TextInput } from '../../components/text-input/text-input';

import { Actions } from '../../store/app.actions';
import { AppConfig } from '../../helpers/app-config';
import { useAppStore } from '../../store/app.context';
import { AppShell } from '../../components/app-shell/app-shell';
import { useNavigate } from 'react-router';
import { FormField } from '../../components/form-field/form-field';
import { useQueryClient } from 'react-query';

export const LoginPage: React.FC = () => {
  const { state, dispatch } = useAppStore();
  const { identity } = state;
  const usernameInput = useRef<HTMLInputElement | null>(null);
  const passwordInput = useRef<HTMLInputElement | null>(null);
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [tab, setTab] = useState('login');
  const [forgot, setForgot] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ErrorItem[]>([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (usernameInput.current !== null) {
      usernameInput.current.focus();
    }
  }, []);

  useEffect(() => {
    if (tab === 'login') {
      setForgot(false);
    }
  }, [tab]);

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
    if (tab === 'signup') {
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
        queryClient.invalidateQueries(['login'])
      } catch (ex: any) {
        if (ex instanceof Error) {
          console.error(ex);
          setValidationErrors([{ message: ex.message }]);
        }
      }
      return;
    }

    if (forgot) {
      const result = await SkillApi.forgot({ name: userName, email: email }).send();
      setValidationErrors([{ message: result.message }]);
      setEmail('');
      setUsername('');
      setForgot(false);
      if (usernameInput.current) {
        usernameInput.current.focus();
      }
      return;
    }

    try {
      await SkillApi.login({ name: userName, password }).send();
      const identity = await SkillApi.getLoginStatus().send();
      dispatch(Actions.setIdentity(identity));
    } catch (ex: any) {
      console.error(ex);
      if (ex.details && ex.details.details instanceof Array) {
        setValidationErrors(ex.details.details);
      } else {
        setValidationErrors([{ message: ex.message }]);
      }
    }
  };

  const tabHandler = (value: string) => {
    return () => {
      setTab(value);
      if (usernameInput.current) {
        usernameInput.current.focus();
      }
    };
  };

  useEffect(() => {
    
    if (identity) {
      navigate('/');
      return;
    }
  }, [identity, navigate]);
  
  return (
    <AppShell loginRequired={false}>
      <h3>Login</h3>
      <form onSubmit={submitHandler}>
        <div className="login__container flow">
        
          <div className="login__nav" role="tablist">
            <button
              role="tab"
              aria-selected={tab === 'login' ? 'true' : 'false'}
              onClick={tabHandler('login')}
              type="button"
              className={tab === 'login' ? 'active' : ''}
            >
              Login
            </button>

            <button
              role="tab"
              aria-selected={tab === 'signup' ? 'true' : 'false'}
              onClick={tabHandler('signup')}
              type="button"
              className={tab === 'signup' ? 'active' : ''}
            >
              Sign Up
            </button>
          </div>
          <div role="alert" aria-live="polite">
            <ErrorList details={validationErrors}></ErrorList>
          </div>
          <FormField label="Username" htmlFor="loginUsername">
            <TextInput
              id="loginUsername"
              ref={usernameInput}
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              className="login__input"
              required
            />
          </FormField>
          {forgot || tab === 'signup' ? (
            <FormField label="Email" htmlFor="signupEmail">
              <TextInput
                id="signupEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </FormField>
          ) : (
            <></>
          )}
          {tab === 'signup' || forgot === false ? <FormField label="Password" htmlFor="loginPassword">
          
            <TextInput
              type="password"
              id="loginPassword"
              ref={passwordInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormField> : ''}
          <FormField>
            <Button type={ButtonType.Submit}>
              {' '}
              {tab === 'signup' ? 'sign up' : (
                forgot ? 'send login link' : 'login')}{' '}
            </Button>
          </FormField>
          {tab === 'login' ? (
            <FormField>
              <Button type={ButtonType.Button} kind={ButtonKind.Secondary} onClick={() => setForgot(!forgot)}>
                {forgot ? 'Back to login' : 'Forgot password'}
              </Button>
            </FormField>
          ) : ''}
          {AppConfig.githubClientId && (
            <FormField>
              <Button
                type={ButtonType.Button}
                onClick={githubAuthHandler}
                kind={ButtonKind.Secondary}
              >
                {tab === 'signup' ? 'Sign up with Github' : 'Sign in with Github'}
              </Button>
            </FormField>
          )}
        </div>
      </form>
    </AppShell>
  );
};
