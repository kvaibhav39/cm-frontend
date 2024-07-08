import { FastField, Field } from "formik";
import {
  BaseCountrySelect,
  BaseCurrencyAutocomplete,
  BaseDatePicker,
  BaseRadioGroup,
  BaseSelect,
  BaseTextField,
} from "../../../../../../../base";
import { InputTextField } from "../../../../../../../../common/Form/InputTextField/InputTextField";

export const verifierEmploymentHistoryFields = (
  reasonOfLeavingTypes,
  salaryFreq
) => [
  {
    value: "companyName",
    text: "Company name",
    renderField: (index) => (
      <Field component={BaseTextField} name={`${index}.verifiedCompanyName`} />
    ),
    getSetFieldName: (index) => `${index}.verifiedCompanyName`,
    verifiedFieldName: "verifiedCompanyName",
  },
  {
    value: "fromDate",
    text: "From date*",
    renderField: (index) => (
      <Field
        component={BaseDatePicker}
        name={`${index}.verifiedFromDate`}
        views={["year", "month", "day"]}
        placeholder="DD-MMM-YYYY"
        inputFormat="dd-MMM-yyyy"
      />
    ),
    getSetFieldName: (index) => `${index}.verifiedFromDate`,
    verifiedFieldName: "verifiedFromDate",
    toRemoveTimeFromDate: true,
  },
  {
    value: "toDate",
    text: "To date",
    renderField: (index) => (
      <Field
        component={BaseDatePicker}
        name={`${index}.verifiedToDate`}
        views={["year", "month", "day"]}
        placeholder="DD-MMM-YYYY"
        inputFormat="dd-MMM-yyyy"
      />
    ),
    getSetFieldName: (index) => `${index}.verifiedToDate`,
    verifiedFieldName: "verifiedToDate",
    toRemoveTimeFromDate: true,
  },
  {
    value: "employmentStatusName",
    text: "Employment status",
    renderField: (index) => (
      <FastField
        component={BaseRadioGroup}
        name={`${index}.verifiedEmploymentStatusId`}
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
    ),
    getValueFieldName: "employmentStatusId",
    getSetFieldName: (index) => `${index}.verifiedEmploymentStatusId`,
    verifiedFieldName: "verifiedEmploymentStatusId",
  },
  {
    value: "jobTitle",
    text: "Job title",
    renderField: (index) => (
      <FastField component={BaseTextField} name={`${index}.verifiedJobTitle`} />
    ),
    getSetFieldName: (index) => `${index}.verifiedJobTitle`,
    verifiedFieldName: "verifiedJobTitle",
  },
  {
    value: "reasonOfLeavingName",
    text: "Reason for leaving",
    renderField: (index) => (
      <FastField
        component={BaseSelect}
        optionLabel="reasonName"
        optionValue="id"
        name={`${index}.verifiedReasonForLeaving`}
        options={reasonOfLeavingTypes}
      />
    ),
    getValueFieldName: "reasonForLeaving",
    getSetFieldName: (index) => `${index}.verifiedReasonForLeaving`,
    verifiedFieldName: "verifiedReasonForLeaving",
  },
  {
    value: "otherReasonForLeaving",
    text: "Other reason for leaving",
    renderField: (index) => (
      <FastField
        component={BaseTextField}
        name={`${index}.verifiedOtherReasonForLeaving`}
      />
    ),
    getSetFieldName: (index) => `${index}.verifiedOtherReasonForLeaving`,
    verifiedFieldName: "verifiedOtherReasonForLeaving",
  },
  {
    value: "agencyName",
    text: "Agency Name",
    renderField: (index) => (
      <FastField
        component={BaseTextField}
        name={`${index}.verifiedAgencyName`}
      />
    ),
    getSetFieldName: (index) => `${index}.verifiedAgencyName`,
    verifiedFieldName: "verifiedAgencyName",
  },
  {
    value: "employerCountryName",
    text: "Employer Country",
    renderField: (index) => (
      <FastField
        component={BaseCountrySelect}
        name={`${index}.verifiedEmployerCountryId`}
      />
    ),
    getValueFieldName: "employerCountryId",
    getSetFieldName: (index) => `${index}.verifiedEmployerCountryId`,
    verifiedFieldName: "verifiedEmployerCountryId",
  },
  {
    value: "supervisorName",
    text: "Supervisor name",
    renderField: (index) => (
      <FastField
        component={BaseTextField}
        name={`${index}.verifiedSupervisorName`}
      />
    ),
    getSetFieldName: (index) => `${index}.verifiedSupervisorName`,
    verifiedFieldName: "verifiedSupervisorName",
  },
  {
    value: "supervisorTitle",
    text: "Supervisor title",
    renderField: (index) => (
      <FastField
        component={BaseTextField}
        name={`${index}.verifiedSupervisorTitle`}
      />
    ),
    getSetFieldName: (index) => `${index}.verifiedSupervisorTitle`,
    verifiedFieldName: "verifiedSupervisorTitle",
  },
  {
    value: "salaryFrequencyName",
    text: "Salary frequency",
    renderField: (index) => (
      <FastField
        component={BaseSelect}
        name={`${index}.verifiedSalaryFrequencyId`}
        options={salaryFreq}
        optionLabel="salaryFrequencyName"
        optionValue="candidatesEmploymentSalaryFrequenciesId"
      />
    ),
    getValueFieldName: "salaryFrequencyId",
    getSetFieldName: (index) => `${index}.verifiedSalaryFrequencyId`,
    verifiedFieldName: "verifiedSalaryFrequencyId",
  },
  {
    value: "salaryCurrencyName",
    text: "Salary currency",
    renderField: (index) => (
      <FastField
        component={BaseCurrencyAutocomplete}
        name={`${index}.verifiedSalaryCurrencyId`}
      />
    ),
    getValueFieldName: "salaryCurrencyId",
    getSetFieldName: (index) => `${index}.verifiedSalaryCurrencyId`,
    verifiedFieldName: "verifiedSalaryCurrencyId",
  },
  {
    value: "salaryAmount",
    text: "Salary amount",
    renderField: (index) => (
      <FastField
        component={BaseTextField}
        type="number"
        name={`${index}.verifiedSalaryAmount`}
      />
    ),
    getSetFieldName: (index) => `${index}.verifiedSalaryAmount`,
    verifiedFieldName: "verifiedSalaryAmount",
  },
  {
    value: "otherRemuneration",
    text: "Other Remuneration(s)",
    renderField: (index) => (
      <FastField
        component={BaseTextField}
        name={`${index}.verifiedOtherRemuneration`}
      />
    ),
    getSetFieldName: (index) => `${index}.verifiedOtherRemuneration`,
    verifiedFieldName: "verifiedOtherRemuneration",
  },
  {
    headerArray: true,
    text: "Bonus",
    value: "bonus",
    headerValues: [
      {
        value: "bonusCurrencyName",
        text: "Bonus currency",
        renderField: (index, displayIndex) => (
          <FastField
            component={BaseCurrencyAutocomplete}
            name={`${index}.bonus.${displayIndex}.verifiedBonusCurrencyId`}
          />
        ),
        getValueFieldName: "bonusCurrencyId",
        getSetFieldName: (index, displayIndex) =>
          `${index}.bonus.${displayIndex}.verifiedBonusCurrencyId`,
        verifiedFieldName: "verifiedBonusCurrencyId",
      },
      {
        value: "bonusAmount",
        text: "Last bonus amount",
        renderField: (index, displayIndex) => (
          <FastField
            component={BaseTextField}
            type="number"
            name={`${index}.bonus.${displayIndex}.verifiedBonusAmount`}
          />
        ),
        getSetFieldName: (index, displayIndex) =>
          `${index}.bonus.${displayIndex}.verifiedBonusAmount`,
        verifiedFieldName: "verifiedBonusAmount",
      },
    ],
    verifiedFieldName: "bonusData",
  },
];

