export function getChatMessageTimestamp(date: Date) {
  const now = new Date();

  if (now > date && now.getDate() !== date.getDate()) {
    return date.toLocaleString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  }

  return date.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' });
}
