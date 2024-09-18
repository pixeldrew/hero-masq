import React from "react";
import PropTypes from "prop-types";

import MaskedInput from "react-text-mask";

import { ipAddressPipe } from "../lib/ip-address-pipe";

const maskedProps = {
  guide: false,
  mask: (value) => Array(value.length).fill(/[\d\/.]/),
  pipe: ipAddressPipe,
};

export default function IPMaskedInput(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      {...maskedProps}
    />
  );
}

IPMaskedInput.propTypes = {
  inputRef: PropTypes.oneOfType([
    // Either a function
    PropTypes.func,
    // Or the instance of a DOM native element (see the note about SSR)
    PropTypes.shape({ current: PropTypes.instanceOf(PropTypes.element) }),
  ]),
};
