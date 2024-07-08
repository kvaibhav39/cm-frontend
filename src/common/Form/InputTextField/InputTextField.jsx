import React from "react";
import { TextField } from "@mui/material";
import { get } from "lodash";

export const InputTextField = ({ form, field, ...props }) => {
  const { name, value = "" } = field;
  const { handleChange, handleBlur, touched, errors } = form;
  const {
    label,
    required,
    multiline,
    placeholder,
    type,
    size = "small",
    fullWidth = true,
    helperText,
    error,
    className,
    disabled,
    inputProps,
    runWhenChange=()=>{}
  } = props;

  return (
    <TextField
      id={name}
      name={name}
      value={value || ""}
      label={label}
      error={error}
      helperText={error || ""}
      className={className}
      required={required}
      multiline={multiline}
      minRows={multiline && 3}
      rowsMax={Infinity} //will remove scroll and expand as per the content
      placeholder={placeholder}
      type={type}
      fullWidth={fullWidth}
      size={size}
      disabled={disabled}
      variant="outlined"
      onChange={(e) => {
        //action log
        if (props.setDisableSubmitBtn) {
          props.setDisableSubmitBtn(false);
        }

        handleChange(e);
        runWhenChange(e)
      }}
      onBlur={handleBlur}
      InputProps={inputProps}
    />
  );
};
