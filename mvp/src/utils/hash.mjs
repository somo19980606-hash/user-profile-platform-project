export function hash(input) {
  let value = 0;
  for (const char of input) value = (value * 31 + char.charCodeAt(0)) % 100000;
  return value;
}
