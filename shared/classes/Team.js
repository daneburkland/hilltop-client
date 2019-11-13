import { API } from "aws-amplify";

export default class Team {
  constructor({ teamId }) {
    this.teamId = teamId;
  }
  static async create() {
    await API.post("teams", "/create");
  }

  static async fetch() {
    const team = await API.get("teams", "/team");
    return new Team(team);
  }
}
