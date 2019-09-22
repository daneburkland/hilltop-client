import React from "react";
import { Route } from "react-router-dom";

export default ({ component: C, props: cProps, ...rest }) => {
  console.log("in applied routes", cProps);
  return <Route {...rest} render={props => <C {...props} {...cProps} />} />;
};
