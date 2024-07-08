import { Box } from "@mui/material";
import { BaseAutocomplete } from "./BaseAutocomplete";
import { useEffect } from "react";
import { getCurrencies } from "../../store/actions/candidateAction";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction.js";

const BaseCurrencyAutocomplete = (props) => {
  const { currencies } = useSelector((state) => state.candidate);
  const dispatch = useDispatch();

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    !currencies && dispatch(getCurrencies(logDetails));
  }, []);

  return (
    currencies && (
      <BaseAutocomplete
        {...props}
        options={currencies}
        itemValue="currencyMasterId"
        itemLabel="CurrencyISOCode"
        renderOption={(props, option) => (
          <Box {...props} component="li">
            {option.CurrencyName} ({option.CurrencyISOCode})
          </Box>
        )}
      />
    )
  );
};

export { BaseCurrencyAutocomplete };
