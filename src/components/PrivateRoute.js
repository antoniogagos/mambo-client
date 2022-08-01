import React, { useEffect, useContext, useState } from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import { AuthContext } from "../firebase/auth";

const PrivateRoute = ({ children, ...rest }) => {
  const { user } = useContext(AuthContext);
  const { pathname } = useLocation();
  const [redirectTo, setRedirectTo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(_ => {
    console.log({ user });
    if (user) {
      setRedirectTo('/tournaments');
      setLoading(false);
    } else if (user === null) {
      setRedirectTo('/signin')
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [user]);

  if (loading) {
    return <></>;
  }

  return (
    <Route {...rest} render={() => {
      return (
        redirectTo === '/tournaments' ? children : (<Redirect to={{
          pathname: "/signin",
          state: { from: pathname }
        }} />)
      )
    }}
    />
  );
};

export default PrivateRoute