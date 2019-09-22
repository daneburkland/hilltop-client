import React from "react";
import { Switch } from "react-router-dom";
import Login from "shared/Login";
import Signup from "shared/Signup";
// import NotFound from "./containers/NotFound";
import AppliedRoute from "shared/components/AppliedRoute";
import AuthenticatedRoute from "shared/AuthenticatedRoute";
import UnauthenticatedRoute from "shared/UnauthenticatedRoute";
import Dashboard from "./Dashboard";
import Home from "./Home";

export default ({ childProps }) => (
  <Switch>
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
    <AuthenticatedRoute
      path="/dashboard"
      exact
      component={Dashboard}
      props={childProps}
    />
    {/* Finally, catch all unmatched routes */}
    {/* <Route component={NotFound} /> */}
  </Switch>
);
