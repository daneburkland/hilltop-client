import parse from "url-parse";
import { Storage } from "aws-amplify";

export default class RecordingResult {
  constructor({ authedCookies, stepResults, tracing }) {
    this.authedCookies = authedCookies;
    this.stepResults = stepResults;
    this.tracing = tracing;
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
