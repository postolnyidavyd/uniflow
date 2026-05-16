export const localToUTC = (localDateString) => {
    if (!localDateString) return null;
    return new Date(localDateString).toISOString();
};