import React from "react";
import { Switch } from "react-router-dom";
import Login from "shared/Login";
import Signup from "shared/Signup";
import AppliedRoute from "shared/components/AppliedRoute";
import AuthenticatedRoute from "shared/AuthenticatedRoute";
import UnauthenticatedRoute from "shared/UnauthenticatedRoute";
import Home from "./Home";

export default ({ childProps }) => {
  return (
    <Switch>
      <AppliedRoute path="/" exact component={Home} props={childProps} />
      <AppliedRoute
        path="/pages/popup.html"
        exact
        component={Home}
        props={childProps}
      />
      <UnauthenticatedRoute
        path="/login"
        exact
        component={Login}
        props={childProps}
      />
      <UnauthenticatedRoute
        path="/signup"
        exact
        component={Signup}
        props={childProps}
      />
    </Switch>
  );
};
