import { connect } from "react-redux";
import Recorder from "shared/Recorder";

const mapStateToProps = ({ dashboard }) => ({
  mode: dashboard.mode
});

export default connect(mapStateToProps)(Recorder);
