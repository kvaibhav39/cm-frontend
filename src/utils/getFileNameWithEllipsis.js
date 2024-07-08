export const getFileNameWithEllipsis = (name, maxLength = 25) => {
  return name?.length > maxLength
    ? `${name.slice(0, maxLength - 5)}...${
        name.split(".")[0][name.split(".")[0]?.length - 1]
      }${name?.match(/.[^.]+$/)}`
    : name;
};
