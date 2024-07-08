import { toCalculateYearGaps } from "./toCalculateYearGaps";

export const checkGaps = (valuesParam,sectionData,setGaps) => {
    const values = valuesParam.addresses;
    let from = new Date(
      sectionData?.section?.validationScope?.startDate
    ).getTime();

    let until = new Date(
      sectionData?.section?.validationScope?.endDate
    ).getTime();
    let newArr = [];
    values?.map((address) => {
      if (address?.fromDate && address?.toDate) {
        let fromDt = new Date(address?.fromDate).getTime();
        if (fromDt < from) {
          fromDt = from;
        }
        let toDt = new Date(address?.toDate).getTime();
        newArr.push([fromDt, toDt]);
      }
    });

    let chunks = [];
    let convertedStartRange = convertToDay1AndTimeMidnight(from);
    let convertedEndRange = convertToDay1AndTimeMidnight(until);
    let convertedUserDates = [];

    newArr.map((curr) =>
      convertedUserDates.push([
        convertToDay1AndTimeMidnight(curr[0]),
        convertToDay1AndTimeMidnight(curr[1]),
      ])
    );

    chunks = toCalculateYearGaps(
      convertedUserDates,
      convertedStartRange,
      convertedEndRange
    );

    setGaps(chunks);
    return chunks;
  };

  const convertToDay1AndTimeMidnight = (value) => {
    let temp = new Date(value).setDate(1);
    return new Date(temp).setHours(0, 0, 0, 0);
  };