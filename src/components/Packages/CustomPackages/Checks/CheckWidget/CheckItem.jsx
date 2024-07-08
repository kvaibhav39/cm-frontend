import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
} from "@mui/material";
import AddressCheck from "../AddressCheck";
import EducationCheck from "../EducationCheck";
import EmploymentCheck from "../EmploymentCheck";
import IDCheck from "../IDCheck";
import CheckAccordionHeader from "./CheckAccordionHeader";
import ProfessionalLicense from "../ProfessionalLicense";
import ReferenceCheck from "../ReferenceCheck";
import IntegrityCheck from "../IntegrityCheck";
import { FastField } from "formik";
import React, { useEffect, useRef } from "react";
import AdditionalJurisdictionScope from "../AdditionalJurisdictionScope";

const CheckItem = ({
  checkOrderId,
  defaultCheckConfig,
  checks,
  selectedCountry,
  questionnairesData,
  countriesData,
  setDisableBtn,
  amount,
  isoCode,
  key,
  disableCheck,
  tempRef,
  viewMode,
  checksCategory = "",
  id,
  hideCheckDetails = false,
  hideInfoIcon = false,
  titleSize = "h4",
  selectedCheckTypes = [],
  showCheckPrice = false,
  ...props
}) => {
  const updateRef = useRef(false);

  let component = null;
  switch (defaultCheckConfig?.checkName) {
    case "Address Check":
      component = (
        <AddressCheck
          checkOrderId={checkOrderId}
          checkId={defaultCheckConfig?.checksId}
          wrapperObject={checks}
        />
      );
      break;
    case "Education Check":
      component = (
        <EducationCheck
          checkOrderId={checkOrderId}
          checkId={defaultCheckConfig.checksId}
        />
      );
      break;
    case "Employment Check":
      component = (
        <EmploymentCheck
          wrapperObject={checks}
          checkOrderId={checkOrderId}
          checkId={defaultCheckConfig.checksId}
        />
      );
      break;
    case "Professional License & Membership":
      component = (
        <ProfessionalLicense
          wrapperObject={checks}
          checkOrderId={checkOrderId}
          checkId={defaultCheckConfig.checksId}
        />
      );
      break;
    case "ID Check":
      component = (
        <IDCheck
          wrapperObject={checks}
          checkOrderId={checkOrderId}
          checkId={defaultCheckConfig.checksId}
        />
      );
      break;
    case "Reference Check":
      component = (
        <ReferenceCheck
          wrapperObject={checks}
          checkOrderId={checkOrderId}
          checkId={defaultCheckConfig.checksId}
          questionnairesData={questionnairesData}
        />
      );
      break;
    case "Declaration of Integrity":
      component = (
        <IntegrityCheck
          wrapperObject={checks}
          checkOrderId={checkOrderId}
          checkId={defaultCheckConfig.checksId}
          questionnairesData={questionnairesData}
        />
      );
      break;
    case "Additional Research Country":
      component = (
        <AdditionalJurisdictionScope
          wrapperObject={checks}
          checkOrderId={checkOrderId}
          checkId={defaultCheckConfig.checksId}
          countriesData={countriesData}
          checksCategory={checksCategory}
        />
      );
      break;
  }

  //to enable add package btn only when atleast 1 package is selected
  useEffect(() => {
    let flag = true;
    if (!updateRef.current) {
      if (tempRef) {
        tempRef.current = true;
        setTimeout(() => {
          tempRef.current = false;
        }, 500);
      }
      updateRef.current = true;
    }
    checks?.map((check) => {
      if (check?.checkEnabled) {
        return (flag = false);
      }
    });
    setDisableBtn && setDisableBtn(flag);
  }, [
    checkOrderId,
    defaultCheckConfig,
    checks,
    selectedCountry,
    questionnairesData,
    countriesData,
  ]);

  return (
    <Grid item xs={12} alignItems={"baseline"} display={"flex"} id={id}>
      <FastField
        name={
          checksCategory === "extraChecks"
            ? `extraChecks[${checkOrderId}].checkEnabled`
            : `checks[${checkOrderId}].checkEnabled`
        }
        shouldUpdate={() => {
          if (!tempRef) {
            return false;
          }
          if (tempRef?.current) {
            return true;
          } else {
            return false;
          }
        }}
        component={({ form, field }) => {
          const { name, value } = field;
          const { setFieldValue } = form;

          return (
            <Accordion
              disableGutters
              style={{ width: "100%" }}
              // disabled={disableCheck}
              expanded={() => {
                if (checks === undefined) {
                  return;
                }
                return checks[checkOrderId]?.checkEnabled;
              }}
              onChange={async (e) => {
                if (viewMode) {
                  return;
                }
                if (tempRef) {
                  tempRef.current = true;
                }

                setFieldValue(name, !value);
                await Promise.resolve();
                if (tempRef) {
                  tempRef.current = false;
                }
              }}
            >
              <AccordionSummary
                // expandIcon={<ExpandMoreIcon/>}
                id={`${defaultCheckConfig?.checksId}-header`}
              >
                <CheckAccordionHeader
                  checkOrderId={checkOrderId}
                  selectedCountry={selectedCountry}
                  defaultCheckID={defaultCheckConfig?.checksId}
                  title={defaultCheckConfig?.checkName}
                  description={defaultCheckConfig?.checkDescription}
                  amount={amount}
                  isoCode={isoCode}
                  key={key}
                  checksCategory={checksCategory}
                  hideInfoIcon={hideInfoIcon}
                  titleSize={titleSize}
                  selectedCheckTypes={selectedCheckTypes}
                  showCheckPrice={showCheckPrice}
                  defaultCheckConfig={defaultCheckConfig}
                />
              </AccordionSummary>
              {checks &&
              checks[checkOrderId]?.checkEnabled &&
              component &&
              !hideCheckDetails ? (
                <AccordionDetails sx={viewMode && { pointerEvents: "none" }}>
                  {component}
                </AccordionDetails>
              ) : null}
            </Accordion>
          );
        }}
      />
    </Grid>
  );
};

export default CheckItem;
