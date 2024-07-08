import {
  Autocomplete,
  Chip,
  Grid,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import "../../../assets/scss/Package.scss";
import { useSelector } from "react-redux";

export const AutoCompleteIndustry = ({ form, field, ...props }) => {
  const { name, value = [] } = field;
  const { setFieldValue, handleBlur } = form;
  const [option, SetOption] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const { allIndustries } = useSelector((state) => state.organizations);

  useEffect(() => {
    if (allIndustries?.length) {
      SetOption(allIndustries);
    }
  }, [allIndustries]);

  return (
    <Grid
      item
      xs={12}
      md={12}
      sx={{
        margin: props?.margin || "1rem",
        justifyContent: "center",
      }}
    >
      <Autocomplete
        multiple
        filterSelectedOptions
        id="industriesId"
        name="industriesId"
        type="industriesId"
        options={option}
        onBlur={handleBlur}
        onChange={(c, key, reason, details) => {
          if (reason === "removeOption") {
            let deleteOption = details.option;
            let options = selectedIndustries;
            let newOptions = options.filter(
              (industry) => industry !== deleteOption.id
            );
            setSelectedIndustries(newOptions);
            setFieldValue(name, newOptions);
          } else {
            key?.map((option) => {
              let duplicate = selectedIndustries.includes(option.id);
              let newOptions = duplicate
                ? [...selectedIndustries]
                : [...selectedIndustries, option.id];
              setSelectedIndustries(newOptions);
              setFieldValue(name, newOptions);
            });
          }
        }}
        sx={{ width: "100%" }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Industry"
            size="small"
            error={props.error}
            helperText={props.error || ""}
          />
        )}
        ListboxProps={{
          style: {
            maxHeight: "200px",
          },
        }}
      />
    </Grid>
  );
};
