import { Autocomplete, TextField } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { getOrganizationUsers } from "../../../../../store/actions/hrActions";
import { getOpsUsersByOrgId } from "../../../../../store/actions/operationActions";
import { useDispatch } from "react-redux";
import { getCurrentFileNameAndFunction } from "../../../../../utils/getCurrentFileNameAndFunction";

const MultipleUserSelectionDropdown = ({ extraFieldFlag, ...props }) => {
  let { values, errorMsg, param, fieldName, setFieldValue } = props;

  const { organizationUsers } = useSelector((state) => state.hr);
  const { opsUsersByOrg } = useSelector((state) => state.operations);
  const { selectedOrg } = useSelector((state) => state.systemAdmin);

  const dispatch = useDispatch();

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    if (
      !organizationUsers?.hrOrganizationUsers?.length &&
      extraFieldFlag === "HR"
    ) {
      dispatch(getOrganizationUsers({ orgId: selectedOrg }, logDetails));
    }

    if (!opsUsersByOrg && extraFieldFlag === "OPS") {
      dispatch(getOpsUsersByOrgId(selectedOrg, logDetails));
    }
  }, [selectedOrg, extraFieldFlag]);

  let dropdownOptions = useMemo(() => {
    if (
      extraFieldFlag === "HR" &&
      organizationUsers?.hrOrganizationUsers?.length
    ) {
      return organizationUsers?.hrOrganizationUsers;
    } else if (opsUsersByOrg?.length) {
      return opsUsersByOrg;
    } else {
      return [];
    }
  }, [extraFieldFlag, organizationUsers, opsUsersByOrg]);

  // Filter out selected options from the dropdown
  const filteredOptions = dropdownOptions?.filter(
    (option) =>
      !values[param][fieldName].some(
        (selectedOption) => selectedOption.usersId === option.usersId
      )
  );

  return (
    <Autocomplete
      multiple
      id="tags-outlined"
      value={values[param][fieldName]}
      size="small"
      sx={{
        maxWidth: { lg2: 800, md: 500, xs: "100%" },
        minWidth: 300,
      }}
      componentsProps={{
        popper: {
          modifiers: [
            {
              name: "flip",
              enabled: true,
            },
            {
              name: "preventOverflow",
              enabled: false,
            },
          ],
        },
      }}
      onChange={(event, newValue = [], reason, details) => {
        if (reason === "removeOption") {
          const updatedValue = newValue.filter(
            (option) => option.usersId !== details.option.usersId
          );

          const finalValue = updatedValue.map(({ loginEmail, usersId }) => ({
            loginEmail,
            usersId,
          }));

          setFieldValue(`${param}`, {
            ...values[param],
            [fieldName]: finalValue,
          });
        } else {
          const finalValue = newValue.map(({ loginEmail, usersId }) => ({
            loginEmail,
            usersId,
          }));

          setFieldValue(`${param}`, {
            ...values[param],
            [fieldName]: finalValue,
          });
        }
      }}
      options={filteredOptions}
      getOptionLabel={(option) => option?.loginEmail || ""}
      getOptionSelected={(option, value) => option.usersId === value.usersId}
      filterSelectedOptions
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select User(s)"
          placeholder="Select User(s)"
          error={errorMsg}
          helperText={errorMsg}
        />
      )}
    />
  );
};

export default MultipleUserSelectionDropdown;
