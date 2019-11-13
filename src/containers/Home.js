import React, { Component } from "react";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { ListGroup } from "react-bootstrap";
import Loader from "shared/Loader";
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      recordings: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const recordings = await this.recordings();
      this.setState({ recordings });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  recordings() {
    return API.get("recordings", "/recordings");
  }

  renderRecordingsList(recordings) {
    const sortedRecordings = recordings.sort(
      (a, b) => b.createdAt - a.createdAt
    );
    return sortedRecordings.map((recording, i) => (
      <LinkContainer
        key={recording.recordingId}
        to={`/recording/${recording.recordingId}`}
      >
        <ListGroup.Item header="header recording">
          {"Created: " + new Date(recording.createdAt).toLocaleString()}
        </ListGroup.Item>
      </LinkContainer>
    ));
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Hilltop</h1>
        <p>Automation for the browser</p>
        <div>
          <Link to="/login" className="btn btn-info btn-lg">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  renderRecordings() {
    return (
      <div className="recordings">
        <h1>Your Recordings</h1>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <ListGroup>
            {this.renderRecordingsList(this.state.recordings)}
          </ListGroup>
        )}
      </div>
    );
  }

  render() {
    console.log(this.props);
    return (
      <div className="Home">
        {this.props.isAuthenticated
          ? this.renderRecordings()
          : this.renderLander()}
      </div>
    );
  }
}
