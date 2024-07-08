import { useSelector } from "react-redux";
import DefaultResearchCountries from "./components/DefaultResearchCountries";
import { Box, Divider, Typography } from "@mui/material";
import SelectAllowedResearchCountries from "./components/SelectAllowedResearchCountries";
import { getAllCountries } from "./../../../store/actions/helperActions";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const ResearchCountries = () => {
  const dispatch = useDispatch();
  const { selectedOrg } = useSelector((state) => state.systemAdmin);
  const { allCountriesModified } = useSelector((state) => state.helper);

  useEffect(() => {
    if (!allCountriesModified) {

      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );
      
      dispatch(getAllCountries(logDetails));
    }
  }, []);

  return (
    <Box
      px={1}
      sx={{
        width: "100%",
        height: { xs: "70vh", xxl: "80vh" },
        overflowY: "auto",
      }}
    >
      {selectedOrg ? (
        <>
          <SelectAllowedResearchCountries />
          <Divider />
          <DefaultResearchCountries />
        </>
      ) : (
        <Typography textAlign="center" mt={4} fontWeight={600}>
          Please select an organization
        </Typography>
      )}
    </Box>
  );
};

export default ResearchCountries;
