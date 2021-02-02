import { useState, useCallback, useEffect, useMemo } from "react";

const validateById = (id, value, values, schema, setErrors) => {
  if (schema) {
    try {
      schema.validateSyncAt(id, { ...values, [id]: value });
      setErrors((oldErrors) => [...oldErrors.filter((e) => e.id !== id)]);
    } catch ({ errors }) {
      const msgs = Array.isArray(errors) ? errors[0] : errors;
      setErrors((oldErrors) => [
        ...oldErrors.filter((e) => e.id !== id),
        { id, msgs },
      ]);
    }
  }
};

const validateDefault = (defaultValues, schema) => {
  let foundErrors = [];
  if (schema) {
    Object.entries(defaultValues).forEach(([id, value]) => {
      try {
        if (id.indexOf("__") === 0) return;
        schema.validateSyncAt(id, defaultValues);
      } catch ({ errors }) {
        const msgs = Array.isArray(errors) ? errors[0] : errors;
        foundErrors.push({ id, msgs });
      }
    });
  }
  return foundErrors;
};

const validateForm = (errors) => errors.length > 0;

function useForm(callback, defaultValues, schema) {
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState(validateDefault(defaultValues, schema));
  const [disable, setDisable] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const validateValue = useCallback(
    (id, value, values) => {
      validateById(id, value, values, schema, setErrors);
    },
    [schema]
  );

  /**
   * updates entry in value collection by id and validates
   */
  const changeValue = useCallback(
    function (id, value) {
      if (!id) {
        throw new Error(
          "no name provided to handleChange. input must have either a name or an id"
        );
      }

      setValues((oldValues) => {
        validateValue(id, value, oldValues);
        return {
          ...oldValues,
          [id]: value,
        };
      });
    },
    [validateValue]
  );

  /**
   * handles input fields with an explicit name or uses the name attribute on the target
   * this method doesn't play well nice with child state handlers
   */
  const handleChange = useCallback(
    function (event) {
      if (typeof event === "object") {
        const id = event.target.name || event.target.id;
        const value = event.target.value;
        changeValue(id, value);
      } else {
        return function (e) {
          const id = event;
          const { value } = e.target;
          changeValue(id, value);
        };
      }
    },
    [changeValue]
  );

  const hasError = useCallback(
    (id) => showErrors && errors.findIndex((e) => e.id === id) >= 0,
    [errors, showErrors]
  );

  const handleSubmit = useCallback(
    function (event) {
      if (event) event.preventDefault();

      if (schema) {
        setShowErrors(true);
        if (!validateForm(errors) && !disable) {
          callback(values);
        }
      } else {
        callback(values);
      }
    },
    [callback, disable, errors, schema, values]
  );

  const resetForm = useCallback(
    function () {
      setValues({ ...defaultValues });
      setErrors(validateDefault(defaultValues, schema));
      setShowErrors(false);
    },
    [defaultValues, schema]
  );

  /**
   * sets disable if form has errors
   */
  useEffect(() => {
    setDisable(validateForm(errors));
  }, [errors]);

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
    hasError,
    disable,
    resetForm,
  };
}

export default useForm;
