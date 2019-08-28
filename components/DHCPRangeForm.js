import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IPMaskedInput from "./IPMaskedInput";

import { object, string } from "yup";

import useForm from "../hooks/useForm";

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
      startIpRange: "",
      endIpRange: ""
    },
    object({
      startIpRange: string().required("Start IP is Required"),
      endIpRange: string().required("End IP is Required")
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
            id="startIpRange"
            label="Start IP"
            error={hasError("startIpRange")}
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
            label="End IP"
            error={hasError("endIpRange")}
            className={classes.textField}
            value={values.endIpRange}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputProps={{
              inputComponent: IPMaskedInput
            }}
          />
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
