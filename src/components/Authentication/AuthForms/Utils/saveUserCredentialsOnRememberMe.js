export const saveUserCredentialsOnRememberMe = (checked,values) => {
  if (checked) {
    localStorage.setItem("RememberedEmail", values.email);
    localStorage.setItem("RememberedPassword", values.password);
  } else {
    localStorage.removeItem("RememberedEmail");
    localStorage.removeItem("RememberedPassword");
  }
};
