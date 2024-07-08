export const HEADERS = (hrOrganizationName = "") => {
  return {
    PERSONAL_PERTICULAR: [
      { value: "firstName", text: "First name*" },
      { value: "middleName", text: "Middle name" },
      { value: "lastName", text: "Last name*" },
      { value: "gender", text: "Gender*" },
      { value: "dateOfBirth", text: "Date of birth*" },
      { value: "countryOfBirthName", text: "Place of birth*" },
      { value: "personalEmail", text: "Personal email address*" },
      { value: "mobileNumber", text: "Phone number*" },
      {
        heading: true,
        text: "Other Names",
      },
      {
        value: "otherNameExists",
        text: "Do you have name in other language?",
      },
      {
        headerArray: true,
        text: "Other Names",
        value: "otherNames",
        headerValues: [
          {
            value: "otherNameLanguageName",
            text: "Selected language*",
          },
          {
            value: "otherName",
            text: "Name in selected language*",
          },
          {
            value: "pinyinName",
            text: "Name In Pinyin*",
          },
        ],
      },
      {
        heading: true,
        text: "Former Names",
      },
      { value: "formerNameExists", text: "Do you have any former name?" },
      {
        headerArray: true,
        text: "Former Names",
        value: "formerNames",
        headerValues: [
          {
            value: "formerName",
            text: "Former name*",
          },
          {
            value: "formerNameDateChange",
            text: "Effective date of the name change*",
          },
        ],
      },
      {
        heading: true,
        text: "Nick Names",
      },
      { value: "nickNameExists", text: "Do you have any alias/nickname?*" },
      {
        headerArray: true,
        text: "Nick Names",
        value: "nickName",
        headerValues: [
          {
            value: "NickNameFirstName",
            text: "Nick Name*",
          },
        ],
      },
      {
        heading: true,
        text: "Driver License Details",
      },
      {
        value: "driverLicenseNumberExists",
        text: "Do you have a valid driver license?*",
      },
      { value: "driverLicenseNumber", text: "Driving License Number*" },
      {
        value: "driverLicenseFrontCopy",
        text: "Driving License's Front Copy*",
      },
      { value: "driverLicenseBackCopy", text: "Driving License's Back Copy*" },
      {
        heading: true,
        text: "DIN Number Details",
      },
      {
        value: "DINNumberExists",
        text: "Are you Director in any Company resisted with MCA(Ministry of Corporate Affairs) OR have a valid DIN number?*",
      },
      { value: "DINNumber", text: "DIN Number*" },
    ],
    FAMILY_DETAILS: [
      { value: "fathersFirstName", text: "Father's first name" },
      {
        value: "fathersMiddleName",
        text: "Father's middle name",
      },
      { value: "fathersLastName", text: "Father's last name" },
      { value: "mothersFirstName", text: "Mother's first name" },
      {
        value: "mothersMiddleName",
        text: "Mother's middle name",
      },
      { value: "mothersLastName", text: "Mother's last name" },
      { value: "spouseFirstName", text: "Spouse's first name" },
      {
        value: "spouseMiddleName",
        text: "Spouse's middle name",
      },
      { value: "spouseLastName", text: "Spouse's last name" },
      {
        value: "mothersMaidenNameExists",
        text: "Does your mother have any maiden name?",
      },
      {
        value: "mothersMaidenName",
        text: "Mother's maiden name",
        show(v) {
          return v.mothersMaidenNameExists && v.mothersMiddleName;
        },
      },
    ],
    ADDRESS_DETAILS: [
      {
        value: "streetAddressLine1",
        text: "Address Line 1*",
      },
      {
        value: "streetAddressLine2",
        text: "Address Line 2",
      },
      {
        value: "cityTownDistrict",
        text: "City/Town/District*",
      },
      {
        value: "stateProvince",
        text: "State/Province*",
      },
      {
        value: "countryName",
        text: "Country*",
      },
      {
        value: "zipPostalAreaCode",
        text: "Zip/Postal/Area Code",
      },
      {
        value: "fromDate",
        text: "From date*",
      },
      {
        value: "toDate",
        text: "To date*",
      },
    ],
    EMPLOYMENT_HISTORY: [
      {
        value: "companyName",
        text: "Company name*",
      },
      {
        value: "fromDate",
        text: "From date*",
      },
      {
        value: "toDate",
        text: "To date*",
      },
      {
        value: "isCurrentEmployer",
        text: "Is this your current employer?*",
      },
      {
        value: "canContactEmployer",
        text: "Can we contact this employer now?*",
      },
      {
        value: "cessationDate",
        text: "What is your official cessation date?*",
      },
      {
        value: "reasonOfChoosingLateCessationDate",
        text: `Please provide your reason of choosing the date more than a month.The reason will also be visible to ${
          hrOrganizationName || "your organization"
        }*`,
      },
      {
        value: "employmentTypeName",
        text: "Employment type*",
      },
      {
        value: "employmentStatusName",
        text: "Employment status*",
      },
      {
        value: "employmentDepartment",
        text: "Employment department",
      },
      {
        value: "jobTitle",
        text: "Job title*",
      },
      {
        value: "employeeId",
        text: "Employee ID",
      },
      {
        value: "reasonOfLeavingName",
        text: "Reason for leaving*",
      },
      {
        value: "otherReasonForLeaving",
        text: "Other reason for leaving*",
      },
      {
        value: "wasResignationRequested",
        text: "Was the resignation required by this employer?*",
      },
      {
        value: "reasonOfResignationRequested",
        text: "Please provide the reason why your company has requested resignation/separation*",
      },
      // {
      //   heading: true,
      //   text: "Employment {{index}} - Agency Details",
      // },
      {
        heading: true,
        text: "Agency Details",
      },
      {
        value: "wasOnPayrollOfAgency",
        text: "Were you employed by an agency for this employment?*",
      },
      {
        value: "agencyName",
        text: "Agency Name*",
      },
      {
        value: "agencyStreetAddressLine1",
        // text: "Street/Address Line 1*",
        text: "Address Line 1*",
      },
      {
        value: "agencyStreetAddressLine2",
        // text: "Street/Address Line 2",
        text: "Address Line 2",
      },
      {
        value: "agencyCityTownDistrict",
        text: "City/Town/District*",
      },
      {
        value: "agencyStateProvince",
        text: "State/Province*",
      },
      {
        value: "agencyCountryName",
        text: "Country*",
      },
      {
        value: "agencyZipPostalAreaCode",
        text: "Zip/Postal/Area Code",
      },
      {
        value: "agencyPhoneNumber",
        text: "Phone number",
      },
      // {
      //   heading: true,
      //   text: "Employment {{index}} - Company Details",
      // },
      {
        heading: true,
        text: "Company Details",
      },
      {
        value: "employerStreetAddressLine1",
        text: "Address Line 1*",
      },
      {
        value: "employerStreetAddressLine2",
        text: "Address Line 2",
      },
      {
        value: "employerCityTownDistrict",
        text: "City/Town/District*",
      },
      {
        value: "employerStateProvince",
        text: "State/Province*",
      },
      {
        value: "employerCountryName",
        text: "Country*",
      },
      {
        value: "employerZipPostalAreaCode",
        text: "Zip/Postal/Area Code",
      },
      {
        value: "employerPhoneNumber",
        text: "Phone number*",
      },
      // {
      //   heading: true,
      //   text: "Employment {{index}} - HR Details",
      // },
      {
        heading: true,
        text: "HR Details",
      },
      {
        value: "hrName",
        text: "HR name",
      },
      {
        value: "hrTitle",
        text: "HR title",
      },
      {
        value: "hrEmail",
        text: "HR email",
      },
      {
        value: "hrPhoneNumber",
        text: "HR Phone/Contact number",
      },
      // {
      //   heading: true,
      //   text: "Employment {{index}} - Supervisor Details",
      // },
      {
        heading: true,
        text: "Supervisor Details",
      },
      {
        value: "supervisorName",
        text: "Supervisor name",
      },
      {
        value: "supervisorTitle",
        text: "Supervisor title",
      },
      {
        value: "supervisorEmail",
        text: "Supervisor email",
      },
      {
        value: "supervisorPhoneNumber",
        text: "Phone/Contact number",
      },

      // {
      //   heading: true,
      //   text: "Employment {{index}} - Salary Details",
      // },
      {
        heading: true,
        text: "Salary Details",
      },
      {
        value: "salaryFrequencyName",
        text: "Salary frequency*",
      },
      {
        value: "otherSalaryFrequency",
        text: "Other salary frequency*",
      },
      {
        value: "salaryCurrencyName",
        text: "Salary currency*",
      },
      {
        value: "salaryAmount",
        text: "Salary amount*",
      },
      {
        value: "otherRemuneration",
        text: "Other Remuneration(s)",
      },
      // {
      //   heading: true,
      //   text: "Employment {{index}} - Bonus Details",
      // },
      {
        heading: true,
        text: "Bonus Details",
      },
      {
        value: "wasBonusReceived",
        text: "Did you received bonus from company?*",
      },
      {
        headerArray: true,
        text: "Bonus",
        value: "bonus",
        headerValues: [
          {
            value: "bonusCurrencyName",
            text: "Currency*",
          },
          {
            value: "bonusAmount",
            text: "Last bonus amount*",
          },
          {
            value: "bonusName",
            text: "Bonus type*",
          },
          {
            value: "otherBonusTypeName",
            text: "Other bonus type*",
          },
        ],
      },
      {
        value: "EMPLOYMENT_DOCS",
        text: "Appointment / Resignation / Relieving / Experience letter",
      },
      {
        value: "EMPLOYMENT_PAYSLIPS",
        text: "Latest payslips",
      },
    ],
    EMPLOYMENT_HISTORY_GAP: [
      {
        value: "gapStartDate",
        text: "Gap start date*",
      },
      {
        value: "gapEndDate",
        text: "Gap end date*",
      },
      {
        value: "reasonOfGapName",
        text: "Reason of gap*",
      },
      {
        value: "additionalComments",
        text: "Additional comments",
      },
    ],
    EDUCATIONAL_QUALIFICATIONS: [
      {
        value: "nameOfSchoolCollegeUniversity",
        text: "Name of School/College/University*",
      },
      {
        value: "streetAddressLine1",
        // text: "Street/Address Line 1*",
        text: "Address Line 1*",
      },
      {
        value: "streetAddressLine2",
        // text: "Street/Address Line 2",
        text: "Address Line 2",
      },
      {
        value: "cityTownDistrict",
        text: "City/Town/District*",
      },
      {
        value: "stateProvince",
        text: "State/Province*",
      },
      {
        value: "zipPostalAreaCode",
        text: "Zip/Postal/Area Code",
      },
      {
        value: "countryName",
        text: "Country*",
      },
      {
        value: "institutePhoneNumber",
        text: "Phone number",
      },
      // {
      //   heading: true,
      //   text: "Education {{index}} -Program/Study Details",
      // },
      {
        heading: true,
        text: "Program/Study Details",
      },
      {
        value: "isCurrentlyStudying",
        text: "Are you currently studying this qualification?*",
      },
      {
        value: "fromDate",
        text: "From date*",
      },
      {
        value: "toDate",
        text: "To date*",
      },
      {
        value: "qualificationTypeName",
        text: "Qualification type*",
      },
      {
        value: "qualificationTypeOthers",
        text: "Other Qualification*",
      },
      {
        value: "titleOfQualification",
        text: "Title of qualification*",
      },
      {
        value: "educationTypeName",
        text: "Education type*",
      },
      {
        value: "otherEducationType",
        text: "Other Education Type*",
      },
      {
        value: "specilization",
        text: "Specialization of Your Qualification (major subject)*",
      },
      {
        value: "certificateNo",
        text: "Certificate no*",
      },
      {
        value: "studentEnrollmentNo",
        text: "Student No/Enrollment no*",
      },
      {
        value: "gradePercentageGpaScore",
        text: "Grade/Percentage/GPA score*",
      },
      {
        value: "additionalComments",
        text: "Additional comment",
      },
      {
        value: "EDUCATION_DOCS",
        text: "Educations Degree/Marksheet/Any other relevant proofs*",
      },
    ],
    PROFESSIONAL_REFERENCE: [
      {
        value: "fullName",
        text: "Full name*",
      },
      {
        value: "title",
        text: "Title*",
      },
      {
        value: "companyName",
        text: "Company name*",
      },
      {
        value: "professionalRelationshipName",
        text: "Professional Relationship With Referee*",
      },
      {
        value: "city",
        text: "City",
      },
      {
        value: "countryName",
        text: "Country*",
      },
      {
        value: "email",
        text: "Email*",
      },
      {
        value: "referencePhoneNumber",
        text: "Phone/Contact number*",
      },
      {
        value: "additionalComments",
        text: "Additional comment",
      },
    ],
    PROFESSIONAL_QUALIFICATIONS: [
      {
        value: "professionalQualificationTitle",
        text: "Professional qualification title*",
      },
      {
        value: "qualifyingInstituteBodyName",
        text: "Qualifying Institute/body name*",
      },
      {
        value: "statusProfessionalQualificationName",
        text: "Status of Your Professional Qualification*",
      },
      {
        value: "otherProffesionalQualificationStatus",
        text: "Other professional qualification status*",
      },
      {
        value: "membershipQualificationNumber",
        text: "Membership/Qualification number",
      },
      {
        value: "fromDate",
        text: "From date*",
      },
      {
        value: "toDate",
        text: "To date*",
      },
      {
        value: "dateOfAccreditation",
        text: "Date of accreditation*",
      },
      {
        value: "additionalComments",
        text: "Additional comment",
      },
      // {
      //   heading: true,
      //   text: "Professional Qualification {{index}} - Address",
      // },
      {
        heading: true,
        text: "Address",
      },
      {
        value: "streetAddressLine1",
        text: "Address Line 1*",
      },
      {
        value: "streetAddressLine2",
        text: "Address Line 2",
      },
      {
        value: "cityTownDistrict",
        text: "City/Town/District*",
      },
      {
        value: "stateProvince",
        text: "State/Province*",
      },
      {
        value: "countryName",
        text: "Country*",
      },
      {
        value: "zipPostalAreaCode",
        text: "Zip/Postal/Area Code",
      },
      {
        value: "institutePhoneNumber",
        text: "Phone number",
      },
      {
        value: "PROFESSIONAL_DOCS",
        text: "Professional qualification license for verification*",
      },
    ],
    IDENTITY_DETAILS: [
      {
        value: "primaryNationalityName",
        text: "Primary Nationality*",
      },
      {
        value: "residenceCountryName",
        text: "Primary Permanent Residency Country*",
      },
      {
        value: "birthCountryName",
        text: "Country of Birth*",
      },
      {
        value: "identityDocumentType",
        text: "Document Type*",
      },
      {
        value: "identityDocumentNumber",
        text: "Document Number*",
      },
      {
        value: "identityAttachments",
        text: "Uploaded Documents*",
      },
    ],
    DECLARATION: [
      {
        value: "question",
        text: "Question",
      },
      {
        value: "answer",
        text: "Answer",
      },
    ],
    ADDITIONAL_INFORMATION: [
      {
        value: "formName",
        text: "Form name",
      },
      {
        value: "savedFormName",
        text: "Your submission",
      },
    ],
    SUPPORTING_DOCUMENTS: [
      {
        value: "uploadedByCandidate",
        text: "Uploaded By Candidate",
      },
      {
        value: "uploadedByOpsUser",
        text: "Uploaded By Ops User",
      },
      {
        value: "uplodedByHr",
        text: "Uploaded By HR",
      },
    ],
    REFEFREE_RESPONSE: [
      {
        value: "refereeName",
        text: "Referee Name",
      },
      {
        value: "refereeEmail",
        text: "Referee Email",
      },
      {
        value: "companyName",
        text: "Company Name",
      },
      {
        value: "NotResponded",
        text: "Referee Responded?",
      },
      {
        value: "isDeclined",
        text: "Referee Accepted/Declined?",
      },
      {
        value: "reasonOfDecline",
        text: "Reason of Decline",
      },
      {
        heading: true,
        text: "Referee Answers",
      },
      {
        headerArray: true,
        text: "Referee Answers",
        value: "questionsAnswers",
        headerValues: [
          {
            value: "question",
            text: "Question",
          },
          {
            value: "answer",
            text: "Answer",
          },
        ],
      },
    ],
  };
};
