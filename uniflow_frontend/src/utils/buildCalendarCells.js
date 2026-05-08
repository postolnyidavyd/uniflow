export function buildCalendarCells(year, month, eventsMap = {}) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const cells = [];

  const createCell = (d, isCurrentMonth) => {
    const dateStr = toISO(d);
    return {
      date: dateStr,
      currentMonth: isCurrentMonth,
      items: eventsMap[dateStr] || [],
    };
  };

  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push(createCell(new Date(year, month, -i), false));
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    cells.push(createCell(new Date(year, month, d), true));
  }

  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      cells.push(createCell(new Date(year, month + 1, d), false));
    }
  }

  return cells;
}

const toISO = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};