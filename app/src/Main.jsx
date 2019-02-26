import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './Login';
import Logout from './Logout';
import AccountCreate from './AccountCreate';
import TransactionHistory from './TransactionHistory';
import TransactionCreate from './TransactionCreate';

// redirect user to login page if trying to access protected route and not logged in.
const ProtectedRoute = ({ isAllowed, ...props }) => isAllowed ? <Route {...props}/> : <Redirect to="/login"/>;

const Main = ({isLoggedIn, setLogin}) => {
    return (
            <Switch>
              <Route exact path='/login' render={(props) => <Login setLogin={setLogin} {...props} /> }/>
              <Route exact path='/logout' render={(props) => <Logout setLogin={setLogin} {...props}  />}/>
              <Route path='/account-create'  render={(props) => <AccountCreate setLogin={setLogin} {...props} /> } />
              <ProtectedRoute path='/transaction-history' component={TransactionHistory} isAllowed={isLoggedIn}/>
              <ProtectedRoute path='/transaction-create' component={TransactionCreate} isAllowed={isLoggedIn}/>
            </Switch>
    );
};

export default Main;