import React, { useState, useEffect, Fragment } from 'react';
import Header from './header';
import SearchBox from './search-box';
import ResultList from './result-list';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import { UserIcon, SkillIcon } from './svg-icons';
import { LoginPage } from './login-page';
import { ProfilePage } from './profile-page';
import { SkillPage } from './skill-page';
import { SkillApi, Identity } from '../api/skill-api';
import { ApiException } from '../api/ajax';
import { Toaster } from './toaster';


const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [identity, setIdentity] = useState<Identity|null|undefined>(undefined);
  useEffect(() => {
    const asyncEffect = async () => {
      try {
        const id = await SkillApi.getLoginStatus().send();
        setIdentity(id)
      } catch (ex) {
        if (ex instanceof ApiException && ex.code === 401) {
          setIdentity(null);
        }
      }
    }
    asyncEffect();
  }, []);
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
            {identity !== null ?
              <Switch>
                <Route exact path="/">
                  <Fragment>
                    <SearchBox 
                      searchTerm={searchTerm} 
                      setSearchTerm={setSearchTerm} />
                    <ResultList />
                  </Fragment>
                </Route>
                <Route exact path="/my-profile">
                  <ProfilePage identity={identity} setIdentity={setIdentity} />
                </Route>
                <Route exact path="/my-skills">
                  <SkillPage />
                </Route>
              </Switch>
               : 
              <LoginPage identity={identity} setIdentity={setIdentity} /> 
            }  
          </Fragment>
        )}
        
      </Router>
      <Toaster></Toaster>
    </div>
  );
}

export default App;
