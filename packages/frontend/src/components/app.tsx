import React, { useEffect, Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Header } from './header/header';
import { LoginPage } from '../pages/login-page/login-page';
import { MyProfilePage } from '../pages/my-profile-page/my-profile-page';
import { ProfilePage } from '../pages/profile-page/profile-page';
import { SkillPage } from '../pages/skill-page/skill-page';
import { SkillApi } from '../client/skill-api';
import { ApiException } from '../client/ajax';
import { Toaster } from './toaster/toaster';
import { SearchPage } from '../pages/search-page/search-page';
import { SkillDetailsPage } from '../pages/skill-details-page';
import { NotFoundPage } from '../pages/not-found-page/not-found-page';
import { Actions } from '../store/app.actions';
import { useAppStore } from '../store/app.context';
import { TeamsPage } from '../pages/teams-page/teams-page';
import { TeamDetailsPage } from '../pages/team-details/team-details';

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
                <Routes>
                  <Route path="/" element={<SearchPage />} />
                  <Route path="/profile/:name" element={<ProfilePage />} />
                  <Route path="/my-profile" element={<MyProfilePage />} />
                  <Route path="/my-skills" element={<SkillPage />} />
                  <Route
                    path="/skill-details/*"
                    element={<SkillDetailsPage />}
                  />
                  <Route path="/teams/:param?" element={<TeamsPage />} />
                  <Route path="/team/:param?" element={<TeamDetailsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
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
