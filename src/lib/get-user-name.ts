export function getUserName(users: string[], userId: string) {
  return `Пользователь ${users.indexOf(userId) + 1}`;
}
