import axios from "axios";

const setHeaders = () => {
  let currentLoginProfile = localStorage.getItem("loginProfile");

  //extracting current profile login's token to call apis
  if (localStorage.getItem(`${currentLoginProfile}_login`)) {
    let { token } = JSON.parse(
      localStorage.getItem(`${currentLoginProfile}_login`)
    );

    //to check if second login is present
    const isSecondLoginProfilePresent = localStorage.getItem("second_login");

    if (token) {
      let headerToken = {
        token,
        Accept: "application/json",
      };

      //if second login is present we will attach the first login's token to the headers
      if (isSecondLoginProfilePresent) {
        const { token: FirstToken } = JSON.parse(
          localStorage.getItem("first_login")
        );

        return {
          ...headerToken,
          highAuthToken: FirstToken,
        };
      }

      return headerToken;
    }
  }
  return {};
};

export const get = (url, params, token = false) => {
  let headers = {
    token: `Bearer ${token}`,
    Accept: "application/json",
  };

  return axios({
    method: "get",
    url: url,
    params: params ? params : {},
    headers: token ? headers : setHeaders(),
  });
};

export const post = (url, body, params, onUploadProgress = false) => {
  let requestObject = {
    method: "post",
    url: url,
    params: params ? params : {},
    data: body,
    headers: setHeaders(),
  };

  if (onUploadProgress) {
    requestObject.onUploadProgress = (progressEvent) => {
      const progress = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
    };
  }
  return axios(requestObject);
};

export const put = (url, body, params) => {
  return axios({
    method: "put",
    url: url,
    params: params ? params : {},
    data: body,
    headers: setHeaders(),
  });
};

export const deleteMethod = (url, body, params) => {
  return axios({
    method: "delete",
    url: url,
    params: params ? params : {},
    data: body,
    headers: setHeaders(),
  });
};