export const verifierEmploymentHistoryExtraFieldsForPDF = [
  {
    value: "-",
    text: "Supplement Information",
    renderField: (index) => (
      <Field
        multiline
        component={InputTextField}
        name={`${index}.supplementInformation`}
      />
    ),
    verifiedFieldName: "supplementInformation",
  },
  // {
  //   value: "eligibleForRehire",
  //   text: "Eligible for rehire?",
  //   renderField: (index) => (
  //     <Field
  //       component={BaseRadioGroup}
  //       name={`${index}.eligibleForRehire`}
  //       options={[
  //         {
  //           value: "Yes",
  //           label: "Yes",
  //         },
  //         {
  //           value: "No",
  //           label: "No",
  //         },
  //       ]}
  //     />
  //   ),
  //   verifiedFieldName: "eligibleForRehire",
  // },
  // {
  //   value: "reasonForNoRehire",
  //   text: "Reason for not rehiring?",
  //   renderField: (index) => (
  //     <Field component={BaseTextField} name={`${index}.reasonForNoRehire`} />
  //   ),
  //   verifiedFieldName: "reasonForNoRehire",
  //   conditionToDisplay: (value) => value?.eligibleForRehire === "No",
  // },
  {
    value: "-",
    text: "Eligible for rehire?",
    renderField: (index) => (
      <Field
        multiline
        component={InputTextField}
        name={`${index}.eligibleForRehire`}
      />
    ),
    verifiedFieldName: "eligibleForRehire",
  },
  {
    value: "-",
    text: "Any disciplinary action / infringement against the candidate?",
    renderField: (index) => (
      <Field
        multiline
        component={InputTextField}
        name={`${index}.disciplinaryAction`}
      />
    ),
    verifiedFieldName: "disciplinaryAction",
  },
];
