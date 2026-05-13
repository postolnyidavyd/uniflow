// 15 грудня
export const formatDateTitle = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);

  return new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric',
    month: 'long',
  }).format(date);
};

// П'ятниця
export const getDayOfWeek = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);

  const weekday = new Intl.DateTimeFormat('uk-UA', {
    weekday: 'long',
  }).format(date);

  return weekday.charAt(0).toUpperCase() + weekday.slice(1);
};

// 08:30
export const getTimeFromISO = (isoString) => {
  if (!isoString) return '';

  const date = new Date(isoString);
  return date.toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// 15 грудня, 08:30
export const formatDateModal = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('uk-UA', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// 15 грудня 2024
export const formatFullDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// 08:30
export const formatShortTime = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  });
};