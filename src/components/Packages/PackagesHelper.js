import * as Yup from "yup";

export const getPackageId = (params) => {
  const prefix = params.row.packageType === "SYSTEM" ? "P" : "CP";
  return `${prefix}${params.row.packagesId || ""}`;
};

export const getCreatedByInitials = (params) => {
  const packageType = params.row.packageType;
  return packageType === "SYSTEM"
    ? "System"
    : params.row.createdByUser?.userName;
};

export const getPackageIndustries = (params) => {
  const packageIndustry = params?.row?.packageIndustries?.industryName;
  return packageIndustry;
};
export const PackageValidationSchema = Yup.object({
  packageName: Yup.string()
    .required("Package name is required")
    .max(100, "Should not exceed 50 characters"),
  packageDescription: Yup.string()
    .required("Package description is required")
    .max(500, "Should not exceed 50 characters"),
});
