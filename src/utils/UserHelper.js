export const getLoggedInUserHrOrganizationId = () => {
  let currentLoginProfile = localStorage.getItem("loginProfile");

  let { CheckMinistryUser } = JSON.parse(
    localStorage.getItem(`${currentLoginProfile}_login`)
  );

  const loggedUser = JSON.parse(CheckMinistryUser);

  //we will extract org id from the url
  const searchParams = new URLSearchParams(window.location.search);

  return (
    loggedUser?.hrOrganization?.hrOrganizationId ||
    loggedUser?.hrTeams[0]?.hrOrganizationId ||
    +searchParams.get("orgId") ||
    +searchParams.get("hrOrganizationIds")
  );
};
