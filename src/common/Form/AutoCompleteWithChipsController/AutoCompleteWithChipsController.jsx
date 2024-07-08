import { Autocomplete, Grid, TextField } from "@mui/material";
import "../../../assets/scss/Package.scss";
import { useState, useEffect, useCallback } from "react";
import { get } from "lodash";

export const AutoCompleteWithChipsController = ({ form, field, ...props }) => {
  let { name, value = [] } = field;
  const { setFieldValue, errors, touched } = form;
  const {
    wrapperObject,
    checkId,
    countriesData,
    jurisdictionId,
    disabled = false,
    showFormikError = false,
    flipDropdown = false,
  } = props;
  const [options, setOptions] = useState((prev) => (prev = countriesData));

  useEffect(() => {
    value = wrapperObject
      ? wrapperObject?.find((curr) => curr.checkId === checkId)?.checkScope
          ?.jurisdictionId
      : jurisdictionId;

    // let newOptions = countriesData.filter(
    //   (option) => !value?.includes(option?.value)
    // );

    // setOptions((prev) => (prev = newOptions));
    setOptions(countriesData);
  }, [wrapperObject, jurisdictionId, countriesData]);

  const error = get(touched, field.name) && get(errors, field.name);

  return (
    <Grid
      container
      alignItems={"baseline"}
      className={"flex-container align-item-center"}
      // columns={16}
      width="100%"
    >
      <Grid
        item
        xs={12}
        display={"flex"}
        className={"text-center"}
        width="100%"
      >
        <Autocomplete
          // disablePortal
          multiple
          filterSelectedOptions={true}
          id="combo-box-demo-multiple"
          options={options}
          onChange={(event, newValue = [], reason, details) => {
            if (reason === "removeOption") {
              let deleteOption = details.option;
              setFieldValue(
                name,
                newValue.filter((option) => option !== deleteOption.value)
              );
            } else {
              setFieldValue(
                name,
                newValue.map((option) => option.value || option)
              );
            }
          }}
          isOptionEqualToValue={(option, value) =>
            option.value === value.value || option.value === value
          }
          getOptionSelected={(option, value) => {
            option.value === value.value || option.value === value;
          }}
          getOptionLabel={(value) => {
            if (typeof value === "number") {
              return options?.find((item) => item.value === value)?.label;
            } else {
              return value.label;
            }
          }}
          sx={{
            minWidth: { lg2: 800, md: 500, xs: "100%" },
            maxWidth: 1000,
          }}
          value={value || ""}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Select Research Country"
              required={!showFormikError && value?.length === 0}
              error={showFormikError && error}
              helperText={showFormikError && error}
            />
          )}
          disabled={disabled}
          componentsProps={{
            popper: {
              modifiers: [
                {
                  name: "flip",
                  enabled: flipDropdown,
                },
                {
                  name: "preventOverflow",
                  enabled: flipDropdown,
                },
              ],
            },
          }}
        />
      </Grid>
    </Grid>
  );
};
