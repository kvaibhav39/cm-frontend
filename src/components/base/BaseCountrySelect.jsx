import { Box } from "@mui/material";
import { BaseAutocomplete } from "./BaseAutocomplete";
import { useDispatch, useSelector } from "react-redux";
import { getAllCountries } from "../../store/actions/helperActions";
import { useEffect } from "react";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction.js";

const BaseCountrySelect = (props) => {
  const { allCountries } = useSelector((state) => state.helper);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!allCountries) {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      dispatch(getAllCountries(logDetails));
    }
  }, []);

  return (
    allCountries && (
      <BaseAutocomplete
        {...props}
        options={allCountries}
        itemLabel="name"
        itemValue="countryMasterId"
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{
              "& > img": {
                mr: 2,
                flexShrink: 0,
              },
            }}
            {...props}
          >
            <img
              alt=""
              width="20"
              loading="lazy"
              src={`https://flagcdn.com/w20/${option.iso.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/w40/${option.iso.toLowerCase()}.png 2x`}
            />
            {option.name}
          </Box>
        )}
      />
    )
  );
};

export { BaseCountrySelect };
