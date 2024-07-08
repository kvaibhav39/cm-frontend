export const removeEmptyObjects = (obj) => {
  // Function to remove empty objects from an object
  Object.keys(obj).forEach((key) => {
    if (
      typeof obj[key] === "object" &&
      obj[key] &&
      Object.keys(obj[key]).length === 0 &&
      !(obj[key] instanceof Date)
    ) {
      delete obj[key];
    }
  });
};
