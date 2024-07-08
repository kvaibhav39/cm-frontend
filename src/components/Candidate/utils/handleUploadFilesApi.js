import { uploadingFiles } from "./uploadingFiles";

export const handleUploadFilesApi = async (
  allFiles,
  categoryName,
  dispatch
) => {
  let oldArr = [];
  let newFileArr = [];

  for (let file of allFiles) {
    if (file?.file) {
      oldArr.push(file.file);
    }
  }

  await uploadingFiles(oldArr, dispatch, newFileArr, categoryName);

  return newFileArr;
};
