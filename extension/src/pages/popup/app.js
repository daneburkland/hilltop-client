import React from "react";
import "./app.css";
import Settings from "./Settings";
import Dashboard from "./Dashboard";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

class App extends React.Component {
  render() {
    console.log("app");
    return (
      <Router>
        <div className="wrapper">
          <Switch>
            <Route exact path="/pages/popup.html" component={Dashboard} />
            <Route path="/pages/settings" component={Settings} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
