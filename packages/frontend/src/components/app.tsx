import React, { useEffect, Fragment, useReducer } from 'react';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';

import { Header } from './header/header';
import {
  UserIcon,
  SkillIcon,
  DarkmodeIcon,
  CogIcon,
} from './svg-icons/svg-icons';
import { LoginPage } from './login-page/login-page';
import { MyProfilePage } from './my-profile-page/my-profile-page';
import { ProfilePage } from './profile-page/profile-page';
import { SkillPage } from './skill-page/skill-page';
import { SkillApi } from '../api/skill-api';
import { ApiException } from '../api/ajax';
import { Toaster } from './toaster/toaster';
import { SearchPage } from './search-page/search-page';
import { ButtonType, ButtonKind, Button } from './button/button';

import { isDarkTheme } from '../helpers/preferences';
import { SkillDetailsPage } from './skill-details-page/skill-details-page';
import { NotFoundPage } from './not-found-page/not-found-page';
import { useApiEffect } from '../helpers/api-effect';
import { initialAppState, appReducer, Actions } from '../store/app.reducer';

const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, {
    ...initialAppState,
    darkMode: isDarkTheme(),
  });

  const { identity, darkMode } = state;

  useApiEffect(
    () => SkillApi.getLoginStatus(),
    async (request) => {
      try {
        const id = await request.send();
        dispatch(Actions.setIdentity(id));
      } catch (ex) {
        if (ex instanceof ApiException && ex.code === 401) {
          dispatch(Actions.setIdentity(null));
        }
      }
    },
    []
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    localStorage.setItem('talentBookTheme', darkMode ? 'light' : 'dark');
    dispatch(Actions.setDarkMode(!darkMode));
  };

  return (
    <div className="app">
      <Router>
        {typeof identity !== 'undefined' && (
          <Fragment>
            <Header>
              <Button
                type={ButtonType.Button}
                kind={ButtonKind.Unstyled}
                onClick={toggleDarkMode}
              >
                <DarkmodeIcon darkMode={state.darkMode} />
              </Button>
              <Link to="/skill-details">
                <SkillIcon />
              </Link>
              <Link to="/my-skills">
                <CogIcon />
              </Link>
              <Link to="/my-profile">
                <UserIcon />
              </Link>
            </Header>
            {identity !== null ? (
              <Switch>
                <Route exact path="/">
                  <SearchPage />
                </Route>
                <Route path="/profile/:name">
                  <ProfilePage identity={identity} />
                </Route>
                <Route exact path="/my-profile">
                  <MyProfilePage identity={identity} dispatch={dispatch} />
                </Route>
                <Route exact path="/my-skills">
                  <SkillPage identity={identity} />
                </Route>
                <Route exact path="/skill-details/:skill?">
                  <SkillDetailsPage identity={identity} />
                </Route>
                <Route path="*">
                  <NotFoundPage />
                </Route>
              </Switch>
            ) : (
              <LoginPage identity={identity} dispatch={dispatch} />
            )}
          </Fragment>
        )}
      </Router>
      <Toaster></Toaster>
    </div>
  );
};

export default App;
