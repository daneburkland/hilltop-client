import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { ListGroup, Badge } from "react-bootstrap";

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

function UserRow({ user }) {
  return (
    <ListGroup.Item className="d-flex justify-content-between">
      <div>{user.email}</div>
      <div>
        <Badge variant={`${user.isActive() ? "primary" : "warning"}`}>
          {user.activeStatus}
        </Badge>
      </div>
    </ListGroup.Item>
  );
}

function TeamDetails({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");

  async function fetchTeam() {
    setLoading(true);
    const users = await currentUser.getTeam();
    setUsers(users);
    setLoading(false);
  }

  async function createNewUser() {
    const users = await currentUser.createNewUser({ email: inviteEmail });
    setUsers(users);
  }

  useEffect(() => {
    fetchTeam();
  }, []);
  return (
    <div className="mb-5">
      <h2>Team</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          <ListGroup className="mb-4">
            {users.map(user => (
              <UserRow user={user} key={user.email} />
            ))}
          </ListGroup>

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
            onClick={createNewUser}
            className="btn btn-primary"
          >
            Invite
          </button>
        </>
      )}
    </div>
  );
}

function Account({ currentUser }) {
  return (
    <div className="container pt-4">
      <UserDetails currentUser={currentUser} />
      <TeamDetails currentUser={currentUser} />
    </div>
  );
}

export default Account;
