import * as Comlink from "comlink";
import { pdf } from "@react-pdf/renderer";
import "./workerShim";
import BackgroundScreeningPDF from "../BackgroundScreeningPDF";
import CircularJSON from "circular-json";

/* This prevents live reload problems during development
 * https://stackoverflow.com/questions/66472945/referenceerror-refreshreg-is-not-defined */
if (process.env.NODE_ENV != "production") {
  global.$RefreshReg$ = () => {};
  global.$RefreshSig$ = () => () => {};
}

let progressCb = console.info;

const generateAll = async (serializedProps) => {
  progressCb({
    progress: 1,
    current: 0,
    total: serializedProps?.allSubChecksLists?.length,
  });

  const pdfBlob = await generateSingle(serializedProps);

  const current = 1;
  const progress = (current / serializedProps?.allSubChecksLists?.length) * 100;
  progressCb({
    progress,
    current,
    total: serializedProps?.allSubChecksLists?.length,
  });

  return pdfBlob;
};

const generateSingle = async (serializedProps) => {
  let props = CircularJSON.parse(serializedProps);
  props = {
    OpsBasicCandidateInfo: CircularJSON.parse(props?.OpsBasicCandidateInfo),
    allSubChecksLists: props.allSubChecksLists,
    OpsCandidateCaseChecksList: props.OpsCandidateCaseChecksList,
    candidateDetailsById: CircularJSON.parse(props?.candidateDetailsById),
  };
  const document = <BackgroundScreeningPDF {...props} />;

  const pdfBuilder = pdf(document);
  return await pdfBuilder.toBlob();
};

const onProgress = (cb) => (progressCb = cb);

Comlink.expose({
  generateAll,
  generateSingle,
  onProgress,
});
