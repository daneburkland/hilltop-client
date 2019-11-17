import React from "react";
import { Auth } from "aws-amplify";
import { withRouter } from "react-router-dom";
import User from "shared/classes/User";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { setPopupId, toggleRecord } from "../background/actions";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      popupId: null
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

  handleGoToDashboard = () => {
    const { handleSetPopupId, popupId } = this.props;
    window.close();
    if (popupId) {
      chrome.windows.update(popupId, { focused: true });
    } else {
      chrome.windows.create(
        {
          url: "/pages/hilltop.html",
          type: "popup",
          width: 800,
          height: 1000
        },
        ({ id }) => {
          handleSetPopupId(id);
        }
      );
    }
  };

  handleToggleRecord = () => {
    const { toggleRecord, isRecording } = this.props;
    toggleRecord();
    if (isRecording) {
      this.handleGoToDashboard();
    }
  };

  render() {
    const { isRecording } = this.props;
    return (
      !this.state.isAuthenticating && (
        <div
          style={{ width: 200 }}
          className="d-flex align-items-center justify-content-center py-4"
        >
          {this.state.isAuthenticated ? (
            <div className="d-flex flex-column">
              <Button
                className="mb-3"
                onClick={this.handleToggleRecord}
                variant={isRecording ? "danger" : "primary"}
              >
                {isRecording ? "Pause" : "Record"}
              </Button>
              <Button onClick={this.handleGoToDashboard}>Dashboard</Button>
            </div>
          ) : (
            <Button onClick={this.handleGoToDashboard}>Get Started</Button>
          )}
        </div>
      )
    );
  }
}

const mapStateToProps = ({ dashboard }) => ({
  popupId: dashboard.popupId,
  isRecording: dashboard.isRecording
});

const mapDispatchToProps = dispatch => ({
  handleSetPopupId: id => dispatch(setPopupId(id)),
  toggleRecord: () => dispatch(toggleRecord())
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
