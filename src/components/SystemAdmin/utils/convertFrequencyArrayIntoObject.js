import { frequencyUnits } from "../constants/frequencyUnits";

export const convertFrequencyArrayIntoObject = (frequency) => {
  let frequencyArray = [];

  frequency.forEach((value) => {
    const reversedFrequencyUnits = [...frequencyUnits].reverse();

    let selectedUnit = reversedFrequencyUnits.find(
      (unit) => value % unit?.inHours === 0
    );

    frequencyArray.push({
      value: value / selectedUnit?.inHours,
      unit: selectedUnit?.unitVal,
    });
  });

  return frequencyArray;
};
