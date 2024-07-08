export const convertToDay = (value, perimeter) => {
    let temp = new Date(value);
    if (perimeter === "start") {
      return new Date(temp.getFullYear(), temp.getMonth(), 1);
    } else {
      return new Date(temp.getFullYear(), temp.getMonth() + 1, 0);
    }
  };