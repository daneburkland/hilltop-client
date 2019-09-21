import { connect } from "react-redux";
import Recorder from "shared/Recorder";

const mapStateToProps = ({ dashboard }) => ({
  isRecording: dashboard.isRecording
});

export default connect(mapStateToProps)(Recorder);
