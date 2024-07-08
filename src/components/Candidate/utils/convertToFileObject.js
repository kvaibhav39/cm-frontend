import { convertToBlob } from "./convertToBlob";

export const convertToFileObject = async (base64Data, fileName, fileType) => {
  if (base64Data && fileName && fileType) {
    const blob = await convertToBlob(base64Data, fileType);
    return new File([blob], fileName, { type: fileType });
  }
};
