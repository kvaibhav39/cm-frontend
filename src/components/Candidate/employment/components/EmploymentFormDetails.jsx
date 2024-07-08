import {
  DeleteOutline,
  InfoOutlined,
  InsertDriveFileOutlined,
  PlaceOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { FastField, FieldArray } from "formik";
import moment from "moment";
import React from "react";
import {
  BaseCountrySelect,
  BaseCurrencyAutocomplete,
  BaseDatePicker,
  BaseRadioGroup,
  BaseSelect,
  BaseSwitchCard,
  BaseTextField,
} from "../../../base";

import DisplayHeadingForMultipleFields from "../../common/DisplayHeadingForMultipleFields";
import { checkGaps } from "../utils/checkGaps";
import CustomTooltip from "../../../common/CustomTooltip";
import HandleToRenderReasonForCessationDateField from "./HandleToRenderReasonForCessationDateField";
import { useDispatch, useSelector } from "react-redux";
import { get } from "lodash";
import { PhoneNumberTextField } from "../../../../common/Form/PhoneNumberTextField/PhoneNumberTextField";
import BaseUploadNew from "../../../base/BaseUploadNew";
import { addAndRemoveImageHanlderArray } from "../../utils/addAndRemoveImageHandlerArray";
import { newBonusData } from "../../helpers/initialState/employment";

const EmploymentFormDetails = ({
  form,
  sectionData,
  empGap,
  pushNewEmpRef,
  employmentForm,
  setEmpGap,
  setDisableBtn,
  careerGapsTypes,
  employmentTypes,
  reasonOfLeavingTypes,
  bonusTypes,
  salaryFreq,
}) => {
  const { candidateInitialDetails } = useSelector((state) => state.candidate);

  const { hrOrganizationName,doNotDisplayClientName } = candidateInitialDetails;

  const dispatch = useDispatch();

  return (
    <>
      {form.values.isCareerGapPresent ? (
        <>
          {/*Career gaps */}
          {sectionData?.section?.validationScope?.checkGap &&
            empGap?.length > 0 && (
              <>
                <Box p={3}>
                  <Box display={"flex"} alignItems="center">
                    <InsertDriveFileOutlined />
                    <Typography fontSize={"20px"} fontWeight="500">
                      Career Gaps
                    </Typography>
                  </Box>
                  <Typography fontWeight={500} fontSize={"17px"} mt={2}>
                    Seems You have more than{" "}
                    {sectionData?.section?.validationScope?.gapDurationInMonths}{" "}
                    Months of career gap between your employments, please share
                    below details.
                  </Typography>
                </Box>
                <FieldArray name="employmentsGap" id="employmentsGap">
                  {({ push, remove }) => (
                    <>
                      {empGap?.map((employmentGap, index) => (
                        <Grid container p={3} key={employmentGap.gapStartDate}>
                          <Grid item xs={12} lg={2} mt={{ xs: 0, lg: 3.5 }}>
                            <Typography
                              fontSize={"20px"}
                              textAlign={{
                                xs: "center",
                                lg: "left",
                              }}
                            >
                              Gap {index + 1}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} lg={10}>
                            <Grid
                              container
                              spacing={2}
                              display="flex"
                              alignItems={"center"}
                            >
                              <Grid item xs={12} md={4} mt={2}>
                                {moment(employmentGap.gapStartDate).format(
                                  "DD MMM YYYY"
                                ) !==
                                moment(employmentGap.gapEndDate).format(
                                  "DD MMM YYYY"
                                )
                                  ? moment(employmentGap.gapStartDate).format(
                                      "DD MMM YYYY"
                                    ) +
                                    " to " +
                                    moment(employmentGap.gapEndDate).format(
                                      "DD MMM YYYY"
                                    )
                                  : moment(employmentGap.gapStartDate).format(
                                      "DD MMM YYYY"
                                    )}
                              </Grid>
                              <Grid item xs={12} sm={8}>
                                <FastField
                                  component={BaseSelect}
                                  name={`employmentsGaps.${index}.reasonOfGapId`}
                                  label="Reason of Gap"
                                  optionLabel="reasonOfGapName"
                                  optionValue="candidatesEmploymentReasonOfGapsId"
                                  options={careerGapsTypes}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <FastField
                                  rows={3}
                                  multiline
                                  component={BaseTextField}
                                  name={`employmentsGaps.${index}.additionalComments`}
                                  placeholder="Any Additional Comments"
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                    </>
                  )}
                </FieldArray>
              </>
            )}
        </>
      ) : (
        <>
          <FieldArray name="employments" id="employments">
            {({ push, remove }) => {
              pushNewEmpRef.current = push;
              return (
                <>
                  {form?.values?.employments?.length ? (
                    <>
                      {" "}
                      {form?.values?.employments?.map((employment, index) =>
                        employment.selectedTab ? (
                          <>
                            {/* Employment Details */}
                            <DisplayHeadingForMultipleFields
                              index={index}
                              heading="Employment Details"
                              currentValue={employment}
                              sectionValues={form?.values?.employments}
                              fieldArrayName="employments"
                              setFieldValue={form.setFieldValue}
                              runWhenDelete={() =>
                                form.setFieldValue(
                                  "employmentsGaps",
                                  checkGaps(
                                    employmentForm.current.values,
                                    sectionData,
                                    setEmpGap
                                  )
                                )
                              }
                            />

                            {/* Form Employment Details  */}
                            <Box>
                              <Grid container>
                                <Grid item xs={12} md={6}>
                                  <Box px={3}>
                                    <Grid container spacing={2}>
                                      <Grid item xs={12}>
                                        <FastField
                                          component={BaseTextField}
                                          label="Company Name*"
                                          name={`employments.${index}.companyName`}
                                        />
                                      </Grid>
                                      <Grid item xs={12}>
                                        <FastField
                                          component={BaseSwitchCard}
                                          label="Is this your current employer?"
                                          name={`employments.${index}.isCurrentEmployer`}
                                        />
                                      </Grid>
                                      <Grid item xs={12}>
                                        <FastField
                                          component={BaseSelect}
                                          label="Employment Type*"
                                          optionLabel="employmentTypeName"
                                          optionValue="candidatesEmploymentTypesId"
                                          name={`employments.${index}.employmentTypeId`}
                                          options={employmentTypes}
                                        />
                                      </Grid>
                                      <Grid item xs={12}>
                                        <FastField
                                          component={BaseTextField}
                                          label="Employment Department"
                                          name={`employments.${index}.employmentDepartment`}
                                        />
                                      </Grid>
                                      <Grid item xs={12}>
                                        <FastField
                                          component={BaseTextField}
                                          label="Employee ID"
                                          name={`employments.${index}.employeeId`}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Box px={3}>
                                    <Grid container spacing={2}>
                                      <Grid item xs={12} md={6}>
                                        <FastField
                                          component={BaseDatePicker}
                                          label="From Date*"
                                          name={`employments.${index}.fromDate`}
                                          // minDate={moment(
                                          //   sectionData?.section
                                          //     ?.validationScope
                                          //     ?.startDate
                                          // ).toDate()}
                                          maxDate={moment(
                                            sectionData?.section
                                              ?.validationScope?.endDate
                                          ).toDate()}
                                          checkGaps={checkGaps}
                                          index={index}
                                          views={["year", "month", "day"]}
                                          placeholder="DD-MMM-YYYY"
                                          inputFormat="dd-MMM-yyyy"
                                          sectionData={sectionData}
                                          setGapsState={setEmpGap}
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={12}
                                        md={6}
                                        display="flex"
                                        alignItems="center"
                                      >
                                        <Grid item xs={10}>
                                          <FastField
                                            component={BaseDatePicker}
                                            label="To Date*"
                                            // presentBtn
                                            name={`employments.${index}.toDate`}
                                            // minDate={moment(
                                            //   sectionData?.section
                                            //     ?.validationScope
                                            //     ?.startDate
                                            // ).toDate()}
                                            maxDate={moment(
                                              sectionData?.section
                                                ?.validationScope?.endDate
                                            ).toDate()}
                                            checkGaps={checkGaps}
                                            index={index}
                                            views={["year", "month", "day"]}
                                            placeholder="DD-MMM-YYYY"
                                            inputFormat="dd-MMM-yyyy"
                                            sectionData={sectionData}
                                            setGapsState={setEmpGap}
                                          />
                                        </Grid>
                                        <Grid
                                          item
                                          xs={2}
                                          mt={2}
                                          display="flex"
                                          justifyContent="center"
                                        >
                                          <CustomTooltip
                                            tooltipmaxwidth={400}
                                            title={
                                              <>
                                                We will contact this employer
                                                either: within 1 business day
                                                from the last date of employment
                                                you provided, or the official
                                                cessation date you have chosen,
                                                whichever is later.
                                                <br /> <br />
                                                If you have not officially
                                                resigned from your current
                                                employer, we suggest that you
                                                give us the exact date for the
                                                permission to contact your
                                                employer until your resignation
                                                has been tendered.
                                              </>
                                            }
                                          >
                                            <InfoOutlined />
                                          </CustomTooltip>
                                        </Grid>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <FastField
                                          component={BaseSwitchCard}
                                          label="Can we contact this employer now?"
                                          // label='Do you have any concerns in disclosing "Client_name" to your Current/Latest Employer?'
                                          name={`employments.${index}.canContactEmployer`}
                                          index={index}
                                        />
                                      </Grid>
                                      {!employment?.canContactEmployer ? (
                                        <Grid item xs={12}>
                                          <FastField
                                            component={BaseDatePicker}
                                            label="What is your official cessation date?*"
                                            name={`employments.${index}.cessationDate`}
                                            minDate={moment().toDate()}
                                            maxDate={moment()
                                              .add(5, "years")
                                              .toDate()}
                                            index={index}
                                            views={["year", "month", "day"]}
                                            placeholder="DD-MMM-YYYY"
                                            inputFormat="dd-MMM-yyyy"
                                          />
                                        </Grid>
                                      ) : null}
                                      <HandleToRenderReasonForCessationDateField
                                        employment={employment}
                                        index={index}
                                        hrOrganizationName={hrOrganizationName}
                                        doNotDisplayClientName={doNotDisplayClientName}
                                      />
                                      <Grid item xs={12}>
                                        <FastField
                                          component={BaseRadioGroup}
                                          label="Employment Status*"
                                          name={`employments.${index}.employmentStatusId`}
                                          options={[
                                            {
                                              value: 1,
                                              label: "Full Time",
                                            },
                                            {
                                              value: 2,
                                              label: "Part Time",
                                            },
                                          ]}
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={12}
                                        display="flex"
                                        alignItems="center"
                                      >
                                        {/* <Grid item xs={11}> */}
                                        <Grid item xs={12}>
                                          <FastField
                                            component={BaseTextField}
                                            label="Job Title*"
                                            name={`employments.${index}.jobTitle`}
                                          />
                                        </Grid>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <FastField
                                          component={BaseSelect}
                                          label="Reason For Leaving*"
                                          optionLabel="reasonName"
                                          optionValue="id"
                                          name={`employments.${index}.reasonForLeaving`}
                                          options={reasonOfLeavingTypes}
                                          index={index}
                                        />
                                      </Grid>
                                      {employment?.reasonForLeaving === 8 ? (
                                        <Grid item xs={12}>
                                          <FastField
                                            component={BaseTextField}
                                            name={`employments.${index}.otherReasonForLeaving`}
                                            shouldUpdate={() => true}
                                            label="Other reason for leaving*"
                                          />
                                        </Grid>
                                      ) : null}
                                    </Grid>
                                  </Box>
                                </Grid>
                                {employment?.reasonForLeaving === 5 ? (
                                  <Grid item xs={12}>
                                    <Box
                                      my={{ xs: 2, md: 1 }}
                                      px={{ xs: 2, md: 5 }}
                                    >
                                      <Box display="flex" alignItems="center">
                                        <FastField
                                          name={`employments.${index}.wasResignationRequested`}
                                          component={BaseSwitchCard}
                                          label={
                                            <Typography
                                              fontSize={{
                                                xs: "16px",
                                                md: "18px",
                                              }}
                                              style={{
                                                wordBreak: "break-word",
                                              }}
                                            >
                                              Was the resignation required by
                                              this employer?
                                            </Typography>
                                          }
                                        />
                                        <CustomTooltip
                                          style={{
                                            marginLeft: "10px",
                                          }}
                                          title="This should include any departure other than a completely voluntary resignation which is instigated by you, or an employer's decision not to renew a fixed term contract of employment."
                                        >
                                          <InfoOutlined />
                                        </CustomTooltip>
                                      </Box>

                                      {employment.wasResignationRequested && (
                                        <Box mt={2}>
                                          <FastField
                                            component={BaseTextField}
                                            name={`employments.${index}.reasonOfResignationRequested`}
                                            multiline
                                            minRows={2}
                                            fullWidth
                                            sx={{
                                              fieldset: {
                                                borderRadius: "12px",
                                              },
                                            }}
                                            placeholder="Please provide reason why company has requested you for resignation/Separation?"
                                          />
                                        </Box>
                                      )}
                                    </Box>
                                  </Grid>
                                ) : null}
                              </Grid>
                            </Box>
                            {/* */}

                            <Box my={2} px={3}>
                              <Divider />
                            </Box>

                            {/* Agency Details */}
                            <Box>
                              <Box mt={3} px={3}>
                                <Box
                                  display={"flex"}
                                  alignItems="center"
                                  className="space-x-2"
                                >
                                  <InsertDriveFileOutlined />
                                  <Typography
                                    fontSize={"20px"}
                                    fontWeight="500"
                                  >
                                    Agency Details
                                  </Typography>
                                </Box>
                                <Grid item xs={12} md={12}>
                                  <FastField
                                    component={BaseSwitchCard}
                                    box={{ mt: 3 }}
                                    label="Were you employed by an agency for this employment?"
                                    name={`employments.${index}.wasOnPayrollOfAgency`}
                                  />
                                </Grid>
                              </Box>
                              {get(
                                form.values,
                                `employments.${index}.wasOnPayrollOfAgency`
                              ) && (
                                <Box px={3} mt={3}>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} md={3}>
                                      <FastField
                                        component={BaseTextField}
                                        label="Agency Name*"
                                        name={`employments.${index}.agencyName`}
                                      />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                      <FastField
                                        component={BaseTextField}
                                        label="Address Line 1*"
                                        name={`employments.${index}.agencyStreetAddressLine1`}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <FastField
                                        component={BaseTextField}
                                        label="Address Line 2"
                                        name={`employments.${index}.agencyStreetAddressLine2`}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                      <FastField
                                        component={BaseTextField}
                                        label="City/Town/District*"
                                        name={`employments.${index}.agencyCityTownDistrict`}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                      <FastField
                                        component={BaseTextField}
                                        shouldUpdate={() => true}
                                        label={
                                          form?.values?.employments[index]
                                            ?.agencyCountryId === 101 ||
                                          form?.values?.employments[index]
                                            ?.agencyCountryId === 132
                                            ? "State/Province"
                                            : "State/Province*"
                                        }
                                        name={`employments.${index}.agencyStateProvince`}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                      <FastField
                                        component={BaseCountrySelect}
                                        label="Country*"
                                        name={`employments.${index}.agencyCountryId`}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                      <FastField
                                        component={BaseTextField}
                                        label="Zip/Postal/Area Code"
                                        name={`employments.${index}.agencyZipPostalAreaCode`}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                      <Typography
                                        varient="span"
                                        sx={{
                                          marginBottom: "4px",
                                        }}
                                      >
                                        Phone Number
                                      </Typography>
                                      <FastField
                                        name={`employments.${index}.agencyPhoneNumber`}
                                        codeName={`employments.${index}.agencyPhoneCountryCode`}
                                        placeholder="Your phone number"
                                        className="round_phone"
                                        component={PhoneNumberTextField}
                                      />
                                    </Grid>
                                  </Grid>
                                </Box>
                              )}
                            </Box>
                            {/* */}

                            <Box my={3} px={3}>
                              <Divider />
                            </Box>

                            {/* Form Company Address  */}
                            <Box
                              mt={3}
                              px={3}
                              display={"flex"}
                              alignItems="center"
                              className="space-x-2"
                            >
                              <PlaceOutlined />
                              <Typography fontSize={"20px"} fontWeight="500">
                                Company Details
                              </Typography>
                            </Box>
                            <Box px={3} mt={3}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <FastField
                                    component={BaseTextField}
                                    label="Address Line 1*"
                                    name={`employments.${index}.employerStreetAddressLine1`}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <FastField
                                    component={BaseTextField}
                                    label="Address Line 2"
                                    name={`employments.${index}.employerStreetAddressLine2`}
                                  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <FastField
                                    component={BaseTextField}
                                    label="City/Town/District*"
                                    name={`employments.${index}.employerCityTownDistrict`}
                                  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <FastField
                                    component={BaseTextField}
                                    shouldUpdate={() => true}
                                    label={
                                      form?.values?.employments[index]
                                        ?.employerCountryId === 101 ||
                                      form?.values?.employments[index]
                                        ?.employerCountryId === 132
                                        ? "State/Province"
                                        : "State/Province*"
                                    }
                                    name={`employments.${index}.employerStateProvince`}
                                  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <FastField
                                    component={BaseCountrySelect}
                                    label="Country*"
                                    name={`employments.${index}.employerCountryId`}
                                  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <FastField
                                    component={BaseTextField}
                                    label="Zip/Postal/Area Code"
                                    name={`employments.${index}.employerZipPostalAreaCode`}
                                  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <Typography
                                    varient="span"
                                    sx={{
                                      marginBottom: "4px",
                                    }}
                                  >
                                    Phone*
                                  </Typography>
                                  <FastField
                                    name={`employments.${index}.employerPhoneNumber`}
                                    codeName={`employments.${index}.employerPhoneCountryCode`}
                                    placeholder="Your phone number"
                                    // error={
                                    //   errors?.phoneNumber && touched?.phoneNumber
                                    // }
                                    // required
                                    className="round_phone"
                                    component={PhoneNumberTextField}
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                            {/* */}

                            <Box my={3} px={3}>
                              <Divider />
                            </Box>

                            {/* HR Details	  */}
                            <Box>
                              <Box
                                mt={3}
                                px={3}
                                display={"flex"}
                                alignItems="center"
                                className="space-x-2"
                              >
                                <InsertDriveFileOutlined />
                                <Typography fontSize={"20px"} fontWeight="500">
                                  HR Details
                                </Typography>
                              </Box>
                              <Box px={3} mt={3}>
                                <Grid container>
                                  <Grid item xs={12} md={12}>
                                    <Grid container spacing={2}>
                                      <Grid item xs={12} md={3}>
                                        <FastField
                                          component={BaseTextField}
                                          label="HR Name"
                                          name={`employments.${index}.hrName`}
                                        />
                                      </Grid>
                                      <Grid item xs={12} md={3}>
                                        <FastField
                                          component={BaseTextField}
                                          label="HR Title"
                                          name={`employments.${index}.hrTitle`}
                                        />
                                      </Grid>
                                      <Grid item xs={12} md={3}>
                                        <FastField
                                          component={BaseTextField}
                                          label="HR Email"
                                          name={`employments.${index}.hrEmail`}
                                        />
                                      </Grid>
                                      <Grid item xs={12} md={3}>
                                        <Typography
                                          varient="span"
                                          sx={{
                                            marginBottom: "4px",
                                          }}
                                        >
                                          Phone Number
                                        </Typography>
                                        <FastField
                                          name={`employments.${index}.hrPhoneNumber`}
                                          codeName={`employments.${index}.hrPhoneCountryCode`}
                                          placeholder="Phone Number"
                                          className="round_phone"
                                          component={PhoneNumberTextField}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Box>
                            {/* */}

                            <Box my={3} px={3}>
                              <Divider />
                            </Box>

                            {/* Form Supervisor Details  */}
                            <Box
                              mt={3}
                              px={3}
                              display={"flex"}
                              alignItems="center"
                              className="space-x-2"
                            >
                              <InsertDriveFileOutlined />
                              <Typography fontSize={"20px"} fontWeight="500">
                                Supervisor Details
                              </Typography>
                            </Box>
                            <Box px={3} mt={3}>
                              <Grid container>
                                <Grid item xs={12} md={12}>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} md={3}>
                                      <FastField
                                        component={BaseTextField}
                                        label="Supervisor Name"
                                        name={`employments.${index}.supervisorName`}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                      <FastField
                                        component={BaseTextField}
                                        label="Supervisor Title"
                                        name={`employments.${index}.supervisorTitle`}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                      <FastField
                                        component={BaseTextField}
                                        label="Supervisor Email"
                                        name={`employments.${index}.supervisorEmail`}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                      <Typography
                                        varient="span"
                                        sx={{
                                          marginBottom: "4px",
                                        }}
                                      >
                                        Phone Number
                                      </Typography>
                                      <FastField
                                        name={`employments.${index}.supervisorPhoneNumber`}
                                        codeName={`employments.${index}.supervisorPhoneCountryCode`}
                                        placeholder="Phone Number"
                                        // error={
                                        //   errors?.phoneNumber && touched?.phoneNumber
                                        // }
                                        // required
                                        className="round_phone"
                                        component={PhoneNumberTextField}
                                      />
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Box>
                            {/* */}

                            <Box my={3} px={3}>
                              <Divider />
                            </Box>

                            {/* Salary Details */}
                            <Box>
                              <Box px={3} mt={3}>
                                <Box
                                  display={"flex"}
                                  alignItems="center"
                                  className="space-x-2"
                                >
                                  <InsertDriveFileOutlined />
                                  <Typography
                                    fontSize={"20px"}
                                    fontWeight="500"
                                  >
                                    Salary Details
                                  </Typography>
                                </Box>
                                <Typography
                                  fontWeight={500}
                                  fontSize={"17px"}
                                  mt={2}
                                >
                                  *Please ensure the numbers you provide here
                                  matches your pay slips.
                                </Typography>
                              </Box>

                              <Box px={3} mt={3}>
                                <Grid container spacing={{ xs: 2, md: 3 }}>
                                  <Grid item xs={12} md={3}>
                                    <FastField
                                      component={BaseSelect}
                                      label="Salary Frequency*"
                                      name={`employments.${index}.salaryFrequencyId`}
                                      options={salaryFreq}
                                      optionLabel="salaryFrequencyName"
                                      optionValue="candidatesEmploymentSalaryFrequenciesId"
                                    />
                                  </Grid>
                                  {employment.salaryFrequencyId === 6 ? (
                                    <Grid item xs={12} md={3}>
                                      <FastField
                                        component={BaseTextField}
                                        label="Other salary frequency*"
                                        name={`employments.${index}.otherSalaryFrequency`}
                                      />
                                    </Grid>
                                  ) : null}
                                  <Grid item xs={12} md={3}>
                                    <FastField
                                      component={BaseCurrencyAutocomplete}
                                      label="Currency*"
                                      name={`employments.${index}.salaryCurrencyId`}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={3}>
                                    <FastField
                                      component={BaseTextField}
                                      type="number"
                                      label="Salary Amount*"
                                      name={`employments.${index}.salaryAmount`}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={3}>
                                    <FastField
                                      component={BaseTextField}
                                      label="Other Remuneration(s)"
                                      name={`employments.${index}.otherRemuneration`}
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <FastField
                                      component={BaseSwitchCard}
                                      box={{ my: 1 }}
                                      label="Did you received bonus from company?"
                                      name={`employments.${index}.wasBonusReceived`}
                                    />
                                  </Grid>
                                </Grid>
                                <FieldArray name={`employments.${index}.bonus`}>
                                  {({
                                    remove: bonusRemove,
                                    push: bonusPush,
                                  }) => (
                                    <>
                                      {employment.wasBonusReceived && (
                                        <>
                                          {employmentForm.current?.values?.employments[
                                            index
                                          ]?.bonus?.map(
                                            (bonusValue, bonusIndex) => (
                                              <Box key={bonusValue.id} mt={2}>
                                                <Grid
                                                  container
                                                  xs={12}
                                                  spacing={{
                                                    xs: 2,
                                                  }}
                                                  display="flex"
                                                  alignItems="center"
                                                >
                                                  <Grid
                                                    item
                                                    xs={12}
                                                    md={
                                                      bonusValue.bonusTypeId ===
                                                      3
                                                        ? 2.5
                                                        : 3.5
                                                    }
                                                  >
                                                    <FastField
                                                      component={
                                                        BaseCurrencyAutocomplete
                                                      }
                                                      label="Currency*"
                                                      name={`employments.${index}.bonus.${bonusIndex}.bonusCurrencyId`}
                                                    />
                                                  </Grid>
                                                  <Grid
                                                    item
                                                    xs={12}
                                                    md={
                                                      bonusValue.bonusTypeId ===
                                                      3
                                                        ? 3
                                                        : 4
                                                    }
                                                  >
                                                    <FastField
                                                      component={BaseTextField}
                                                      type="number"
                                                      label="Last Bonus Amount*"
                                                      name={`employments.${index}.bonus.${bonusIndex}.bonusAmount`}
                                                    />
                                                  </Grid>
                                                  <Grid
                                                    item
                                                    xs={12}
                                                    md={
                                                      bonusValue.bonusTypeId ===
                                                      3
                                                        ? 3
                                                        : 4
                                                    }
                                                  >
                                                    <FastField
                                                      component={BaseSelect}
                                                      name={`employments.${index}.bonus.${bonusIndex}.bonusTypeId`}
                                                      label="Bonus Type*"
                                                      optionLabel="bonusName"
                                                      optionValue="id"
                                                      options={bonusTypes}
                                                    />
                                                  </Grid>
                                                  {bonusValue.bonusTypeId ===
                                                  3 ? (
                                                    <Grid item xs={12} md={3}>
                                                      <FastField
                                                        component={
                                                          BaseTextField
                                                        }
                                                        type="text"
                                                        label="Other Bonus Type*"
                                                        name={`employments.${index}.bonus.${bonusIndex}.otherBonusTypeName`}
                                                      />
                                                    </Grid>
                                                  ) : null}
                                                  {employmentForm.current.values
                                                    .employments[index].bonus
                                                    .length > 1 && (
                                                    <Grid item xs={0.5} mt={2}>
                                                      <Box>
                                                        <IconButton
                                                          aria-label="delete"
                                                          onClick={async (
                                                            e
                                                          ) => {
                                                            e.stopPropagation();

                                                            bonusRemove(
                                                              bonusIndex
                                                            );
                                                            await Promise.resolve();
                                                          }}
                                                          color="error"
                                                        >
                                                          <DeleteOutline />
                                                        </IconButton>
                                                      </Box>
                                                    </Grid>
                                                  )}
                                                </Grid>
                                              </Box>
                                            )
                                          )}
                                          <Box
                                            mt={2}
                                            display="flex"
                                            justifyContent="flex-end"
                                          >
                                            <Button
                                              type="button"
                                              color="primary"
                                              variant="contained"
                                              onClick={() => {
                                                bonusPush(newBonusData());
                                              }}
                                              xs={{
                                                width: "100%",
                                              }}
                                            >
                                              Add
                                            </Button>
                                          </Box>
                                        </>
                                      )}
                                    </>
                                  )}
                                </FieldArray>
                              </Box>
                            </Box>
                            {/* */}

                            <Box my={3} px={3}>
                              <Divider />
                            </Box>

                            {/* Supporting Documents */}
                            <Box mt={3}>
                              <Box
                                px={3}
                                display={"flex"}
                                alignItems="center"
                                className="space-x-2"
                              >
                                <InsertDriveFileOutlined />
                                <Typography fontSize={"20px"} fontWeight="500">
                                  Supporting Documents
                                </Typography>
                              </Box>

                              <BaseUploadNew
                                multiple
                                mx={3}
                                mt={3}
                                label="Please attach your Appointment/Resignation/Relieving/Experience Letter"
                                onChange={(files, delObj, delAll) =>
                                  addAndRemoveImageHanlderArray({
                                    files,
                                    delObj,
                                    delAll,
                                    form,
                                    refForm: employmentForm,
                                    index,
                                    keyForArray: "employments",
                                    categoryName: "EMPLOYMENT_DOCS",
                                    dispatch,
                                    setDisableBtn,
                                  })
                                }
                                name={`employments.${index}.attachments`}
                                id={`accordion${form.values.employments.length}`}
                                uploadFiles={employment?.attachments}
                                form={form}
                                checkName={`employments.${index}.attachments`}
                                categoryName="EMPLOYMENT_DOCS"
                                key={`${index}_D`}
                                setDisableBtn={setDisableBtn}
                              />

                              <Box my={3} px={3}>
                                <Divider />
                              </Box>

                              <BaseUploadNew
                                multiple
                                mx={3}
                                my={3}
                                label="Please attach your latest payslip of this Employment"
                                onChange={(files, delObj, delAll) =>
                                  addAndRemoveImageHanlderArray({
                                    files,
                                    delObj,
                                    delAll,
                                    form,
                                    refForm: employmentForm,
                                    index,
                                    keyForArray: "employments",
                                    categoryName: "EMPLOYMENT_PAYSLIPS",
                                    dispatch,
                                    setDisableBtn,
                                  })
                                }
                                id={`accordion${form.values.employments.length}`}
                                uploadFiles={employment?.attachments}
                                form={form}
                                checkName={`employments.${index}.attachments`}
                                categoryName="EMPLOYMENT_PAYSLIPS"
                                name={`employments.${index}.attachments`}
                                key={`${index}_P`}
                                setDisableBtn={setDisableBtn}
                              />
                            </Box>
                            {/* */}
                          </>
                        ) : null
                      )}
                    </>
                  ) : (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Typography align="center" fontWeight={550} p={2}>
                        No Employments Present
                      </Typography>
                    </Box>
                  )}
                </>
              );
            }}
          </FieldArray>
        </>
      )}
    </>
  );
};

export default EmploymentFormDetails;
