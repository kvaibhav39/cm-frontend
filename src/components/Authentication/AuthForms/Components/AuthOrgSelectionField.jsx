import { FastField } from "formik";
import { BaseAutocomplete } from "../../../base/BaseAutocomplete";
import { Grid } from "@mui/material";

const AuthOrgSelectionField = ({
  orgLists,
  id,
  fieldName,
  fieldItemLabel,
  fieldItemValue,
  fieldTextFieldLabel,
}) => {
  return (
    <Grid container xs={12} mt={1}>
      <FastField
        id={id}
        options={orgLists}
        component={BaseAutocomplete}
        name={fieldName}
        textFieldLabel={fieldTextFieldLabel}
        itemLabel={fieldItemLabel}
        itemValue={fieldItemValue}
        filterOptions={(options, { inputValue }) =>
          inputValue?.length
            ? options?.filter((option) =>
                option[fieldItemLabel]
                  .toLowerCase()
                  .includes(inputValue.toLowerCase())
              )
            : options
        }
      />
    </Grid>
  );
};

export default AuthOrgSelectionField;
