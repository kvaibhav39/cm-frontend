import { get } from "lodash";
import { useEffect, useState } from "react";
import { BaseInput, uid } from "./BaseInput";
import { Autocomplete, TextField } from "@mui/material";

const BaseAutocomplete = ({
  field,
  label,
  textFieldLabel,
  renderInput,
  renderOption,
  wrapper = {},

  id = uid(4),
  options = [],
  itemValue = "value",
  itemLabel = "label",
  onChange = () => {},

  form: { touched, errors, setFieldValue },
  helperText = "",
  runWhenSelect = () => {},
  ...props
}) => {
  const [innerOption, setInnerOption] = useState(() => {
    if (!field.value) return null;
    return (
      options.find((option) => {
        return get(option, itemValue) === field.value;
      }) || null
    );
  });
  const error = !!get(touched, field.name) && !!get(errors, field.name);

  useEffect(() => {
    if (
      field.name.includes("qualifications") &&
      field.name.includes("institutePhoneCountryCode") &&
      localStorage.getItem("qualificationsPhoneCode")
    ) {
      //will display the phone code in the ui field
      setInnerOption(localStorage.getItem("qualificationsPhoneCode"));
    }
  }, [localStorage.getItem("qualificationsPhoneCode")]);

  useEffect(() => {
    let temp;

    if (!field.value) {
      temp = null;
    } else {
      temp =
        options.find((option) => {
          return get(option, itemValue) === field.value;
        }) || null;
    }
    setInnerOption((prev) => (prev = temp));
  }, [options, field, itemValue]);

  return (
    <BaseInput id={id} label={label} name={field.name} {...wrapper} {...props}>
      <Autocomplete
        id={id}
        disableClearable
        name={field.name}
        value={innerOption || ""}
        options={options}
        onBlur={field.handleBlur}
        renderOption={renderOption}
        onChange={(_, option) => {
          setInnerOption(option);
          setFieldValue(field.name, get(option, itemValue));
          onChange(_, option, field.name);
          runWhenSelect(get(option, itemValue));

          if (
            field.name.includes("qualifications") &&
            field.name.includes("countryId")
          ) {
            //setting the new phone code as per the country selected
            onChange(
              _,
              option.phoneCode,
              `qualifications.${field.name[15]}.institutePhoneCountryCode`
            );

            setFieldValue(
              `qualifications.${field.name[15]}.institutePhoneCountryCode`,
              option.phoneCode
            );

            //saving the phone code in the LS , so that we could listen to it and display it in the ui using setInnerOption
            localStorage.setItem("qualificationsPhoneCode", option.phoneCode);
          }
        }}
        isOptionEqualToValue={(a, b) => {
          return get(a, itemValue) === get(b, itemValue);
        }}
        getOptionLabel={(v) => {
          if (typeof v === "object") return get(v, itemLabel, "");
          return get(
            options.find((option) => {
              return get(option, itemValue) == v;
            }),
            itemLabel,
            ""
          );
        }}
        renderInput={
          renderInput
            ? (params) => renderInput({ ...params, id, error })
            : (params) => (
                <TextField
                  {...params}
                  id={id}
                  error={error}
                  helperText={helperText}
                  size="small"
                  variant="outlined"
                  label={textFieldLabel}
                />
              )
        }
        {...props}
      />
    </BaseInput>
  );
};

export { BaseAutocomplete };
