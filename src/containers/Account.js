import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Team from "shared/classes/Team";

function UserDetails({ currentUser }) {
  return (
    <div className="mb-5">
      <h2>User Details</h2>
      <form>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            readOnly
            value={currentUser && currentUser.email}
            className="form-control-plaintext"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
}

function TeamDetails() {
  const [team, setTeam] = useState({});
  const [loading, setLoading] = useState(null);
  async function fetchTeam() {
    setLoading(true);
    const team = await Team.fetch();
    setTeam(team);
    setLoading(false);
  }
  useEffect(() => {
    fetchTeam();
  }, []);
  return (
    <div className="mb-5">
      <h2>Team Details</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          <form className="mb-4">
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Team name</label>
              <input
                type="email"
                readOnly
                value={team.name}
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter team name..."
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </form>
        </>
      )}
    </div>
  );
}

function InviteTeammates({ currentUser }) {
  const [inviteEmail, setInviteEmail] = useState("");
  return (
    <>
      <div className="form-group mb-4">
        <label htmlFor="exampleInputEmail1">Invite teammates:</label>
        <input
          type="email"
          onChange={({ target: { value } }) => setInviteEmail(value)}
          value={inviteEmail}
          className="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Enter email..."
        />
      </div>

      <button
        type="submit"
        onClick={() => currentUser.createNewUser({ email: inviteEmail })}
        className="btn btn-primary"
      >
        Invite
      </button>
    </>
  );
}

function Account({ currentUser }) {
  return (
    <div className="container pt-4">
      <UserDetails currentUser={currentUser} />
      <TeamDetails currentUser={currentUser} />
      <InviteTeammates currentUser={currentUser} />
    </div>
  );
}

export default Account;
