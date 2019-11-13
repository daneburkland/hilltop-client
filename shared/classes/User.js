import { Auth, API } from "aws-amplify";
import Team from "./Team";
import uuid from "uuid";

const CHALLENGE_NAMES = {
  NEW_PASSWORD_REQD: "NEW_PASSWORD_REQUIRED"
};

export default class User {
  constructor({ email, password, teamId, userId, challengeName, cognitoUser }) {
    this.email = email;
    this.password = password;
    this.teamId = teamId;
    this.isAdmin = !teamId;
    this.userId = userId;
    this.challengeName = challengeName;
    this.cognitoUser = cognitoUser;
  }

  static fromCognitoUser(cognitoUser) {
    const { attributes = {}, challengeName } = cognitoUser;
    return new User({
      email: attributes.email,
      teamId: attributes["custom:teamId"],
      userId: attributes.sub,
      challengeName,
      cognitoUser
    });
  }

  static async getCurrentAuthedUser() {
    const user = await Auth.currentAuthenticatedUser();
    return User.fromCognitoUser(user);
  }

  async confirmSignup({ confirmationCode }) {
    await Auth.confirmSignUp(this.email, confirmationCode);
    await Auth.signIn(this.email, this.password);

    if (this.isAdmin) {
      await Team.create();
    }

    try {
      await this.create();
    } catch (e) {
      console.error("failed to create user", e);
    }
  }

  async activate() {
    await API.post("users", "/activate");
  }

  async create() {
    await API.post("users", "/create");
  }

  async signUp() {
    const teamId = this.teamId || uuid.v1();
    await Auth.signUp({
      username: this.email,
      password: this.password,
      attributes: {
        "custom:teamId": teamId
      }
    });

    return this;
  }

  async signIn() {
    const user = await Auth.signIn(this.email, this.password);
    return User.fromCognitoUser(user);
  }

  async setNewPassword(password) {
    await Auth.completeNewPassword(this.cognitoUser, password);
    try {
      await this.activate();
    } catch (e) {
      console.error("failed to activate user", e);
    }
  }

  requiresPasswordReset() {
    return this.challengeName === CHALLENGE_NAMES.NEW_PASSWORD_REQD;
  }

  async createNewUser({ email }) {
    await API.post("users", "/createNewUser", {
      body: { email }
    });
  }
}
