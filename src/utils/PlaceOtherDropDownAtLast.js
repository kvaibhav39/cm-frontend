export const placeOtherDropdownAtLast = (dropdownArr) => {
  dropdownArr?.forEach((value, index) => {
    for (let key in value) {
      if ("Other" === value[key] || "Others" == value[key]) {
        dropdownArr.push(value);
        dropdownArr.splice(index, 1);
        return;
      }
    }
  });
  return dropdownArr;
};
