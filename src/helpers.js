import moment from "moment";

export const toYMD = (date, fallback = date) => {
  return date ? moment(date).format("DD-MMM-YYYY") : fallback;
};
