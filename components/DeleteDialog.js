import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";

import useModal from "../hooks/useModal";

export function DeleteDialog({ okHandler }) {
  const { onClickOpen, modalOpen, onClickClose } = useModal();

  return (
    <>
      <IconButton variant="outlined" size="small" onClick={onClickOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={modalOpen}
        onClose={onClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Static Host?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this host?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClickClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onClickClose();
              okHandler();
            }}
            color="primary"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

DeleteDialog.propTypes = {
  okHandler: PropTypes.func,
};
