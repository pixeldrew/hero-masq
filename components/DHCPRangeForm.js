import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";

import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { object, string } from "yup";

import useForm from "../hooks/useForm";

import IPMaskedInput from "./IPMaskedInput";
import { IP_REGEX, LEASE_EXPIRATIONS } from "../lib/constants";

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

const SAVE_RANGE_QUERY = gql`
  mutation SaveDhcpRange(
    $startIp: String!
    $endIp: String!
    $leaseExpiry: String!
  ) {
    saveDHCPRange(startIp: $startIp, endIp: $endIp, leaseExpiry: $leaseExpiry) {
      startIp
      endIp
      leaseExpiry
    }
  }
`;

const GET_RANGE_QUERY = gql`
  query DhcpRange {
    dhcpRange {
      startIp
      endIp
      leaseExpiry
    }
  }
`;

export function DHCPRangeForm({ submitForm }) {
  const [saveDhcpRange, { data: saveData }] = useMutation(SAVE_RANGE_QUERY);

  const { loading, error, data: getData } = useQuery(GET_RANGE_QUERY);

  const defaultDhcpRange = {
    startIp: "",
    endIp: "",
    leaseExpiry: ""
  };

  const { values, handleChange, handleSubmit, hasError, disable } = useForm(
    variables => {
      saveDhcpRange({ variables });
      submitForm && submitForm(variables);
    },
    saveData?.dhcpRange || getData?.dhcpRange || defaultDhcpRange,
    object({
      startIp: string().matches(IP_REGEX, {
        message: "IP Address Required"
      }),
      endIp: string().matches(IP_REGEX, { message: "IP Address Required" }),
      leaseExpiry: string()
    })
  );

  const classes = useStyles();

  if (loading) return <p>Loading</p>;

  if (error) return <p>error</p>;

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
            label="Start Ip"
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
            label="End Ip"
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
            disabled={disable}
          >
            Save
          </Button>
        </CardActions>
      </form>
    </Card>
  );
}

DHCPRangeForm.propTypes = {
  submitForm: PropTypes.func
};
