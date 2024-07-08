import { get } from "lodash";
import { useState } from "react";
import { BaseInput, uid } from "./BaseInput";
import {
  Checkbox,
  FormGroup,
  Typography,
  FormControlLabel,
} from "@mui/material";
import { useEffect } from "react";

const BaseCheckboxGroup = ({
  field,
  label,
  children,
  optionValue = "value",
  optionLabel = "label",
  size = "1.5rem",
  labelProps = {
    fontSize: "0.875rem",
  },

  id = uid(4),
  options = [],

  form: { setFieldValue },
}) => {
  const [innerValue, setInnerValue] = useState(
    Array.isArray(field.value) ? field.value : []
  );

  useEffect(() => {
    setInnerValue(Array.isArray(field.value) ? field.value : []);
  }, [field]);

  const handleOnChange = (value) => () => {
    const newValue = innerValue.includes(value)
      ? innerValue.filter((v) => v !== value)
      : [...innerValue, value];
    setInnerValue(newValue);
    setFieldValue(field.name, newValue);
  };

  return (
    <BaseInput id={id} label={label} name={field.name}>
      <FormGroup
        row
        name={field.name}
        value={innerValue || ""}
        onBlur={field.handleBlur}
        sx={{
          "& .MuiSvgIcon-root": {
            fontSize: size,
          },
        }}
      >
        {options.map((option, index) => {
          const value = get(option, optionValue);
          return (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={innerValue.includes(value)}
                  onChange={handleOnChange(value)}
                />
              }
              label={
                <Typography component="span" {...labelProps}>
                  {get(option, optionLabel)}
                </Typography>
              }
            />
          );
        })}
        {children}
      </FormGroup>
    </BaseInput>
  );
};

export { BaseCheckboxGroup };
