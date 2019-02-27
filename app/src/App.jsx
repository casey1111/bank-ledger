import React, {useState} from 'react';
import Main from './Main';
import Header from './Header';
import { LoginContext } from './loginContext';

const App = () => {
    const [isLoggedIn, setLogin] = useState();

    return (
      <LoginContext.Provider value={{ isLoggedIn, setLogin }}>
        <Header />
        <br />
        <Main />
      </LoginContext.Provider>
    );
};

export default App;