import React from "react";
import Dashboard from "./Dashboard";
import { Link } from "react-router-dom";

function Lander() {
  return (
    <div>
      <Link to="/login" className="btn btn-info btn-lg">
        Login
      </Link>
      <Link to="/signup" className="btn btn-success btn-lg">
        Signup
      </Link>
    </div>
  );
}

function Home({ isAuthenticated }) {
  return isAuthenticated ? <Dashboard /> : <Lander />;
}

export default Home;
