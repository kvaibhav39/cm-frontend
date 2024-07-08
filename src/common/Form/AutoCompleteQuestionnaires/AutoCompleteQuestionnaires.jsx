import { Autocomplete, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import "../../../assets/scss/Package.scss";

export const AutoCompleteQuestionnaires = ({ form, field, ...props }) => {
  const { name, value = [] } = field;
  const { setFieldValue } = form;

  return (
    <Grid
      container
      alignItems={"baseline"}
      className={"flex-container align-item-center"}
      columns={16}
    >
      <Grid
        item
        xs={8}
        display={"flex"}
        className={"text-center min-width-100"}
      >
        <Autocomplete
          style={{ paddingRight: "2%" }}
          id="combo-box-ques"
          options={props?.questionnairesData}
          onChange={(event, newValue = []) => {
            setFieldValue(name, newValue?.value);
          }}
          isOptionEqualToValue={(option, value) => option.value === value}
          getOptionLabel={(option) => {
            if (typeof option === "number") {
              return (
                props?.questionnairesData?.find((item) => item.value === option)
                  ?.label || ""
              );
            } else {
              return option?.label || "";
            }
          }}
          sx={{ width: 300 }}
          value={value || ""}
          ListboxProps={{
            style: {
              maxHeight: 200,
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Questionnaire"
              required={value?.length === 0}
              size="small"
            />
          )}
        />
      </Grid>
    </Grid>
  );
};
