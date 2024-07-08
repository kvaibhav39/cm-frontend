export const getCheckOrderId = (checks, checksId) => {
    return checks?.length
      ? checks?.findIndex((check) => check.checkId === checksId)
      : 0;
  };