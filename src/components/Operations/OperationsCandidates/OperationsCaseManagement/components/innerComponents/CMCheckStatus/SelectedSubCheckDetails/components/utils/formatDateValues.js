import moment from "moment";

export const formatDateValues = (logDetails, actionLogCategoriesInputs) => {
  //formatting date as per the input field types
  const formatDateTime = (value, inputFieldType) => {
    let format;

    // date
    if (inputFieldType === 6) {
      format = "DD MMM YYYY";
      return moment(value).format(format);
    } else if (inputFieldType === 5) {
      // date & time
      format = "DD MMM YYYY [at] h:mm:ss A";
      return moment(value).format(format);
    }

    return value;
  };

  //convert date values to respective date format
  Object.entries(logDetails).forEach(([key, value]) => {
    //if value is of date type
    if (moment(value, moment.ISO_8601, true).isValid()) {
      //will extract corresponding input field type
      let inputFieldType = actionLogCategoriesInputs?.find(
        (catDetails) => catDetails?.categoryInputName === key
      )?.categoryInputTypeId;

      if (inputFieldType) {
        //updating value with the calculated date format
        logDetails[key] = formatDateTime(value, inputFieldType);
      }
    }

    //if there are any extrafields present
    if (key.includes("extraFields")) {
      //first we will extract the original fieldname
      const extractedFieldName = key.split("-extraFields")[0];

      //then will loop over the extrafields
      Object.entries(logDetails[key]).forEach(
        ([extraFieldKey, extraFieldValue]) => {
          //will skip if key is 'label'
          if (extraFieldKey !== "label") {
            //extracting dropdown values attached to original fieldname
            let selectedDropdownLists = actionLogCategoriesInputs?.find(
              (catDetails) =>
                catDetails?.categoryInputName === extractedFieldName
            )?.actionLogCategoryInputFieldsL1Data;

            //extracting extra fields attached to selected dropdown value
            let extraFieldsDropdownLists = selectedDropdownLists?.find(
              (curr) =>
                curr?.categoryInputFieldNameL1 ===
                logDetails[extractedFieldName]
            )?.categoryInputFieldL2;

            //extracting input field type for the extra field
            let inputFieldType = extraFieldsDropdownLists?.find(
              (curr) =>
                curr?.fieldName === extraFieldKey ||
                curr?.fieldName.includes("respond")
            )?.fieldTypeId;

            if (inputFieldType) {
              //updating value with the calculated date format
              logDetails[key][extraFieldKey] = formatDateTime(
                extraFieldValue,
                inputFieldType
              );
            }
          }
        }
      );
    }
  });
};
