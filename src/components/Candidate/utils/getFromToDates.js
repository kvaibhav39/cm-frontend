import moment from "moment";

export const fromTo = ({ fromDate, toDate }, hideDate = false) => {
  if (!fromDate || !toDate) return "";
  return `( From ${moment(fromDate).format(
    hideDate ? "MMM YYYY" : "DD MMM YYYY"
  )} to ${moment(toDate).format(hideDate ? "MMM YYYY" : "DD MMM YYYY")} )`;
};
