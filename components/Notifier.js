import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";

let displayed = [];

export function Notifier({ message, time, options = {} }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const storeDisplayed = (id) => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = (id) => {
    displayed = [...displayed.filter((key) => id !== key)];
  };

  useEffect(() => {
    if (message === "") return;

    if (displayed.includes(time)) return;

    enqueueSnackbar(message, {
      key: time,
      ...options,
      onClose: (event, reason, myKey) => {
        if (options.onClose) {
          options.onClose(event, reason, myKey);
        }
      },
      onExited: (event, myKey) => {
        removeDisplayed(myKey);
      },
    });

    storeDisplayed(time);
  }, [message, closeSnackbar, enqueueSnackbar, options, time]);

  return null;
}

Notifier.propTypes = {
  message: PropTypes.string,
  time: PropTypes.string,
  options: PropTypes.object,
};
