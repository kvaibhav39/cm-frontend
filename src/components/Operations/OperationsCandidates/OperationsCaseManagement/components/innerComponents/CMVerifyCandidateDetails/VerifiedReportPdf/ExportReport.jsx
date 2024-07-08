import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setToastNotification } from "../../../../../../../../store/actions/toastNotificationActions";
import { ERROR } from "../../../../../../../../store/constant";
import * as Comlink from "comlink";
import { useAsyncCallback } from "react-async-hook";
import Worker from "worker-loader!./webWorker/web.worker.js";

import CircularJSON from "circular-json";
import { LoadingButton } from "@mui/lab";
import { Box, Typography } from "@mui/material";

const ExportReport = () => {
  const {
    OpsBasicCandidateInfo,
    OpsCandidateCaseChecksList,
    allSubChecksLists,
  } = useSelector((state) => state.operations);
  const { candidateDetailsById, candidateDetailsByIdLoading } = useSelector(
    (state) => state.hr
  );

  let props = {
    OpsBasicCandidateInfo,
    OpsCandidateCaseChecksList,
    allSubChecksLists,
    candidateDetailsById,
  };

  const exportAction = useExportCallback(props);
  // console.log("00000", exportAction);

  return (
    <Box component="span">
      [
      {candidateDetailsByIdLoading ? (
        <Typography
          fontWeight={550}
          component="a"
          sx={{
            color: (theme) => theme.palette.primary.main,
          }}
        >
          Loading...
        </Typography>
      ) : exportAction?.status === "not-requested" ? (
        <Typography
          fontWeight={550}
          component="a"
          sx={{
            textDecoration: "underline",
            cursor: "pointer",
            color: (theme) => theme.palette.primary.main,
          }}
          onClick={exportAction.execute}
        >
          Click here to generate a report{" "}
        </Typography>
      ) : exportAction?.status === "success" && exportAction.result ? (
        <>
          <Typography
            fontWeight={550}
            component="a"
            sx={{
              textDecoration: "underline",
              cursor: "pointer",
              color: (theme) => theme.palette.primary.main,
            }}
            onClick={exportAction.execute}
          >
            Click here to again generate a report
          </Typography>
          ]&nbsp; [
          <Typography
            fontWeight={550}
            component="a"
            sx={{
              textDecoration: "underline",
              cursor: "pointer",
              color: (theme) => theme.palette.primary.main,
            }}
            href={exportAction.result}
            target="_blank"
          >
            View report
          </Typography>
        </>
      ) : exportAction?.status == "error" ? (
        <Typography
          component="a"
          sx={{
            color: (theme) => theme.palette.primary.main,
          }}
          fontWeight={550}
        >
          An error occurred while generating report...
        </Typography>
      ) : exportAction?.status === "loading" ? (
        <Typography
          component="a"
          sx={{
            color: (theme) => theme.palette.primary.main,
          }}
          fontWeight={550}
        >
          Generating report (Please wait for few mins)...
        </Typography>
      ) : null}
      ]
    </Box>
  );
};

const useExportCallback = (props) =>
  useAsyncCallback(async () => {
    const worker = new Worker();
    const pdfWorker = Comlink.wrap(worker);
    pdfWorker.onProgress(Comlink.proxy((info) => console.log(info)));

    let serializedProps = {
      OpsBasicCandidateInfo: CircularJSON.stringify(
        props?.OpsBasicCandidateInfo
      ),
      OpsCandidateCaseChecksList: props.OpsCandidateCaseChecksList,
      allSubChecksLists: props.allSubChecksLists,
      candidateDetailsById: CircularJSON.stringify(props?.candidateDetailsById),
    };

    serializedProps = CircularJSON.stringify(serializedProps);

    const pdfBlob = await pdfWorker.generateAll(serializedProps);
    return URL.createObjectURL(pdfBlob);
  });

export default ExportReport;
