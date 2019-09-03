import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import { object, string } from "yup";

import useForm from "../hooks/useForm";

import IPMaskedInput from "./IPMaskedInput";
import { LEASE_EXPIRATIONS } from "../lib/constants";

const useStyles = makeStyles(theme => ({
  card: {
    minWidth: 275
  },
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
  const { values, handleChange, handleSubmit, hasError } = useForm(
    submitForm,
    {
      startIp: "",
      endIp: "",
      leaseExpiry: "1d"
    },
    object({
      startIp: string().required("Start IP is Required"),
      endIp: string().required("End IP is Required"),
      leaseExpiry: string()
    })
  );

  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <form
        className={classes.container}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <CardContent>
          <TextField
            id="startIp"
            label="Start IP"
            error={hasError("startIp")}
            className={classes.textField}
            value={values.startIp}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputProps={{
              inputComponent: IPMaskedInput
            }}
          />

          <TextField
            id="endIp"
            label="End IP"
            error={hasError("endIp")}
            className={classes.textField}
            value={values.endIp}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputProps={{
              inputComponent: IPMaskedInput
            }}
          />

          <TextField
            id="lease-expiry"
            select
            label="Lease Expiry"
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
          <Button
            color="primary"
            className={classes.button}
            type="submit"
            variant="outlined"
          >
            Save
          </Button>
        </CardActions>
      </form>
    </Card>
  );
}
