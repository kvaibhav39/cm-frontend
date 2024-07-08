export const removeTimeFromDate = (value) => {
  if (value) {
    const dateObj = new Date(value);

    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    let formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`; //yyyy-mm-dd

    return formattedDate;
  }

  return value;
};
