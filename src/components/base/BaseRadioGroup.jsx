import { get } from "lodash";
import { useState } from "react";
import { BaseInput, uid } from "./BaseInput";
import { Radio, RadioGroup, FormControlLabel, Typography } from "@mui/material";
import { useEffect } from "react";

const BaseRadioGroup = ({
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
  savedValue = "",
  takeInputInNumber = false,
  ...props
}) => {
  const [innerValue, setInnerValue] = useState(field.value || savedValue || "");

  useEffect(() => {
    setInnerValue(field.value || savedValue || "");
  }, [field, savedValue]);

  return (
    <BaseInput id={id} label={label} name={field.name}>
      <RadioGroup
        row
        name={field.name}
        value={innerValue || ""}
        onBlur={field.handleBlur}
        onChange={(event) => {
          setInnerValue(
            takeInputInNumber ? +event.target.value : event.target.value
          );
          setFieldValue(
            field.name,
            takeInputInNumber ? +event.target.value : event.target.value
          );
        }}
        sx={{
          "& .MuiSvgIcon-root": {
            fontSize: size,
          },
        }}
      >
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            control={<Radio />}
            value={get(option, optionValue) || ""}
            label={
              <Typography component="span" {...labelProps}>
                {get(option, optionLabel)}
              </Typography>
            }
          />
        ))}
        {children}
      </RadioGroup>
    </BaseInput>
  );
};

export { BaseRadioGroup };
