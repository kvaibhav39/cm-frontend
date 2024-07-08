import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import throttle from "lodash/throttle";
import { getLoggedInUserHrOrganizationId } from "../../../utils/UserHelper";
import { useDispatch } from "react-redux";
import { searchUsers } from "../../../store/actions/hrActions";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const filter = createFilterOptions();

export const AutoCompleteUser = (props) => {
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const dispatch = useDispatch();
  // console.log(props.currentUsers, "auto complete filters");
  const handleChange = (newValue) => {
    // console.log(newValue);
    setOptions(newValue ? [newValue, ...options] : options);
    setValue(newValue);
    props.onChange(newValue);
  };

  const fetch = React.useMemo(
    () =>
      throttle(async (request, callback) => {
        if (request.input.length > 2) {
          let logDetails = getCurrentFileNameAndFunction(
            import.meta.url,
            "fetch"
          );

          dispatch(
            searchUsers(
              {
                q: request.input,
                orgId: getLoggedInUserHrOrganizationId(),
              },
              props.currentUsers,
              callback,
              logDetails
            )
          );
        }
      }, 500),
    [props.filterDataOptions]
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      // console.log(results);
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }
        // console.log(newOptions);
        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  const { errorTextField, setErrorTextField } = props;

  return (
    <Autocomplete
      value={value || ""}
      freeSolo
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          handleChange({
            loginEmail: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          handleChange({
            loginEmail: newValue.inputValue,
          });
        } else {
          handleChange(newValue);
        }
      }}
      onInputChange={(event, newInputValue) => {
        setErrorTextField(false);
        setInputValue(newInputValue);
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some(
          (option) => inputValue === option.loginEmail
        );

        let validateEmail = new RegExp(
          /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
        );

        if (
          inputValue !== "" &&
          !isExisting &&
          validateEmail.test(inputValue)
        ) {
          filtered.push({
            inputValue,
            loginEmail: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      // selectOnFocus
      // clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={options}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.loginEmail;
      }}
      renderOption={(props, option) => <li {...props}>{option.loginEmail}</li>}
      sx={{ width: 532 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search by name or email address*"
          error={errorTextField}
        />
      )}
    />
  );
};
