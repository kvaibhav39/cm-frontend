export const routeUserAsPerRole = (res, navigate) => {
  if (res?.roleId === 4) {
    navigate("/ops/dashboard");
  } else if (res.roleId === 3) {
    navigate("/candidate/profile");
  } else if (
    ((!res.hrOrganization && res?.hrTeams?.length === 0) || !res?.userName) &&
    res.roleId === 2
  ) {
    navigate("/hr/first-login");
  } else if (res.roleId === 2) {
    navigate("/hr/dashboard");
  } else if (res.roleId === 1) {
    navigate("/system-admin/home");
  } else {
    navigate("/login");
  }
};
