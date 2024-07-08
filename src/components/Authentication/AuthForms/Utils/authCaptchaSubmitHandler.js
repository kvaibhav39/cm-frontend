export const authCaptchaSubmitHandler = async (
  recaptchaRef,
  scriptedRef,
  dispatch,
  actionHandler,
  data,
  successCallback = (res = "") => {},
  failureCallback = (err = "") => {},
  logDetails
) => {
  try {
    const token = await recaptchaRef?.current?.executeAsync();

    if (token && scriptedRef?.current) {
      dispatch(
        actionHandler(data, successCallback, failureCallback, logDetails)
      );
    }
  } catch (err) {
    failureCallback(err);
  } finally {
    recaptchaRef?.current?.reset();
  }
};
