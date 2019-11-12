import React, { Component, Fragment } from "react";
import { Auth } from "aws-amplify";
import { withRouter } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import User from "shared/classes/User";
import Routes from "./Routes";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      currentUser: null
    };
  }

  async componentDidMount() {
    let user;
    try {
      await Auth.currentSession();
      user = await User.getCurrentAuthedUser();
      this.userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }

    this.setState({ isAuthenticating: false, currentUser: user });
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
      userHasAuthenticated: this.userHasAuthenticated,
      currentUser: this.state.currentUser
    };

    return (
      !this.state.isAuthenticating && (
        <div className="App">
          <Navbar collapseOnSelect expand="sm" bg="light" variant="light">
            <Navbar.Brand href="/">Hilltop</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Nav className="ml-auto">
                {this.state.isAuthenticated ? (
                  <>
                    <LinkContainer to="/editor">
                      <Nav.Link>Editor</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/playground">
                      <Nav.Link>Playground</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/account">
                      <Nav.Link>Account</Nav.Link>
                    </LinkContainer>
                    <Nav.Link onClick={this.handleLogout}>Logout</Nav.Link>
                  </>
                ) : (
                  <Fragment>
                    <LinkContainer to="/signup">
                      <Nav.Link>Signup</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/login">
                      <Nav.Link>Login</Nav.Link>
                    </LinkContainer>
                  </Fragment>
                )}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Routes childProps={childProps} />
        </div>
      )
    );
  }
}

export default withRouter(App);
