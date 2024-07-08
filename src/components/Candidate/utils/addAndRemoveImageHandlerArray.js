import { handleUploadFilesApi } from "./handleUploadFilesApi";
import { CANDIDATE_SECTION_DISABLE_SUBMTI_BTN } from "../../../store/actions/actionTypes";
var tempApiCall = [];

export const addAndRemoveImageHanlderArray = async (handlerObj) => {
  var random = Math.random();

  let {
    files,
    delObj,
    delAll,
    form,
    refForm,
    index,
    keyForArray,
    categoryName,
    dispatch,
    setDisableBtn,
  } = handlerObj;

  try {
    let prevFiles;

    if (files) {
      tempApiCall.push(random);

      let savedFiles = await handleUploadFilesApi(
        files,
        categoryName,
        dispatch
      );

      prevFiles =
        refForm?.current?.values[`${keyForArray}`][index].attachments || [];

      let latestUploadedFiles = prevFiles.map((file) => {
        let present = savedFiles.find(
          (curr) =>
            curr.attachmentCategoryName === file.attachmentCategoryName &&
            curr.attachmentName === file?.file?.name
        );

        if (present) {
          return {
            ...present,
            status: "uploaded",
          };
        } else {
          return { ...file };
        }
      });

      form.setFieldValue(
        `${keyForArray}.${index}.attachments`,
        latestUploadedFiles
      );

      if (!tempApiCall?.length) {
        //enabling next and save progress btn
        dispatch({
          type: CANDIDATE_SECTION_DISABLE_SUBMTI_BTN,
          payload: false,
        });
        setDisableBtn(false);
      }
    } else if (delObj) {
      if (delObj && delAll === "all") {
        prevFiles =
          refForm?.current?.values[`${keyForArray}`][index].attachments || [];
        let tempFiles = prevFiles.filter((pf) => {
          if (
            !(
              pf?.attachmentCategoryName === delObj?.categoryName ||
              pf?.attachmentCategory === delObj?.categoryName ||
              pf?.categoryName === delObj?.categoryName
            )
          ) {
            return pf;
          }
        });

        form.setFieldValue(`${keyForArray}.${index}.attachments`, tempFiles);

        let count = tempFiles.filter(
          (curr) => curr.attachmentCategoryName === delObj?.categoryName
        )?.length;

        if (count === 0) {
          //enabling next and save progress btn
          setDisableBtn(false);
        }
      } else {
        prevFiles =
          refForm?.current?.values[`${keyForArray}`][index].attachments || [];
        let tempFiles = prevFiles.filter((pf) => {
          if (
            !(
              (pf?.attachmentName === delObj?.name1 ||
                pf?.name === delObj?.name1 ||
                pf?.file?.name === delObj?.name1) &&
              (pf?.attachmentCategoryName === delObj?.categoryName1 ||
                pf?.attachmentCategory === delObj?.categoryName1 ||
                pf?.categoryName === delObj?.categoryName1)
            )
          )
            return pf;
        });
        form.setFieldValue(`${keyForArray}.${index}.attachments`, tempFiles);

        let count = tempFiles.filter(
          (curr) => curr.attachmentCategoryName === delObj?.categoryName1
        )?.length;

        if (count === 0) {
          //enabling next and save progress btn
          setDisableBtn(false);
        }
      }
    }

    tempApiCall = tempApiCall.filter((curr) => curr !== random);

    if (!tempApiCall?.length) {
      //enabling next and save progress btn
      dispatch({ type: CANDIDATE_SECTION_DISABLE_SUBMTI_BTN, payload: false });
      setDisableBtn(false);
    }
  } catch (error) {
    tempApiCall = tempApiCall.filter((curr) => curr !== random);

    if (!tempApiCall?.length) {
      //enabling next and save progress btn
      dispatch({ type: CANDIDATE_SECTION_DISABLE_SUBMTI_BTN, payload: false });
      setDisableBtn(false);
    }
  }
};
