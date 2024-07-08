import moment from "moment";

export const calculateM1DueDate = (submissionDate) => {
  const submissionMoment = moment(submissionDate);

  let dueDate = submissionMoment.add(3, "days");

  // Check if the dueDate falls on a Saturday or Sunday (6 or 0 in Moment.js)
  if (dueDate.day() === 6 || dueDate.day() === 0) {
    // If it's Saturday (6), add 2 days to make it Monday; if it's Sunday (0), add 1 day
    dueDate.add(dueDate.day() === 6 ? 2 : 1, "days");
  }

  // Get the current date
  const currentDate = moment();

  // Calculate the difference in days between the current date and due date
  const differenceInDays = dueDate.diff(currentDate, "days");

  return { dueDate: dueDate.format("DD-MM-YYYY"), differenceInDays };
};
