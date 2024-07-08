import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { TextField, Button, InputAdornment, Box } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { isValid } from "date-fns";
import { formatDate } from "../../../utils/formatDate";

const Wrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

export default function LaptopDatePicker({
  setFormikFieldvalue,
  name,
  label,
  views = ["year", "month", "day"],
  inputFormat = "dd-MMM-yyyy",
  required,
  error,
  endAdornmentRequired = false,
  maxDate = new Date(),
  minDate = undefined,
}) {
  const [value, setValue] = useState(null);
  const [presentClicked, setPresentClicked] = useState(false);

  const handleChange = (newValue) => {
    const d = formatDate(newValue);
    let date = `${d[3]}-01-${d[2]}`;
    if (views.includes("day")) {
      date = `${d[3]}-${d[0]}-${d[2]}`;
    }
    setValue(newValue);
    setFormikFieldvalue(name, date);
    setPresentClicked(false);
  };

  return (
    <Wrapper>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
          InputAdornmentProps={{ position: "start" }}
          InputProps={{
            endAdornment: endAdornmentRequired ? (
              <InputAdornment position="end">
                {
                  <Button
                    disabled={presentClicked}
                    onClick={() => {
                      setPresentClicked(true);
                      setValue(null);
                      setFieldValue(name, null);
                    }}
                  >
                    Present
                  </Button>
                }
              </InputAdornment>
            ) : null,
          }}
          label={label}
          views={views}
          inputFormat={inputFormat}
          value={value || ""}
          onChange={handleChange}
          maxDate={maxDate}
          minDate={minDate}
          renderInput={(params) => (
            <TextField
              disabled={true}
              size="small"
              required={required}
              error={error}
              helperText={error}
              fullWidth
              {...params}
            />
          )}
          PopperProps={{
            placement: "top",
          }}
        />
      </LocalizationProvider>
    </Wrapper>
  );
}

export const LaptopDatePicker2 = ({
  value,
  name,
  label,
  views = ["year", "month", "day"],
  inputFormat = "dd-MMM-yyyy",
  required,
  error,
  endAdornmentRequired = false,
  maxDate,
  minDate,
  onChange = () => {},
  setFormikFieldvalue = () => {},
  fullWidth = true,
}) => {
  const [mValue, setValue] = useState(null);
  const [presentClicked, setPresentClicked] = useState(false);

  const handleChange = (newValue) => {
    if (isValid(newValue)) {
      const d = formatDate(newValue);
      let date = `${d[3]}-01-${d[2]}`;
      if (views.includes("day")) {
        date = `${d[3]}-${d[0]}-${d[2]}`;
      }
      setValue(newValue);
      onChange(newValue);
      setFormikFieldvalue(name, date);
      setPresentClicked(false);
      error = false;
    } else {
      error = true;
    }
  };

  useEffect(() => {
    value && setValue(value);
  }, [value]);

  return (
    <Wrapper>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
          InputAdornmentProps={{ position: "start" }}
          InputProps={{
            endAdornment: endAdornmentRequired ? (
              <InputAdornment position="end">
                <Button
                  disabled={presentClicked}
                  onClick={() => {
                    setPresentClicked(true);
                    setValue(null);
                    setFieldValue(name, null);
                  }}
                />
              </InputAdornment>
            ) : null,
          }}
          views={views}
          inputFormat={inputFormat}
          value={mValue || ""}
          onChange={handleChange}
          maxDate={maxDate}
          minDate={minDate}
          renderInput={(params) => (
            <TextField
              {...params}
              required={required}
              error={error}
              helperText={error}
              // disabled={presentClicked}
              inputProps={{ ...params.inputProps, readOnly: true }}
              disabled={true}
              size="small"
              fullWidth={fullWidth}
              sx={{
                button: {
                  margin: "0",
                  padding: "4px",
                },
                "button svg": {
                  width: "22px",
                  height: "22px",
                },
                div: {
                  margin: "0",
                },
                input: {
                  borderRadius: 0,
                  padding: "6px !important",
                  border: "none",
                  borderLeft: "1px solid #C4C4C4",
                },
              }}
            />
          )}
          PopperProps={{
            placement: "top",
          }}
        />
      </LocalizationProvider>
    </Wrapper>
  );
};
