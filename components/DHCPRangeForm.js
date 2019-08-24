import React from "react";

import MaskedInput from "react-text-mask";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

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

const maskedProps = {
  guide: false,
  mask: value => Array(value.length).fill(/[\d\/.]/),
  pipe: value => {
    if (value === "." || value === "/" || value.endsWith("..")) return false;

    const parts = value.split(".");

    if (parts[parts.length - 1] && parts[parts.length - 1].indexOf("/") > 0) {
      const cidr = parts[parts.length - 1].split("/");
      if (cidr[1] > 32) {
        return false;
      }
    }

    if (
      parts.length > 4 ||
      parts.some(part => part === "00" || part < 0 || part > 255)
    ) {
      return false;
    }

    return value;
  }
};

function IPMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      {...maskedProps}
    />
  );
}

export function DHCPRangeForm(props) {
  const { values, handleChange, handleSubmit } = useForm(submitForm);

  const classes = useStyles();

  return (
    <form
      className={classes.container}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      Start Ip
      <TextField
        label="Start Ip Range"
        className={classes.textField}
        value={values.startIpRange}
        onChange={handleChange("startIpRange")}
        margin="normal"
        variant="outlined"
        inputComponent={IPMaskCustom}
      />
      End IP
      <TextField
        label="End Ip Range"
        className={classes.textField}
        value={values.endIpRange}
        onChange={handleChange("endIpRange")}
        margin="normal"
        variant="outlined"
        inputComponent={IPMaskCustom}
      />
      <Button variant="contained" color="primary" className={classes.button}>
        Add
      </Button>
    </form>
  );
}
