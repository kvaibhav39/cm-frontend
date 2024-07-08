import Heading from "./components/Heading";
import HistoryLog from "./components/HistoryLog";
import UpdateActionComponent from "./components/UpdateActionComponent";
import ActionLog from "./components/ActionLog";
import VerifierDetails from "./components/VerifierDetails";
import ViewFilledDetailsAndUpdateVerifierDetails from "./components/ViewFilledDetailsAndUpdateVerifierDetails";

const SelectedSubCheckDetails = () => {
  return (
    <>
      <Heading />
      <UpdateActionComponent />
      <VerifierDetails />
      <ViewFilledDetailsAndUpdateVerifierDetails />
      <ActionLog />
      <HistoryLog />
    </>
  );
};

export default SelectedSubCheckDetails;
