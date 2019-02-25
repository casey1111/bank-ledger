import {withRouter} from 'react-router-dom';
import React, {useEffect} from 'react';
import {callApi} from "./utils";

const Logout = ({history, setLogin}) => {
  useEffect(() => {
    callApi('logout').then(() => {
      setLogin(false);
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
