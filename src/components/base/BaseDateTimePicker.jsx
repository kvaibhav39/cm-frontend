import { get } from "lodash";
import { useState, useEffect, useRef } from "react";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { BaseInput, uid } from "./BaseInput";
import { Button, InputAdornment, TextField } from "@mui/material";
import moment from "moment";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const textFieldStyle = {
  "button svg": {
    width: "22px",
    height: "22px",
  },
  div: {
    margin: "0",
  },
  button: {
    margin: "0",
  },
  input: {
    borderRadius: 0,
    paddingLeft: "6px !important",
    // borderLeft: "1px solid #C4C4C4",
  },
};

const BaseDateTimePicker = ({
  label,
  placeholder = "DD-MMM-YYYY hh:mm:ss aa",
  inputFormat = "dd-MMM-yyyy hh:mm:ss aa",
  views = ["year", "month", "day", "hours", "minutes", "seconds"],
  field,
  id = uid(4),
  form: { touched, errors, setFieldValue, setErrors, values },
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [innerValue, setInnerValue] = useState(field.value || "");

  const valuesRef = useRef();
  valuesRef.current = values;

  const error = !!get(touched, field.name) && !!get(errors, field.name);

  useEffect(() => {
    setInnerValue(field.value || "");
    setFieldValue(field.name, field.value || "");
  }, []);

  const handleChange = async (newValue) => {
    if (newValue instanceof Date && !isNaN(newValue)) {
      setFieldValue(field.name, newValue);
      setInnerValue(newValue);

      await Promise.resolve();
    } else {
      setInnerValue("");
      setFieldValue(field.name, "");
      return;
    }
  };

  return (
    <BaseInput id={id} label={label} name={field.name} {...props}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          {...props}
          error={error}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          name={field.name}
          value={innerValue}
          onBlur={field.handleBlur}
          onChange={handleChange}
          InputAdornmentProps={{ position: "start" }}
          views={views}
          inputFormat={inputFormat}
          disableMaskedInput
          renderInput={(params) => (
            <TextField
              {...params}
              id={id}
              error={error}
              size="small"
              inputProps={{
                ...params.inputProps,
                placeholder: placeholder,
              }}
              variant="outlined"
              sx={textFieldStyle}
              onClick={() => setOpen(true)}
            />
          )}
        />
      </LocalizationProvider>
    </BaseInput>
  );
};

export { BaseDateTimePicker };
