import React, { useEffect } from "react";

import "react-notifications-component/dist/theme.css";
import ReactNotification from "react-notifications-component";

import Login from "./Login/Login";

import { Route, Switch } from "react-router-dom";
import PrivateRoute from "../utility/PrivateRoute";
import Dashboard from "./Dashboard/Dashboard";
import { useStateValue } from "../store/StateProvider";
import * as actionTypes from "../store/actionTypes";
import { loadUser } from "../http/user";

function App() {
  const [store, dispatch] = useStateValue();

  const token = store.token;

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await loadUser(token);
      dispatch({
        type: actionTypes.USER_LOADED,
        payload: res.data,
      });
    } catch {
      dispatch({
        type: actionTypes.AUTH_ERROR,
      });
    }
  };

  return (
    <div>
      <ReactNotification />
      <Switch>
        <Route exact path="/" component={Login} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
      </Switch>
    </div>
  );
}

export default App;
