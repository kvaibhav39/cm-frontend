export const checkFromDateToDate = (logDetails) => {
  let fromDateisGreaterThanToDate = false;

  Object.keys(logDetails).forEach((key) => {
    if (key.includes("extraFields")) {
      // Check if 'from' and 'to' keys are present
      const extraFields = logDetails[key];
      if (extraFields && extraFields.from && extraFields.To) {
        const fromDate = new Date(extraFields.from);
        const toDate = new Date(extraFields.To);

        // Compare 'from' and 'to' dates
        if (fromDate >= toDate) {
          return (fromDateisGreaterThanToDate = true);
        }
      }
    }
  });

  return fromDateisGreaterThanToDate;
};
