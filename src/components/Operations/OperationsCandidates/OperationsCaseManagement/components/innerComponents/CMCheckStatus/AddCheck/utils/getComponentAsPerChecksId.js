import AddressCheck from "../../../../../../../../Packages/CustomPackages/Checks/AddressCheck";
import EducationCheck from "../../../../../../../../Packages/CustomPackages/Checks/EducationCheck";
import EmploymentCheck from "../../../../../../../../Packages/CustomPackages/Checks/EmploymentCheck";
import ProfessionalLicense from "../../../../../../../../Packages/CustomPackages/Checks/ProfessionalLicense";
import IDCheck from "../../../../../../../../Packages/CustomPackages/Checks/IDCheck";
import ReferenceCheck from "../../../../../../../../Packages/CustomPackages/Checks/ReferenceCheck";
import IntegrityCheck from "../../../../../../../../Packages/CustomPackages/Checks/IntegrityCheck";
import AdditionalJurisdictionScope from "../../../../../../../../Packages/CustomPackages/Checks/AdditionalJurisdictionScope";
import { getCheckOrderId } from "./getCheckOrderId";
import UploadCV from "../../../../../../../../Candidates/CreateCandidate/UploadCV";

export const getComponentAsPerChecksId = (
  checksId,
  checks,
  questionnairesData,
  countries,
  checksCategory = ""
) => {
  let component = null;

  switch (checksId) {
    case 1:
      component = (
        <AddressCheck
          checkOrderId={getCheckOrderId(checks, checksId)}
          checkId={checksId}
          wrapperObject={checks}
        />
      );
      break;
    case 11:
      component = (
        <EducationCheck
          checkOrderId={getCheckOrderId(checks, checksId)}
          checkId={checksId}
          wrapperObject={checks}
        />
      );
      break;
    case 12:
      component = (
        <EmploymentCheck
          checkOrderId={getCheckOrderId(checks, checksId)}
          checkId={checksId}
          wrapperObject={checks}
        />
      );
      break;
    case 14:
      component = (
        <ProfessionalLicense
          checkOrderId={getCheckOrderId(checks, checksId)}
          checkId={checksId}
          wrapperObject={checks}
        />
      );
      break;
    case 2:
      component = (
        <IDCheck
          checkOrderId={getCheckOrderId(checks, checksId)}
          checkId={checksId}
          wrapperObject={checks}
        />
      );
      break;
    case 15:
      component = (
        <ReferenceCheck
          checkOrderId={getCheckOrderId(checks, checksId)}
          checkId={checksId}
          wrapperObject={checks}
          questionnairesData={questionnairesData}
        />
      );
      break;
    case 8:
      component = (
        <IntegrityCheck
          checkOrderId={getCheckOrderId(checks, checksId)}
          checkId={checksId}
          wrapperObject={checks}
          questionnairesData={questionnairesData}
        />
      );
      break;
    case 25:
      component = (
        <AdditionalJurisdictionScope
          checkOrderId={getCheckOrderId(checks, checksId)}
          checkId={checksId}
          wrapperObject={checks}
          countriesData={countries}
          checksCategory={checksCategory}
        />
      );
      break;
    case 10:
      component = <UploadCV addCheckFlag={true}/>;
      break;
    default:
      component = null;
  }

  return component;
};
