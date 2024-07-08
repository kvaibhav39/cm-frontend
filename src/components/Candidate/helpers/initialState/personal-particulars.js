import { uid } from "../../../base";

export const newNickName = () => {
  return {
    lastName: "",
    firstName: "",
    middleName: "",
    isExpanded: true,
  };
};

export const newFormerName = () => {
  return {
    formerName: "",
    formerNameDateChange: "",
    id: uid(10),
  };
};

export const newOtherName = () => {
  return {
    otherName: "",
    pinyinName:"",
    otherNameLanguageId: null,
    id: uid(10),
  };
};

export const newPersonalParticular = () => {
  return {
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    countryOfBirthId: null,
    gender: "M",
    personalEmail: "",
    personalParticularNumber: [
      {
        mobileNumberCountryCode: "",
        mobileNumber: "",
      },
    ],
    otherNameExists: false,
    formerNameExists: false,
    nickNameExists: false,
    nickName: [newNickName()],
    formerNames: [newFormerName()],
    otherNames: [newOtherName()],
    DINNumberExists: false,
    DINNumber: null,
    driverLicenseNumberExists: false,
    driverLicenseNumber: null,
    driverLicenseFrontCopy: null,
    driverLicenseBackCopy: null,
  };
};
