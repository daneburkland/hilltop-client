import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { Auth } from "aws-amplify";
import LoaderButton from "shared/components/LoaderButton";
import uuid from "uuid";
import "./Signup.css";
import { useParams } from "react-router-dom";

function Signup(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [newUser, setNewUser] = useState(null);
  const { teamId } = useParams();

  function validateForm() {
    return (
      email.length > 0 && password.length > 0 && password === confirmPassword
    );
  }

  function validateConfirmationForm() {
    return confirmationCode.length > 0;
  }

  const handleChange = event => {
    const { value, id } = event.target;
    switch (id) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      case "confirmationCode":
        setConfirmationCode(value);
        break;
      default:
        return null;
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const newUser = await Auth.signUp({
        username: email,
        password: password,
        attributes: {
          "custom:teamId": teamId || uuid.v1()
        }
      });

      setNewUser(newUser);
    } catch (e) {
      alert(e.message);
    }

    setIsLoading(false);
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.confirmSignUp(email, confirmationCode);
      await Auth.signIn(email, password);

      props.userHasAuthenticated(true);
      props.history.push("/");
    } catch (e) {
      alert(e.message);
    }
    setIsLoading(false);
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmationSubmit}>
        <Form.Group controlId="confirmationCode" bsSize="large">
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control
            autoFocus
            type="tel"
            value={confirmationCode}
            onChange={handleChange}
          />
          <Form.Text>Please check your email for the code.</Form.Text>
        </Form.Group>
        <LoaderButton
          block
          bsSize="large"
          disabled={!validateConfirmationForm()}
          type="submit"
          isLoading={isLoading}
          text="Verify"
          loadingText="Verifying…"
        />
      </form>
    );
  }

  function renderForm() {
    return (
      <form>
        <Form.Group controlId="email" bsSize="large">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={email}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="password" bsSize="large">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={password}
            onChange={handleChange}
            type="password"
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword" bsSize="large">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            value={confirmPassword}
            onChange={handleChange}
            type="password"
          />
        </Form.Group>
        <LoaderButton
          block
          bsSize="large"
          disabled={!validateForm()}
          type="submit"
          isLoading={isLoading}
          text="Signup"
          loadingText="Signing up…"
          onClick={handleSubmit}
        />
      </form>
    );
  }

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}

export default Signup;
