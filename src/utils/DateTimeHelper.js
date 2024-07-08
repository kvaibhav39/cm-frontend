import spacetime from "spacetime";

export const getTimestampFromString = (
  dateString,
  timezone = "UTC",
  format = "dd-MMM-YYYY"
) => spacetime(new Date(dateString), timezone).unixFmt(format);
