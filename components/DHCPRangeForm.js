import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IPMaskedInput from "./IPMaskedInput";

import useForm from "../hooks/useForm";

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

export function DHCPRangeForm({ submitForm }) {
  const { values, handleChange, handleSubmit } = useForm(submitForm, {
    startIpRange: "",
    endIpRange: ""
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
        id="startIpRange"
        label="Start Ip"
        className={classes.textField}
        value={values.startIpRange}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
        InputProps={{
          inputComponent: IPMaskedInput
        }}
      />

      <TextField
        id="endIpRange"
        label="End Ip"
        className={classes.textField}
        value={values.endIpRange}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
        InputProps={{
          inputComponent: IPMaskedInput
        }}
      />
      <Button variant="contained" color="primary" className={classes.button}>
        Add
      </Button>
    </form>
  );
}
