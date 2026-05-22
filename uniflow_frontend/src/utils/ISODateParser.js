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


export const getRelativeTimeInfo = (isoString) => {
  if (!isoString) return { text: '', isRecent: false };

  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now - date;

  if (diffMs < 0) return { text: formatDateTitle(isoString), isRecent: false };

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  // зелена зона
  if (diffMins < 1) return { text: 'Щойно', isRecent: true };
  if (diffMins < 60) return { text: `${diffMins} хв. тому`, isRecent: true };


  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((today - targetDay) / (1000 * 60 * 60 * 24));

  // сіра зона
  if (diffDays === 0) return { text: `${diffHours} год. тому`, isRecent: false };
  if (diffDays === 1) return { text: 'Вчора', isRecent: false };

  if (diffDays < 7) {
    if (diffDays >= 2 && diffDays <= 4) {
      return { text: `${diffDays} дні тому`, isRecent: false };
    }
    return { text: `${diffDays} днів тому`, isRecent: false };
  }

  return { text: formatDateTitle(isoString), isRecent: false };
};