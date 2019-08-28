import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";

import useForm from "../hooks/useForm";
import IPMaskedInput from "./IPMaskedInput";

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

const leaseExpirations = [
  {
    value: "15m",
    label: "15 minutes"
  },
  {
    value: "30m",
    label: "45 minutes"
  },
  {
    value: "45m",
    label: "45 minutes"
  },
  {
    value: "1h",
    label: "1 hour"
  },
  {
    value: "2h",
    label: "2 hours"
  },
  {
    value: "4h",
    label: "4 hours"
  },
  {
    value: "8h",
    label: "8 hours"
  },
  {
    value: "1d",
    label: "1 day"
  },
  {
    value: "1w",
    label: "1 week"
  },
  {
    value: "infinite",
    label: "Infinite"
  }
];

export function StaticHostForm({ submitForm }) {
  const { values, handleChange, handleSubmit } = useForm(submitForm, {
    macAddress: "",
    ipAddress: "",
    hostName: "",
    clientId: "",
    leaseExpiry: leaseExpirations[0].value
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
            {leaseExpirations.map(option => (
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
