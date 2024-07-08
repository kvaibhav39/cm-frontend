export const updateProfileInitialValues = (userName, userPhone) => {
  return {
    userName: userName || "",
    phoneNumber: userPhone || "",
  };
};
