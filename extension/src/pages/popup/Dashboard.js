import React from "react";
import { connect } from "react-redux";
import { toggleMode } from "../background/actions";

import "./dashboard.css";

class Dashboard extends React.Component {
  render() {
    const { handleToggleMode } = this.props;
    return (
      <div>
        <button onClick={() => handleToggleMode("record")}>Record</button>
        <button onClick={() => handleToggleMode("assert")}>Assert</button>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  handleToggleMode: mode => dispatch(toggleMode(mode))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
