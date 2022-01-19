import React from "react";

import Login from "./Login/Login";

import { Route, Switch } from "react-router-dom";

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Login} />
      </Switch>
    </div>
  );
}

export default App;
