import parse from "url-parse";
import { Storage } from "aws-amplify";

export default class RecordingResult {
  constructor({ authedCookies, stepResults, tracing, measurements, error }) {
    this.authedCookies = authedCookies;
    this.stepResults = stepResults;
    this.tracing = tracing;
    this.measurements = measurements;
    this.error = error;
  }

  async fetchTracing() {
    let result;
    try {
      result = await Storage.get(this.tracing.key, {
        bucket: this.tracing.bucket
      });
      const parsed = parse(result);
      return parsed.origin.concat(parsed.pathname);
    } catch (e) {
      console.error(e);
    }
  }
}
