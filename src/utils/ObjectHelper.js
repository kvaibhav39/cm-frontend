export const omitEmpties = (input) => {
    return _.omitBy(input, (v) => {
        return _.isArray(v) ? !v.length : !v;
    });
};