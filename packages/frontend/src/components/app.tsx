import React, { useEffect, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Header } from './header/header';
import { LoginPage } from './login-page/login-page';
import { MyProfilePage } from './my-profile-page/my-profile-page';
import { ProfilePage } from './profile-page/profile-page';
import { SkillPage } from './skill-page/skill-page';
import { SkillApi } from '../client/skill-api';
import { ApiException } from '../client/ajax';
import { Toaster } from './toaster/toaster';
import { SearchPage } from './search-page/search-page';
import { SkillDetailsPage } from './skill-details-page/skill-details-page';
import { NotFoundPage } from './not-found-page/not-found-page';
import { Actions } from '../store/app.actions';
import { useAppStore } from '../store/app.context';
import { TeamsPage } from './teams-page/teams-page';
import { TeamDetailsPage } from './team-details/team-details';

const App: React.FC = () => {
  const { state, dispatch } = useAppStore();

  const { identity, darkMode } = state;

  useEffect(() => {
    const req = SkillApi.getLoginStatus();
    req
      .send()
      .then((id) => {
        dispatch(Actions.setIdentity(id));
      })
      .catch((ex) => {
        if (ex instanceof ApiException && ex.code === 401) {
          dispatch(Actions.setIdentity(null));
        }
      });
    return () => req.abort();
  }, [dispatch]);

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
            <Header toggleDarkMode={toggleDarkMode} darkMode={state.darkMode} />
            <main>
              {identity !== null ? (
                <Switch>
                  <Route exact path="/">
                    <SearchPage />
                  </Route>
                  <Route path="/profile/:name">
                    <ProfilePage />
                  </Route>
                  <Route exact path="/my-profile">
                    <MyProfilePage />
                  </Route>
                  <Route exact path="/my-skills">
                    <SkillPage />
                  </Route>
                  <Route exact path="/skill-details/:skill?">
                    <SkillDetailsPage />
                  </Route>
                  <Route exact path="/teams/:param?">
                    <TeamsPage />
                  </Route>
                  <Route exact path="/team/:param?">
                    <TeamDetailsPage />
                  </Route>
                  <Route path="*">
                    <NotFoundPage />
                  </Route>
                </Switch>

              ) : (
                  <LoginPage />
                )}
            </main>
          </Fragment>
        )}
      </Router>
      <Toaster></Toaster>
    </div>
  );
};

export default App;
