export const getCurrentFileNameAndFunction = (filePath, functionName) => {
  const relativePath = extractPathAfterSrc(filePath);
  return `File path : ${relativePath} | Function : ${functionName}`;
};

const extractPathAfterSrc = (url) => {
  const srcIndex = url.indexOf("/src/");
  if (srcIndex !== -1) {
    return url.substring(srcIndex + 1);
  }
  return url;
};
