export default class RecordingStep {
  constructor({ viewport, location, type, manualType, displayType, target }) {
    this.viewport = viewport;
    this.location = location;
    this.type = type;
    this.manualType = manualType;
    this.displayType = displayType;
    this.target = target;
  }
}
