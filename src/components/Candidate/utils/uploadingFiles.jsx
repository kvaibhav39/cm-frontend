import { uploadFileUtils } from "../../../store/actions/helperActions";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction.js";

export const uploadingFiles = async (
  file,
  dispatch,
  newFileArr,
  categoryName,
  type = "",
  runWhenSuccess = () => {},
  query = {}
) => {
  let logDetails = getCurrentFileNameAndFunction(
    import.meta.url,
    "uploadingFiles"
  );

  const data = await dispatch(
    uploadFileUtils(
      logDetails,
      {
        file,
      },
      {
        category: categoryName,
        multiple: true,
      },
      runWhenSuccess,
      query
    )
  );

  if (type === "additional-info") {
    return data && data[0]?.fileAttachmentPath;
  } else {
    data?.map((attachment) => {
      newFileArr.push({
        attachmentName: attachment?.fileName,
        attachmentPath: attachment?.fileAttachmentPath,
        attachmentCategoryName: attachment?.attachmentCategoryName,
      });
    });
  }
};
