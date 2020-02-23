import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

import { object, string } from "yup";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";

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

const GET_DOMAIN_NAME = gql`
  query GetDomain {
    domain {
      name
    }
  }
`;

const SAVE_DOMAIN_NAME = gql`
  mutation SaveDomain($name: String) {
    saveDomain(name: $name) {
      name
    }
  }
`;

export function DomainNameForm({ submitForm }) {
  const defaultValues = {
    name: ""
  };

  const [saveDomainName, { data: saveData }] = useMutation(SAVE_DOMAIN_NAME);

  const { loading, error, data: getData } = useQuery(GET_DOMAIN_NAME);

  const { values, handleChange, handleSubmit, hasError, disable } = useForm(
    variables => {
      saveDomainName({ variables });
      submitForm && submitForm();
    },
    saveData?.domain || getData?.domain || defaultValues,
    object({
      name: string().required("Domain Name is Required")
    })
  );

  const classes = useStyles();

  if (loading) return <p>Loading</p>;

  if (error) return <p>Error</p>;

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
            id="name"
            label="Domain Name"
            className={classes.textField}
            value={values.name}
            onChange={handleChange}
            error={hasError("name")}
            margin="normal"
            variant="outlined"
          />
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="outlined"
            className={classes.button}
            type="submit"
            disabled={disable}
          >
            Save
          </Button>
        </CardActions>
      </form>
    </Card>
  );
}

DomainNameForm.propTypes = {
  submitForm: PropTypes.func
};
