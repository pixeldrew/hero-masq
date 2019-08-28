import React from "react";
import SignIn from "../components/SignIn";
import stringify from "qs-stringify";

const submitForm = async ({ username, password }) => {
  const loginData = await fetch(process.env.HOST_URL + "login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: stringify({ username, password })
  });

  const result = await loginData.json();

  console.log("result", result);

  window.location = result.redirect;
};

const Login = props => <SignIn submitForm={submitForm} />;

export default Login;
