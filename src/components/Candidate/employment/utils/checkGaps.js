import { convertToDay } from "../utils/convertToDay";
import { toCalculateYearGaps } from "../utils/toCalculateYearGaps";
import moment from "moment";

export const checkGaps = (valuesParam, sectionData, setEmpGap) => {
  const values = [...valuesParam?.employments];
  let from = new Date(
    sectionData?.section?.validationScope?.startDate
  ).getTime();
  let until = new Date(
    sectionData?.section?.validationScope?.endDate
  ).getTime();
  let newArr = [];

  values?.forEach((employment) => {
    if (employment?.fromDate && employment?.toDate) {
      let fromDt = new Date(employment?.fromDate);
      let toDt = new Date(employment?.toDate);

      if (fromDt < from) {
        fromDt = from;
      }

      newArr.push([convertToMidnight(fromDt), convertToMidnight(toDt)]);
    }
  });
  let chunks = [];

  let convertedStartRange = convertToDay(from, "start");
  let convertedEndRange = convertToDay(until, "end");
  let convertedUserDates = [];

  newArr.forEach((curr) => convertedUserDates.push([curr[0], curr[1]]));

  chunks = toCalculateYearGaps(
    convertedUserDates,
    convertedStartRange,
    convertedEndRange
  );

  let finalChunks = [];
  chunks.map((curr) => {
    if (
      sectionData?.section?.validationScope?.gapDurationInMonths <=
      monthDiff(new Date(curr[0]), new Date(curr[1]))
    ) {
      finalChunks.push([curr[0], curr[1]]);
    }
  });

  let temp = [];
  let temp1 = [];

  finalChunks.map((chunkGap, ind1) => {
    temp.push({
      gapStartDate: moment(chunkGap[0]).format(),
      gapEndDate: moment(chunkGap[1]).format(),
      reasonOfGapId:
        valuesParam?.employmentsGaps?.length &&
        valuesParam?.employmentsGaps[ind1]
          ? valuesParam?.employmentsGaps[ind1].reasonOfGapId
          : null,
      additionalComments:
        valuesParam?.employmentsGaps?.length &&
        valuesParam?.employmentsGaps[ind1]
          ? valuesParam?.employmentsGaps[ind1].additionalComments
          : "",
    });

    temp1.push({
      additionalComments: "",
      reasonOfGapId: null,
    });
  });

  setEmpGap([...temp]);
  return [...temp1];
};

const monthDiff = (d1, d2) => {
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
};

const convertToMidnight = (value) => {
  let newValue = new Date(value).setHours(0, 0, 0, 0);
  return new Date(newValue);
};
