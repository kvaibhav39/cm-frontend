//function to dynamically extract path name from url with params for switch account back url
export const getExtractPathWithParams = () => {
  let url = window.location.href;
  const pathWithParamsRegex = /^https?:\/\/[^\/]+(\/[^#]+)/;
  const match = url?.match(pathWithParamsRegex);
  return match ? match[1] : null;
};
