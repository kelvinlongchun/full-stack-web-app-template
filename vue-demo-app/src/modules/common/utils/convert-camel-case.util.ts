export function convertCamelCase(word: string) {
  return word
    .split("")
    .map((char) => (char.toUpperCase() === char ? " " + char : char))
    .map((char, index) => (index === 0 ? char.toUpperCase() : char))
    .reduce((prev, current) => prev + current, "");
}
