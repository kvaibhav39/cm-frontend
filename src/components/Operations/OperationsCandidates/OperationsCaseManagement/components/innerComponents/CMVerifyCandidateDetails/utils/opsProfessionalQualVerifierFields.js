import { FastField, Field } from "formik";
import {
  BaseCountrySelect,
  BaseDatePicker,
  BaseSelect,
  BaseTextField,
} from "../../../../../../../base";
import { InputTextField } from "../../../../../../../../common/Form/InputTextField/InputTextField";

export const verifierProfessionalQualFields = (qualificationStatuses) => [
  {
    value: "professionalQualificationTitle",
    text: "Professional qualification title",
    renderField: (index) => (
      <FastField
        component={BaseTextField}
        name={`${index}.verifiedProfessionalQualificationTitle`}
      />
    ),
    getSetFieldName: (index) =>
      `${index}.verifiedProfessionalQualificationTitle`,
    verifiedFieldName: "verifiedProfessionalQualificationTitle",
  },
  {
    value: "qualifyingInstituteBodyName",
    text: "Qualifying Institute/body name",
    renderField: (index) => (
      <FastField
        component={BaseTextField}
        name={`${index}.verifiedQualifyingInstituteBodyName`}
      />
    ),
    getSetFieldName: (index) => `${index}.verifiedQualifyingInstituteBodyName`,
    verifiedFieldName: "verifiedQualifyingInstituteBodyName",
  },
  {
    value: "statusProfessionalQualificationName",
    text: "Status of Your Professional Qualification",
    renderField: (index) => (
      <FastField
        component={BaseSelect}
        options={qualificationStatuses}
        optionLabel="statusProfessionalQualificationName"
        optionValue="candidatesProfessionalQualificationsStatusId"
        name={`${index}.verifiedStatusProfessionalQualificationId`}
      />
    ),
    getValueFieldName: "statusProfessionalQualificationId",
    getSetFieldName: (index) =>
      `${index}.verifiedStatusProfessionalQualificationId`,
    verifiedFieldName: "verifiedStatusProfessionalQualificationId",
  },
  {
    value: "fromDate",
    text: "From date",
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
    value: "dateOfAccreditation",
    text: "Date of accreditation",
    renderField: (index) => (
      <Field
        component={BaseDatePicker}
        name={`${index}.verifiedDateOfAccreditation`}
        views={["year", "month", "day"]}
        placeholder="DD-MMM-YYYY"
        inputFormat="dd-MMM-yyyy"
      />
    ),
    getSetFieldName: (index) => `${index}.verifiedDateOfAccreditation`,
    verifiedFieldName: "verifiedDateOfAccreditation",
    toRemoveTimeFromDate: true,
  },
  {
    value: "countryName",
    text: "Country",
    renderField: (index) => (
      <FastField
        component={BaseCountrySelect}
        name={`${index}.verifiedCountryId`}
      />
    ),
    getValueFieldName: "countryId",
    getSetFieldName: (index) => `${index}.verifiedCountryId`,
    verifiedFieldName: "verifiedCountryId",
  },
];

export const verifierProfessionalQualExtraFieldsForPDF = [
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
