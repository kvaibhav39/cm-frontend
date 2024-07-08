import { FastField, FieldArray, Form } from "formik";
import React from "react";
import DisplayHeadingForMultipleFields from "../../common/DisplayHeadingForMultipleFields";
import { checkGaps } from "../utils/checkGaps";
import { Box, Grid, Typography } from "@mui/material";
import {
  BaseCountrySelect,
  BaseDatePicker,
  BaseTextField,
} from "../../../base";
import moment from "moment";

const AddressFormDetails = ({
  form,
  pushNewAddressRef,
  addressForm,
  sectionData,
  setGaps,
}) => {
  return (
    <FieldArray name="addresses" id="addresses">
      {({ push, remove }) => {
        pushNewAddressRef.current = push;
        return (
          <>
            {form?.values?.addresses?.length ? (
              <>
                {form?.values?.addresses?.map((address, index) =>
                  address.selectedTab ? (
                    <>
                      <DisplayHeadingForMultipleFields
                        index={index}
                        heading="Address"
                        currentValue={address}
                        sectionValues={form?.values?.addresses}
                        fieldArrayName="addresses"
                        setFieldValue={form.setFieldValue}
                        runWhenDelete={() =>
                          checkGaps(
                            addressForm.current.values,
                            sectionData,
                            setGaps
                          )
                        }
                      />
                      <Box px={3} pb={3}>
                        <Grid container spacing={2}>
                          {" "}
                          <Grid item xs={12} md={6}>
                            <FastField
                              component={BaseTextField}
                              // label="Street/Address Line 1*"
                              label="Address Line 1*"
                              name={`addresses.${index}.streetAddressLine1`}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <FastField
                              component={BaseTextField}
                              // label="Street/Address Line 2*"
                              label="Address Line 2"
                              name={`addresses.${index}.streetAddressLine2`}
                            />
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          pt={{ xs: 1, md: 3 }}
                          spacing={{ xs: 1, md: 4 }}
                        >
                          <Grid item xs={12} md={4}>
                            <FastField
                              component={BaseTextField}
                              label="City/Town/District*"
                              name={`addresses.${index}.cityTownDistrict`}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <FastField
                              component={BaseTextField}
                              // label="State/Province*"
                              shouldUpdate={() => true}
                              label={
                                form?.values?.addresses[index]?.countryId ===
                                  101 ||
                                form?.values?.addresses[index]?.countryId ===
                                  132
                                  ? "State/Province"
                                  : "State/Province*"
                              }
                              name={`addresses.${index}.stateProvince`}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <FastField
                              component={BaseCountrySelect}
                              label="Country*"
                              name={`addresses.${index}.countryId`}
                            />
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          pt={{ xs: 1, md: 3 }}
                          spacing={{ xs: 1, md: 4 }}
                        >
                          <Grid item xs={12} md={4}>
                            <FastField
                              component={BaseTextField}
                              label="Zip/Postal/Area Code"
                              name={`addresses.${index}.zipPostalAreaCode`}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <FastField
                              component={BaseDatePicker}
                              label="From*"
                              views={["year", "month"]}
                              name={`addresses.${index}.fromDate`}
                              maxDate={moment(
                                sectionData?.section?.validationScope?.endDate
                              ).toDate()}
                              checkGaps={checkGaps}
                              index={index}
                              sectionData={sectionData}
                              setGapsState={setGaps}
                            />
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <FastField
                              component={BaseDatePicker}
                              label="To*"
                              presentBtn
                              views={["year", "month"]}
                              name={`addresses.${index}.toDate`}
                              maxDate={moment(
                                sectionData?.section?.validationScope?.endDate
                              ).toDate()}
                              checkGaps={checkGaps}
                              sectionData={sectionData}
                              setGapsState={setGaps}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </>
                  ) : null
                )}
              </>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center">
                <Typography align="center" fontWeight={550} p={2}>
                  No Addresses Present
                </Typography>
              </Box>
            )}
          </>
        );
      }}
    </FieldArray>
  );
};

export default AddressFormDetails;
