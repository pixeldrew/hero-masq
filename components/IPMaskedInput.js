import React from "react";
import MaskedInput from "react-text-mask";
import { ipAddressPipe } from "../lib/ip-address-pipe";

const maskedProps = {
  guide: false,
  mask: value => Array(value.length).fill(/[\d\/.]/),
  pipe: ipAddressPipe
};

export default function IPMaskedInput(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      {...maskedProps}
    />
  );
}
