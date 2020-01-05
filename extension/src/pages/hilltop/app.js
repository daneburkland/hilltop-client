import React, { useState, useEffect } from "react";
import "./app.css";
import { Auth } from "aws-amplify";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
import User from "shared/classes/User";
import { Nav, Navbar } from "react-bootstrap";
import Recording from "shared/classes/Recording";

function App(props) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  async function fetchUser() {
    let user;
    try {
      await Auth.currentSession();
      user = await User.getCurrentAuthedUser();
      setIsAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }

    setCurrentUser(user);
    setIsAuthenticating(false);
  }

  // TODO: I should store user info in the store
  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async event => {
    await Auth.signOut();

    setIsAuthenticated(false);

    props.history.push("/login");
  };

  useEffect(() => {
    if (!props.recording.isEmpty()) {
      props.history.push("/");
    }
  }, [props.recording.isEmpty()]);

  const childProps = {
    isAuthenticated: isAuthenticated,
    userHasAuthenticated: setIsAuthenticated,
    setCurrentUser: setCurrentUser,
    currentUser: currentUser
  };

  return (
    !isAuthenticating && (
      <div>
        <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
          <LinkContainer to="/">
            <Navbar.Brand href="/">Hilltop</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ml-auto">
              {isAuthenticated ? (
                <>
                  <LinkContainer to="/account">
                    <Nav.Link>Account</Nav.Link>
                  </LinkContainer>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link>Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    )
  );
}

const mapStateToProps = ({ dashboard: { recording } }) => ({
  recording: Recording.from(recording)
});

export default withRouter(connect(mapStateToProps)(App));
