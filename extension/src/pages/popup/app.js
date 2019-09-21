import React from "react";
import "./app.css";
import { Auth } from "aws-amplify";
import Settings from "./Settings";
import Dashboard from "./Dashboard";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Routes from "./Routes";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  };

  handleLogout = async event => {
    await Auth.signOut();

    this.userHasAuthenticated(false);

    this.props.history.push("/login");
  };

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };

    return (
      <Router>
        <div className="wrapper">
          <Routes childProps={childProps} />
        </div>
      </Router>
    );
  }
}

export default App;
