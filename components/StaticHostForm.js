import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";

import useForm from "../hooks/useForm";
import IPMaskedInput from "./IPMaskedInput";
import { LEASE_EXPIRATIONS, IP_REGEX } from "../lib/constants";
import { object, string } from "yup";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  menu: {
    width: 200,
  },
}));

export function StaticHostForm({ submitForm, currentHost, edit, cancelForm }) {
  const { values, handleChange, handleSubmit, hasError, resetForm } = useForm(
    (values) => {
      submitForm(values);
      resetForm();
    },
    currentHost || {
      id: "",
      mac: "",
      ip: "",
      host: "",
      client: "",
      leaseExpiry: "24h",
    },
    object({
      id: string(),
      ip: string().matches(IP_REGEX, { message: "IP Address Required" }),
      mac: string(),
      host: string(),
      client: string(),
      leaseExpiry: string(),
    })
  );

  const classes = useStyles();

  return (
    <form
      className={classes.container}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <CardContent>
        <TextField
          id="ip"
          label="IP Address"
          error={hasError("ip")}
          className={classes.textField}
          value={values.ip}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          InputProps={{
            inputComponent: IPMaskedInput,
          }}
        />
        <TextField
          id="host"
          label="Host Name"
          error={hasError("host")}
          className={classes.textField}
          value={values.host}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />

        <TextField
          id="mac"
          label="MAC Address"
          error={hasError("mac")}
          className={classes.textField}
          value={values.mac}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />

        <TextField
          id="client"
          label="Client ID"
          error={hasError("client")}
          className={classes.textField}
          value={values.client}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />

        <TextField
          id="lease-expiry"
          select
          label="Expires"
          error={hasError("leaseExpiry")}
          className={classes.textField}
          value={values.leaseExpiry}
          onChange={handleChange("leaseExpiry")}
          variant="outlined"
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          margin="normal"
        >
          {LEASE_EXPIRATIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </CardContent>
      <CardActions>
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          type="submit"
        >
          {edit ? `Save` : `Add`}
        </Button>
        {edit && (
          <Button
            variant="outlined"
            color="secondary"
            className={classes.button}
            onClick={cancelForm}
          >
            Cancel
          </Button>
        )}
      </CardActions>
    </form>
  );
}

StaticHostForm.propTypes = {
  submitForm: PropTypes.func,
  cancelForm: PropTypes.func,
  currentHost: PropTypes.object,
  edit: PropTypes.bool,
};
