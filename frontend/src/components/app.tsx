import React, { useState, useEffect, Fragment } from 'react';
import Header from './header';
import SearchBox from './search-box';
import ResultList from './result-list';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import { UserIcon } from './svg-icons';
import { LoginPage } from './login-page';
import { ProfilePage } from './profile-page';
import { SkillApi, Identity } from '../api/skill-api';
import { ApiException } from '../api/ajax';


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
              </Switch>
               : 
              <LoginPage identity={identity} setIdentity={setIdentity} /> 
            }  
          </Fragment>
        )}
        
      </Router>
    </div>
  );
}

export default App;
