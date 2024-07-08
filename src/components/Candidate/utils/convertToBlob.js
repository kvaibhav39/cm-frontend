export const convertToBlob = async (base64, type) => {
  return await (await fetch(base64)).blob();
};
