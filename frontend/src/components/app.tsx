import React, { useState, useEffect, Fragment } from 'react';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';

import { Header } from './header/header';
import { UserIcon, SkillIcon, DarkmodeIcon } from './svg-icons/svg-icons';
import { LoginPage } from './login-page/login-page';
import { MyProfilePage } from './my-profile-page/my-profile-page';
import { ProfilePage } from './profile-page/profile-page';
import { SkillPage } from './skill-page/skill-page';
import { SkillApi, Identity } from '../api/skill-api';
import { ApiException } from '../api/ajax';
import { Toaster } from './toaster/toaster';
import { SearchPage } from './search-page/search-page';
import { ButtonType, ButtonKind, Button } from './button/button';

import { isDarkTheme } from '../helpers/preferences';

const App: React.FC = () => {
  const [identity, setIdentity] = useState<Identity | null | undefined>(
    undefined
  );
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    console.log('effect');
    const asyncEffect = async () => {
      try {
        const id = await SkillApi.getLoginStatus().send();
        setIdentity(id);
      } catch (ex) {
        if (ex instanceof ApiException && ex.code === 401) {
          setIdentity(null);
        }
      }
    };
    setDarkMode(isDarkTheme());
    asyncEffect();
  }, [setIdentity, setDarkMode]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    localStorage.setItem('talentBookTheme', darkMode ? 'light' : 'dark');
    setDarkMode(!darkMode);
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
                <DarkmodeIcon darkMode={darkMode} />
              </Button>
              <Link to="/my-skills">
                <SkillIcon />
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
                  <MyProfilePage
                    identity={identity}
                    setIdentity={setIdentity}
                  />
                </Route>
                <Route exact path="/my-skills">
                  <SkillPage identity={identity} />
                </Route>
              </Switch>
            ) : (
              <LoginPage identity={identity} setIdentity={setIdentity} />
            )}
          </Fragment>
        )}
      </Router>
      <Toaster></Toaster>
    </div>
  );
};

export default App;
