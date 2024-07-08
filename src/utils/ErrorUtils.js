export const errorUtils = {
  getError: (error) => {
    let e = error;
    if (error?.response) {
      if (error.response.data && error.response.data.error) {
        e = error.response.data.error; // my app specific keys override
      } else if (error.response.data && error.response.data.message) {
        e = error.response.data.message; // my app specific keys override
      }else{
        e = "Not Found"
      }
    } else if (error?.message) {
      e = error.message;
    } else {
      e = "Unknown error occurred";
    }
    return e;
  },
};
