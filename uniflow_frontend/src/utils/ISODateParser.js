export const formatDateTitle = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);

    return new Intl.DateTimeFormat('uk-UA', {
        day: 'numeric',
        month: 'long',
    }).format(date);
};

export const getDayOfWeek = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);

    const weekday = new Intl.DateTimeFormat('uk-UA', {
        weekday: 'long',
    }).format(date);

    // Робимо першу літеру великою (П'ятниця)
    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
};

export const getTimeFromISO = (isoString) => {
  if (!isoString) return '';

  const date = new Date(isoString);
  return date.toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  });

};