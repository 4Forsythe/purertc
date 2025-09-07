export function getStringInitials(input: string) {
  return input
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}
