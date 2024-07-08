import React from "react";
import { MuiTelInput } from "mui-tel-input";
import { get } from "lodash";

export const PhoneNumberTextField = ({ form, field, ...props }) => {
  const { name, value = "" } = field;
  const { handleBlur, touched, errors } = form;
  const {
    label,
    required,
    placeholder,
    size = "small",
    fullWidth = true,
    className,
    displayError = true,
  } = props;
  const handleInput = (value, info) => {
    form.setFieldValue(name, value);
    if (props.codeName) {
      form.setFieldValue(props.codeName, info.countryCallingCode);
    }
  };
  const error = get(touched, field.name) && get(errors, field.name);

  return (
    <MuiTelInput
      id={name}
      name={name}
      className={className}
      value={value || ""}
      label={label}
      error={error}
      helperText={displayError && error}
      required={required}
      placeholder={placeholder}
      fullWidth={fullWidth}
      size={size}
      variant="outlined"
      onChange={handleInput}
      onBlur={handleBlur}
      defaultCountry={"HK"}
    />
  );
};
