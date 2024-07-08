import { Switch } from "@mui/material";
import React from "react";

const SwitchField = ({ form, field, ...props }) => {
  const { name, value } = field;
  const { setFieldValue } = form;

  return (
    <Switch
      {...props}
      name={name}
      label={name}
      onChange={(e) => setFieldValue(name, !value)}
      size="small"
      onClick={(e) => e.stopPropagation()}
      checked={value}
    />
  );
};

export default SwitchField;
