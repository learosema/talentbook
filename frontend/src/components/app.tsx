import React, { useState } from 'react';
import Header from './header';
import LoginForm from './login-form';
import SearchBox from './search-box';
import ResultList from './result-list';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loginVisible, setLoginVisible] = useState<boolean>(false);

  return (
    <div className="app">
      <Header 
        loginVisible={loginVisible}
        setLoginVisible={setLoginVisible} />
      <SearchBox 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} />
      <ResultList />
      <LoginForm
        loginVisible={loginVisible}
        setLoginVisible={setLoginVisible} />
    </div>
  );
}

export default App;
