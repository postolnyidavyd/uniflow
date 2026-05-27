export const localToUTC = (localDateString) => {
    if (!localDateString) return null;
    return new Date(localDateString).toISOString();
};

export const utcToLocal = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 16);
};
