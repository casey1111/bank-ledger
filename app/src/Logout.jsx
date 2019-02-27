import {withRouter} from 'react-router-dom';
import React, {useEffect, useContext} from 'react';
import {callApi} from "./utils";
import { LoginContext } from "./loginContext";

const Logout = ({history}) => {
  const loginContext = useContext(LoginContext);

  useEffect(() => {
    callApi('logout').then(() => {
      loginContext.setLogin(false);
      history.replace('/login');
    });
  });

  return (
    <div>
      Logout
    </div>
  )
};
export default withRouter(Logout);
