import { useState, useEffect } from "react";

function useForm(callback, defaultValues, schema) {
  const [values, setValues] = useState({ ...defaultValues });
  const [errors, setErrors] = useState([]);
  const [validateOnChange, setValidateOnChange] = useState(false);

  async function validate() {
    if (schema) {
      const errors = await catchErrors();
      if (errors.length > 0) {
        setErrors([...errors]);
        return false;
      }

      setErrors([]);
    }

    return true;
  }

  async function catchErrors() {
    let caughtErrors = [];
    for (let [id] of Object.entries(values)) {
      if (id === "__typename") continue; // apollo sends this key back
      try {
        await schema.validateAt(id, values);
      } catch ({ errors }) {
        const msgs = Array.isArray(errors) ? errors[0] : errors;
        caughtErrors.push({
          id,
          msgs
        });
      }
    }

    return caughtErrors;
  }

  async function handleSubmit(event) {
    if (event) event.preventDefault();

    if (schema) {
      setValidateOnChange(true);
      if (await validate()) {
        callback(values);
      }
    } else {
      callback(values);
    }
  }

  function handleChange(name) {
    if (name.target) {
      name.persist();
      const key = name.target.name || name.target.id;

      if (!key) {
        throw new Error(
          "no name provided to handleChange. input must have either a name or an id"
        );
      }

      setValues(values => ({
        ...values,
        [key]: name.target.value
      }));
    } else {
      return event => {
        event.persist();

        setValues(values => ({
          ...values,
          [name]: event.target.value
        }));
      };
    }
  }

  useEffect(() => {
    validateOnChange && validate();
  }, [values]);

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
    hasError: id => errors.findIndex(e => e.id === id) >= 0
  };
}

export default useForm;
