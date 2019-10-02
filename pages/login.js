import React, { useState } from "react";

import stringify from "qs-stringify";

import SignIn from "../components/SignIn";

const submitForm = async (setLoginStatus, { username, password }) => {
  try {
    const loginData = await fetch(process.env.HOST_URL + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: stringify({ username, password })
    });

    if (loginData.status === 401) {
      throw new Error("unauthorized");
    }

    setLoginStatus("logging in");

    const {
      data: { redirect }
    } = await loginData.json();

    setLoginStatus("redirecting");

    window.location = redirect;
  } catch (e) {
    setLoginStatus("unauthorized");
  }
};

const Login = function() {
  const [loginStatus, setLoginStatus] = useState(null);

  return (
    <SignIn
      submitForm={submitForm.bind(undefined, setLoginStatus)}
      loginStatus={loginStatus}
    />
  );
};

export default Login;
