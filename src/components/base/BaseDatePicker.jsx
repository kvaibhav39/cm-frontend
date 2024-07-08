import { get } from "lodash";
import { useState, useEffect, useRef } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { BaseInput, uid } from "./BaseInput";
import { Button, InputAdornment, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";

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

const BaseDatePicker = ({
  label,
  placeholder = "MMM-YYYY",
  views = ["year", "month"],
  inputFormat = "MMMM-yyyy",
  openTo = "year",
  field,
  id = uid(4),
  presentBtn = false,
  form: { touched, errors, setFieldValue, setErrors, values },
  minDate = "",
  maxDate = "",
  sectionData,
  setGapsState,
  runCustom = () => {},
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
  }, [field.value]);

  const handleChange = async (newValue) => {
    if (newValue instanceof Date && !isNaN(newValue)) {
      setFieldValue(field.name, newValue);
      setInnerValue(newValue);

      await Promise.resolve();

      //for employment history page , we will also calculate gaps in the year when a user changes
      //from/to date via calendar
      if (values?.employments || values?.addresses) {
        if (
          label === "From Date*" ||
          label === "To Date*" ||
          label === "From*" ||
          label === "To*"
        ) {
          if (values?.addresses) {
            props?.checkGaps(valuesRef.current, sectionData, setGapsState);
          }
          if (values?.employments) {
            let toUpdateWith = props?.checkGaps(
              valuesRef.current,
              sectionData,
              setGapsState
            );
            setFieldValue("employmentsGaps", toUpdateWith);
          }
        }
      }

      runCustom();
      return;
    } else {
      setInnerValue("");
      setFieldValue(field.name, "");
      return;
    }
  };

  const handleClickPresent = () => {
    handleChange(new Date());
  };

  return (
    <BaseInput id={id} label={label} name={field.name} {...props}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          {...props}
          error={error}
          open={open}
          openTo={openTo}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          name={field.name}
          value={innerValue}
          onBlur={field.handleBlur}
          onChange={handleChange}
          InputAdornmentProps={{ position: "start" }}
          views={views}
          minDate={minDate || moment("1/1/1930").toDate()}
          maxDate={maxDate || moment(Date.now()).toDate()}
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
          InputProps={{
            endAdornment: presentBtn ? (
              <InputAdornment position="end">
                <Button onClick={handleClickPresent}>Present</Button>
              </InputAdornment>
            ) : null,
          }}
        />
      </LocalizationProvider>
    </BaseInput>
  );
};

export { BaseDatePicker };
