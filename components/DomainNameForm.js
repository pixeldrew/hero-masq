import React from "react";
import useForm from "../hooks/useForm";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

export function DomainNameForm({ submitForm }) {
  const { values, handleChange, handleSubmit } = useForm(submitForm, {
    domainName: ""
  });

  const classes = useStyles();

  return (
    <form
      className={classes.container}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <TextField
        id="domainName"
        label="Domain Name"
        className={classes.textField}
        value={values.domainName}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
      />

      <Button variant="contained" color="primary" className={classes.button}>
        Save
      </Button>
    </form>
  );
}
