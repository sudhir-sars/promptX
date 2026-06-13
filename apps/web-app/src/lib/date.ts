export const getRelativeTime = (date: Date | number) => {
  const timestamp = date instanceof Date ? date.getTime() : date;
  const diff = Date.now() - timestamp;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (diff < minute) {
    return "now";
  }

  if (diff < hour) {
    return `${Math.floor(diff / minute)}m ago`;
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)}h ago`;
  }

  if (diff < week) {
    return `${Math.floor(diff / day)}d ago`;
  }

  if (diff < month) {
    return `${Math.floor(diff / week)}w ago`;
  }

  if (diff < year) {
    return `${Math.floor(diff / month)}mo ago`;
  }

  return `${Math.floor(diff / year)}y ago`;
};
