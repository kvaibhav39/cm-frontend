import moment from "moment";

export const rangeSelectors = [
  {
    label: "MTD",
    value: "mtd",
    dates: {
      toDate: moment().add(2, 'days').format('YYYY-MM-DD'),
      fromDate: moment().startOf("month").format('YYYY-MM-DD'),
    },
  },
  {
    label: "QTD",
    value: "qtd",
    dates: {
      toDate: moment().add(2, 'days').format('YYYY-MM-DD'),
      fromDate: moment().startOf("quarter").format('YYYY-MM-DD'),
    },
  },
  {
    label: "YTD",
    value: "ytd",
    dates: {
      toDate: moment().add(2, 'days').format('YYYY-MM-DD'),
      fromDate: moment().startOf("year").format('YYYY-MM-DD'),
    },
  },
  {
    label: "LAST ONE YEAR",
    value: "LAST ONE YEAR",
    dates: {
      toDate: moment().format('YYYY-MM-DD'),
      fromDate: moment().subtract(1, 'years').format('YYYY-MM-DD'),
    },
  },
  {
    label: "CUSTOM RANGE",
    value: "CUSTOM RANGE",
    dates: {
      toDate: moment().format('YYYY-MM-DD'),
      fromDate: moment().startOf("year").format('YYYY-MM-DD'),
    },
  },
];
export const verficationProcess = [
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "In-Progress",
    value: "In-Progress",
  },
  {
    label: "Unsubmitted",
    value: "Unsubmitted",
  },
  {
    label: "Terminated",
    value: "Terminated",
  },
  {
    label: "Waiting Third Party",
    value: "Waiting Third Party",
  },
];
export const verficationResult = [
  {
    label: "No Discripancy",
    value: "No Discripancy",
  },
  {
    label: "Minor Discripancy",
    value: "Minor Discripancy",
  },
  {
    label: "Major Discripancy",
    value: "Major Discripancy",
  },
  {
    label: "Unable to Verify",
    value: "Unable to Verify",
  },
];
