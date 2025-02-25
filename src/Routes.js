import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Login from "shared/Login";
import Signup from "shared/Signup";
import Editor from "./containers/Editor";
import Playground from "./containers/Playground";
import Account from "shared/Account";
import Recording from "shared/Recording";
import NewNote from "./containers/NewNote";
import NotFound from "./containers/NotFound";
import PasswordReset from "shared/PasswordReset";
import AppliedRoute from "shared/components/AppliedRoute";
import AuthenticatedRoute from "shared/AuthenticatedRoute";
import UnauthenticatedRoute from "shared/UnauthenticatedRoute";

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
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
      path="/editor"
      exact
      component={Editor}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/password-reset"
      exact
      component={PasswordReset}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/playground"
      exact
      component={Playground}
      props={childProps}
    />
    {/* TODO: 'ExistsRoute' which checks query params for presense of puppeteer code? */}
    <Route path="/recording" exact component={Editor} props={childProps} />
    <AuthenticatedRoute
      path="/recordings/new"
      exact
      component={NewNote}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/editor/:id"
      exact
      component={Editor}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/recording/:id"
      exact
      component={Recording}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/account"
      exact
      component={Account}
      props={childProps}
    />
    {/* Finally, catch all unmatched routes */}
    <Route component={NotFound} />
  </Switch>
);
