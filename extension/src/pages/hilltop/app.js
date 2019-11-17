import React from "react";
import "./app.css";
import { Auth } from "aws-amplify";
import { withRouter } from "react-router-dom";
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
import User from "shared/classes/User";
import { Nav, Navbar } from "react-bootstrap";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
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

  setCurrentUser = user => {
    this.setState({ currentUser: user });
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
      setCurrentUser: this.setCurrentUser,
      currentUser: this.state.currentUser
    };

    return (
      !this.state.isAuthenticating && (
        <div>
          <Navbar collapseOnSelect expand="sm" bg="light" variant="light">
            <Navbar.Brand href="/pages/hilltop.html">Hilltop</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Nav className="ml-auto">
                {this.state.isAuthenticated ? (
                  <>
                    <LinkContainer to="/account">
                      <Nav.Link>Account</Nav.Link>
                    </LinkContainer>
                    <Nav.Link onClick={this.handleLogout}>Logout</Nav.Link>
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
}

export default withRouter(App);
