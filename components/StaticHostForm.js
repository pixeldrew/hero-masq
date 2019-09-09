import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";

import useForm from "../hooks/useForm";
import IPMaskedInput from "./IPMaskedInput";
import { LEASE_EXPIRATIONS } from "../lib/constants";

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
  },
  menu: {
    width: 200
  }
}));

export function StaticHostForm({ submitForm }) {
  const { values, handleChange, handleSubmit } = useForm(submitForm, {
    macAddress: "",
    ipAddress: "",
    hostName: "",
    clientId: "",
    leaseExpiry: LEASE_EXPIRATIONS[0].value
  });

  const classes = useStyles();

  return (
    <Card>
      <form
        className={classes.container}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <CardContent>
          <TextField
            id="ipAddress"
            label="IP Address"
            className={classes.textField}
            value={values.ipAddress}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputProps={{
              inputComponent: IPMaskedInput
            }}
          />
          <TextField
            id="hostName"
            label="Host Name"
            className={classes.textField}
            value={values.hostName}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />

          <TextField
            id="macAddress"
            label="MAC Address"
            className={classes.textField}
            value={values.macAddress}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />

          <TextField
            id="clientId"
            label="Client ID"
            className={classes.textField}
            value={values.clientId}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />

          <TextField
            id="lease-expiry"
            select
            label="Expires"
            className={classes.textField}
            value={values.leaseExpiry}
            onChange={handleChange("leaseExpiry")}
            variant="outlined"
            SelectProps={{
              MenuProps: {
                className: classes.menu
              }
            }}
            margin="normal"
          >
            {LEASE_EXPIRATIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </CardContent>
        <CardActions>
          <Button variant="outlined" color="primary" className={classes.button}>
            Add
          </Button>
        </CardActions>
      </form>
    </Card>
  );
}

StaticHostForm.propTypes = {
  submitForm: PropTypes.func
};
