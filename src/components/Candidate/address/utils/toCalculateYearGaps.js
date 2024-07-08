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
      fromDate = add1month(fromDate);
    }
  }

  //insert a additional element endRange+1 in last
  sequencialInput.push(add1month(convertedEndRange));

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
      let gapEnd = remove1month(nextVal);
      gaps.push([gapStart, gapEnd]);
    }
    checkPointer = add1month(nextVal);
  }

  return gaps;
};

const add1month = (value) => {
  let newValue = new Date(value);
  return newValue.setMonth(newValue.getMonth() + 1);
};

const remove1month = (value) => {
  let newValue = new Date(value);
  return newValue.setMonth(newValue.getMonth() - 1);
};
