import React, { Component } from "react";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { ListGroup } from "react-bootstrap";
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      notes: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const notes = await this.notes();
      this.setState({ notes });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  notes() {
    return API.get("notes", "/notes");
  }

  renderNotesList(notes) {
    const sortedNotes = notes.sort((a, b) => b.createdAt - a.createdAt);
    return sortedNotes.map((note, i) => (
      <LinkContainer key={note.noteId} to={`/recording/${note.noteId}`}>
        <ListGroup.Item header="header note">
          {"Created: " + new Date(note.createdAt).toLocaleString()}
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

  renderNotes() {
    return (
      <div className="notes">
        <h1>Your Notes</h1>
        <ListGroup>
          {!this.state.isLoading && this.renderNotesList(this.state.notes)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderNotes() : this.renderLander()}
      </div>
    );
  }
}
