import { Autocomplete, Grid, TextField } from "@mui/material";
import "../../../assets/scss/Package.scss";

export const AutoCompleteWithCustomChips = ({ form, field, ...props }) => {
  const { name, value = [] } = field;
  const { setFieldValue } = form;

  return (
    <Grid container display="flex" justifyContent="center" columns={16}>
      <Grid
        item
        xs={12}
        display={"flex"}
        className={"text-center min-width-100"}
      >
        <Autocomplete
          // sx={{ minWidth: 700 }}
          style={{ margin: "10px 0" }}
          // fullWidth={{ sm: 700 }}
          fullWidth
          multiple
          id="tags-outlined"
          name="tags-outlined"
          options={value}
          defaultValue={[...value]}
          freeSolo
          autoSelect
          onChange={(e, newValue) =>
            setFieldValue(
              `questions[${props.QuesIndex}].answerChoice.ratingCriteriaText`,
              newValue
            )
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Add New Criteria"
              placeholder="Tags"
              value={value || ""}
              required={value?.length === 0}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};
