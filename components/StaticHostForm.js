import React, { useCallback } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";

import useForm from "../hooks/useForm";
import IPMaskedInput from "./IPMaskedInput";
import TagInput from "./TagInput";
import { LEASE_EXPIRATIONS, IP_REGEX } from "../lib/constants";
import { object, string } from "yup";
import IconButton from "@material-ui/core/IconButton";
import { CloseIcon } from "@material-ui/data-grid";
import Box from "@material-ui/core/Box";

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
  dialogTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dialog: {
    width: "100%",
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
      tags: "",
    },
    object({
      id: string(),
      ip: string().matches(IP_REGEX, { message: "IP Address Required" }),
      mac: string(),
      host: string(),
      client: string(),
      leaseExpiry: string(),
      tags: string(),
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
      <DialogTitle className={classes.dialog}>
        <Box display="flex" alignItems="center">
          <Box flexGrow={1}>Static Host</Box>
          <Box>
            <IconButton onClick={cancelForm}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText></DialogContentText>
        <TextField
          id="ip"
          required
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
          id="lease-expiry"
          select
          label="Expires"
          error={hasError("leaseExpiry")}
          className={classes.textField}
          value={values.leaseExpiry}
          onChange={useCallback(handleChange("leaseExpiry"), [values])}
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

        <TagInput name="tags" tags={values.tags} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          type="submit"
        >
          {edit ? `Save` : `Add`}
        </Button>
      </DialogActions>
    </form>
  );
}

StaticHostForm.propTypes = {
  submitForm: PropTypes.func,
  cancelForm: PropTypes.func,
  currentHost: PropTypes.object,
  edit: PropTypes.bool,
};
