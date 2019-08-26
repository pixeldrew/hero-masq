import { useState } from "react";

const useForm = (callback, defaultValues) => {
  const [values, setValues] = useState({ ...defaultValues });

  const handleSubmit = event => {
    if (event) event.preventDefault();
    callback(values);
  };

  const handleChange = name => {
    if (name.target) {
      name.persist();
      const key = name.target.name || name.target.id;
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
  };

  return {
    handleChange,
    handleSubmit,
    values
  };
};

export default useForm;
