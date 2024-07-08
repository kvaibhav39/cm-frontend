import React, { useEffect, useState, memo, lazy, Suspense } from "react";
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ClearOutlined, SearchOutlined } from "@mui/icons-material";
import { BaseAccordion } from "../../../base/BaseAccordion";
import { useDispatch, useSelector } from "react-redux";
import ScrollableGrid from "../../../../common/ScrollableGrid";
import {
  getCheckCostsOfAllCountries,
  updateCheckCostOfCountries,
} from "../../../../store/actions/systemAdminActions";
import CircularLoader from "../../../../common/CircularLoader";
import { setToastNotification } from "../../../../store/actions/toastNotificationActions";
import { ERROR } from "../../../../store/constant";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction";
const DisplayCountriesCosts = lazy(() => import("./DisplayCountriesCosts"));

const ChecksAccordion = memo(
  ({ check, index, accordionStateIndex, setAccordionStateIndex }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const {
      checkCostsforAllCountries,
      selectedOrg,
      updateCheckPriceAccordionLoading,
    } = useSelector((state) => state.systemAdmin);
    const [filteredData, setFilteredData] = useState(null);
    const [enteredCountryName, setEnteredCountryName] = useState("");
    const [toEditCountryId, setToEditCountryId] = useState(null);
    const [updatedCost, setUpdatedCost] = useState([]);
    const [enteredCost, setEnteredCost] = useState(null);
    const [enteredCurrency, setEnteredCurrency] = useState("USD");

    const fetchCheckCostsOfAllCountries = () => {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "fetchCheckCostsOfAllCountries"
      );

      dispatch(
        getCheckCostsOfAllCountries(check.checksId, selectedOrg, logDetails)
      );
      setToEditCountryId(null);
    };

    useEffect(() => {
      if (accordionStateIndex !== null) {
        fetchCheckCostsOfAllCountries();
      }
    }, []);

    useEffect(() => {
      if (
        checkCostsforAllCountries?.length &&
        checkCostsforAllCountries[0]?.checkId === check.checksId
      ) {
        setFilteredData(checkCostsforAllCountries);
      }
      return () => {
        setFilteredData(null);
        setUpdatedCost([]);
      };
    }, [checkCostsforAllCountries]);

    const handleFilter = (e) => {
      if (e === "empty") {
        setEnteredCountryName("");
        return setFilteredData(checkCostsforAllCountries);
      }

      setEnteredCountryName(e.target.value);
      let temp = [...checkCostsforAllCountries];

      if (e.target.value !== "") {
        temp = checkCostsforAllCountries.filter((curr) =>
          curr.countryName.toLowerCase().includes(e.target.value.toLowerCase())
            ? curr
            : null
        );
      } else {
        setEnteredCountryName("");
      }

      setFilteredData(temp);
    };

    const updateCostOfCountryData = (
      countryId,
      toUpdateWithCost,
      toUpdateWithCurrency
    ) => {
      let tempFilteredData = [...filteredData];

      tempFilteredData.forEach((curr) => {
        if (curr.countryId === countryId) {
          curr.cost = toUpdateWithCost;
          curr.costCurrencyISOCode = toUpdateWithCurrency;
        }
      });

      setFilteredData(tempFilteredData);
    };

    const handleUpdateCost = (checkCosts) => {
      let newValue = {
        checkId: check.checksId,
        countryId: checkCosts.countryId,
        oldCost: checkCosts.cost,
        cost: enteredCost || null,
        oldCostCurrencyISOCode: checkCosts.costCurrencyISOCode,
        costCurrencyISOCode: enteredCurrency || null,
      };

      let tempUpdatedCost = [...updatedCost];

      let presentCostData = tempUpdatedCost.find(
        (curr) =>
          curr.countryId === checkCosts.countryId &&
          curr.checkId === check.checksId
      );

      if (+checkCosts.cost !== +enteredCost) {
        if (presentCostData) {
          presentCostData.cost = enteredCost;
          presentCostData.costCurrencyISOCode = enteredCurrency;
        } else {
          tempUpdatedCost.push(newValue);
        }

        updateCostOfCountryData(
          checkCosts.countryId,
          enteredCost,
          enteredCurrency
        );

        setUpdatedCost(tempUpdatedCost);
        setToEditCountryId(null);
        setEnteredCost(null);
      }
    };

    const handleRevertChanges = (checkCosts) => {
      let tempUpdatedCost = [...updatedCost];

      let presentCostData = tempUpdatedCost.find(
        (curr) =>
          curr.countryId === checkCosts.countryId &&
          curr.checkId === check.checksId
      );
      if (presentCostData) {
        updateCostOfCountryData(
          checkCosts.countryId,
          presentCostData.oldCost,
          presentCostData.oldCostCurrencyISOCode
        );

        let newCostData = tempUpdatedCost.filter(
          (curr) =>
            !(
              curr.countryId === presentCostData.countryId &&
              curr.checkId === presentCostData.checkId
            )
        );

        setUpdatedCost(newCostData);
      }
    };

    const handleAccordionStatus = (status) => {
      if (status) {
        setAccordionStateIndex(index);
        fetchCheckCostsOfAllCountries();
      } else if (!status && accordionStateIndex === index) {
        setAccordionStateIndex(null);
      }
    };

    const handleUpdateCountryCosts = () => {
      if (updatedCost.length) {
        let tempUpdatedCosts = [...updatedCost];
        let costError = false;

        tempUpdatedCosts.forEach((curr) => {
          if (String(curr?.cost)?.length > 5) {
            costError = true;
          }
          delete curr.oldCost;
          delete curr.oldCostCurrencyISOCode;
        });

        let logDetails = getCurrentFileNameAndFunction(
          import.meta.url,
          "handleUpdateCountryCosts"
        );
        
        if (costError) {
          return dispatch(
            setToastNotification(
              ERROR,
              "Please enter a practical amount",
              logDetails
            )
          );
        }

        dispatch(
          updateCheckCostOfCountries(
            check.checksId,
            tempUpdatedCosts,
            selectedOrg,
            logDetails
          )
        );
        setEnteredCountryName("");
        // setFilteredData(null);
        setUpdatedCost([]);
      }
    };

    return (
      <Grid item xs={12} mb={2} mx="auto">
        <BaseAccordion
          key="check-cost-accordion"
          id="check-cost-accordion"
          index={index}
          expanded={accordionStateIndex === index}
          onChange={handleAccordionStatus}
          bordercolor={theme.palette.accordion.border}
          noPaddingInAccordionDetails
          header={(header) => (
            <Typography
              fontWeight={500}
              color="#000"
              mr={{ xs: 0, md: 1 }}
              textAlign="center"
            >
              {check.checkDisplayName}
            </Typography>
          )}
          mb={3}
        >
          <ScrollableGrid
            screen="xxxl"
            scrollHeight="auto"
            xs={12}
            gap="10px"
            display="flex"
            justifyContent="center"
            alignItems={{
              xs: "center",
              md: "flex-start",
            }}
            flexWrap="wrap"
            py={3}
          >
            {Array.isArray(checkCostsforAllCountries) &&
            checkCostsforAllCountries?.length ? (
              <Grid
                item
                xs={12}
                mb={2}
                display="flex"
                justifyContent="center"
                flexDirection={{ xs: "column", md: "row" }}
              >
                <TextField
                  value={enteredCountryName}
                  placeholder="Type Country Name..."
                  type="text"
                  size="small"
                  variant="outlined"
                  onChange={handleFilter}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlined style={{ marginLeft: "0.5rem" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <ClearOutlined
                          style={{ cursor: "pointer" }}
                          onClick={() => handleFilter("empty")}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
                <Box ml={{ xs: 0, md: 4 }} mt={{ xs: 2, md: 0 }}>
                  <Button
                    variant="contained"
                    onClick={handleUpdateCountryCosts}
                    disabled={!updatedCost?.length}
                  >
                    Update
                  </Button>
                </Box>
              </Grid>
            ) : null}
            {!updateCheckPriceAccordionLoading ? (
              filteredData?.length ? (
                <>
                  <Suspense
                    fallback={<CircularLoader height="20vh" size={25} />}
                  >
                    {filteredData?.map((checkCosts, index) => (
                      <DisplayCountriesCosts
                        key={index}
                        check={check}
                        theme={theme}
                        checkCosts={checkCosts}
                        toEditCountryId={toEditCountryId}
                        setToEditCountryId={setToEditCountryId}
                        enteredCost={enteredCost}
                        setEnteredCost={setEnteredCost}
                        enteredCurrency={enteredCurrency}
                        setEnteredCurrency={setEnteredCurrency}
                        handleUpdateCost={handleUpdateCost}
                        updatedCost={updatedCost}
                        handleRevertChanges={handleRevertChanges}
                      />
                    ))}
                  </Suspense>
                </>
              ) : (Array.isArray(checkCostsforAllCountries) &&
                  !checkCostsforAllCountries?.length) ||
                !filteredData?.length ? (
                <Typography fontSize="1rem" fontWeight="600" textAlign="center">
                  No Data Present
                </Typography>
              ) : (
                <CircularLoader height="20vh" size={25} />
              )
            ) : (
              <CircularLoader height="20vh" size={25} />
            )}
          </ScrollableGrid>
        </BaseAccordion>
      </Grid>
    );
  },
  (prevProps, nextProps) => {
    if (nextProps.accordionStateIndex === nextProps.index) {
      return false;
    } else if (
      prevProps.accordionStateIndex !== nextProps.accordionStateIndex &&
      prevProps.accordionStateIndex !== null
    ) {
      return false;
    } else {
      return true;
    }
  }
);

export default ChecksAccordion;
