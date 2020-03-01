import React, { useState, useEffect, Fragment } from 'react';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';

import { Header } from './header/header';
import { UserIcon, SkillIcon } from './svg-icons/svg-icons';
import { LoginPage } from './login-page/login-page';
import { MyProfilePage } from './my-profile-page/my-profile-page';
import { ProfilePage } from './profile-page/profile-page';
import { SkillPage } from './skill-page/skill-page';
import { SkillApi, Identity } from '../api/skill-api';
import { ApiException } from '../api/ajax';
import { Toaster } from './toaster/toaster';
import { SearchPage } from './search-page/search-page';

const App: React.FC = () => {
  const [identity, setIdentity] = useState<Identity | null | undefined>(
    undefined
  );
  useEffect(() => {
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
    asyncEffect();
  }, [setIdentity]);
  return (
    <div className="app">
      <Router>
        {typeof identity !== 'undefined' && (
          <Fragment>
            <Header>
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
