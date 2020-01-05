import React, { Component } from "react";
import { Link } from "react-router-dom";
import RecordingList from "shared/RecordingList";
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      recordings: []
    };
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

  render() {
    return (
      <div className="container">
        {this.props.isAuthenticated ? <RecordingList /> : this.renderLander()}
      </div>
    );
  }
}
