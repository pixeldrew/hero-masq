import React, { useState, useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import LabelIcon from "@material-ui/icons/Label";
import PropTypes from "prop-types";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

export default function TagInput({ name, tags, onChange }) {
  const [currentTagInput, setTagInput] = useState("");
  const classes = useStyles();

  const tagData =
    tags
      ?.split(",")
      .filter((x) => x)
      .map((x) => ({ key: x, value: x })) ?? [];

  const addTag = useCallback(() => {
    const oldTags = tags ?? "";
    const value = [
      ...new Set(oldTags.split(",").concat(currentTagInput.split(","))),
    ]
      .filter((x) => x)
      .join(",");

    setTagInput("");
    onChange({
      persist: () => {},
      target: {
        name,
        value,
      },
    });
  }, [currentTagInput, name, onChange, tags]);

  const handleDelete = (tagToDelete) => () => {
    const value = tags
      .split(",")
      .filter((chip) => chip !== tagToDelete.key)
      .join(",");
    onChange({
      persist: () => {},
      target: {
        name,
        value,
      },
    });
  };

  return (
    <>
      <FormControl variant="outlined">
        <OutlinedInput
          id="host"
          placeholder="Tags"
          className={classes.textField}
          value={currentTagInput}
          onChange={(e) => setTagInput(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton aria-label="add tag" onClick={addTag}>
                <LabelIcon />
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText id="outlined-tags-helper-text">
          Tags can be used to add additional configs to dhcp-hosts
        </FormHelperText>
      </FormControl>
      <ul className={classes.root}>
        {tagData.map((data) => (
          <li key={data.key}>
            <Chip label={data.value} onDelete={handleDelete(data)} />
          </li>
        ))}
      </ul>
    </>
  );
}

TagInput.defaultProps = {
  tags: "",
  name: "tags",
};

TagInput.propTypes = {
  onChange: PropTypes.func,
  tags: PropTypes.string,
  name: PropTypes.string,
};
