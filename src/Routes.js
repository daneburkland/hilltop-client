import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Thread from "./containers/Thread";
import Login from "shared/Login";
import Signup from "shared/Signup";
import Editor from "./containers/Editor";
import NewNote from "./containers/NewNote";
import Recorder from "./containers/Recorder";
import NotFound from "./containers/NotFound";
import AppliedRoute from "./components/AppliedRoute";
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
      path="/recorder"
      exact
      component={Recorder}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/notes/new"
      exact
      component={NewNote}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/notes/:id"
      exact
      component={Thread}
      props={childProps}
    />
    {/* Finally, catch all unmatched routes */}
    <Route component={NotFound} />
  </Switch>
);
