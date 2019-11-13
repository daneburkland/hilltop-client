import React, { useState } from "react";
import { Form } from "react-bootstrap";
import LoaderButton from "shared/components/LoaderButton";
import "./Signup.css";

function PasswordReset({ currentUser, history }) {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");

  function validateForm() {
    return password.length > 0;
  }

  const handleChange = event => {
    const { value, id } = event.target;
    switch (id) {
      case "password":
        setPassword(value);
        break;
      default:
        return null;
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await currentUser.setNewPassword(password);
      history.push("/");
    } catch (e) {
      console.log(e);
      alert(e.message);
    }

    setIsLoading(false);
  }

  function renderForm() {
    return (
      <form>
        <Form.Group controlId="password" bsSize="large">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={password}
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
          text="PasswordReset"
          loadingText="Signing up…"
          onClick={handleSubmit}
        />
      </form>
    );
  }

  return <div className="PasswordReset">{renderForm()}</div>;
}

export default PasswordReset;
