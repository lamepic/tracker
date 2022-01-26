import React from "react";
import { Route, Redirect } from "react-router";
import { useStateValue } from "../store/StateProvider";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [{ user }] = useStateValue();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (user.is_department) {
          return <Component {...props} />;
        } else {
          return <Redirect to="/" />;
        }
      }}
    />
  );
};

export default ProtectedRoute;
