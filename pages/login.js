import React from "react";

import stringify from "qs-stringify";

import SignIn from "../components/SignIn";

const submitForm = async ({ username, password }) => {
  const loginData = await fetch(process.env.HOST_URL + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: stringify({ username, password })
  });

  const result = await loginData.json();

  window.location = result.redirect;
};

const Login = props => <SignIn submitForm={submitForm} />;

export default Login;
