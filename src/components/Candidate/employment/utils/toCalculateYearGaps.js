export const toCalculateYearGaps = (
  convertedUserDates,
  convertedStartRange,
  convertedEndRange
) => {
  let sequencialInput = [];

  for (let i = 0; i < convertedUserDates.length; i++) {
    let fromDate = convertedUserDates[i][0];
    let toDate = convertedUserDates[i][1];
    while (fromDate <= toDate) {
      sequencialInput.push(fromDate);
      fromDate = add1Day(fromDate);
    }
  }

  //insert a additional element endRange+1 in last
  sequencialInput.push(add1Day(convertedEndRange));

  //sort array
  sequencialInput.sort(function (a, b) {
    return a - b;
  });

  //remove duplicates to handle overlapping inputs
  const uniqueDates = Object.values(
    sequencialInput.reduce((a, c) => ((a[c.toString()] = c), a), {})
  );

  let gaps = [];
  let checkPointer = convertedStartRange;

  for (let i = 0; i < uniqueDates.length; i++) {
    let nextVal = uniqueDates[i];
    if (nextVal !== checkPointer) {
      let gapStart = checkPointer;
      let gapEnd = remove1Day(nextVal);
      gaps.push([gapStart, gapEnd]);
    }
    checkPointer = add1Day(nextVal);
  }

  return gaps;
};

const add1Day = (value) => {
  let newValue = new Date(value);

  if (newValue instanceof Date && !isNaN(newValue)) {
    let milliseconds = newValue.setDate(newValue.getDate() + 1);
    let isoDate = new Date(milliseconds);
    return isoDate;
  }

  return newValue;
};

const remove1Day = (value) => {
  let newValue = new Date(value);

  if (newValue instanceof Date && !isNaN(newValue)) {
    let milliseconds = newValue.setDate(newValue.getDate() - 1);
    let isoDate = new Date(milliseconds);
    return isoDate;
  }

  return newValue;
};
