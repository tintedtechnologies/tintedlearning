/**
 * Tagged template for code blocks. Keeps backslashes exactly as written (like String.raw),
 * drops the first and last blank lines, and removes the shared indentation.
 */
export function code(strings: TemplateStringsArray, ...values: unknown[]) {
  const raw = String.raw({ raw: strings.raw }, ...values)
  const lines = raw.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n')
  const indent = Math.min(...lines.filter((line) => line.trim()).map((line) => line.match(/^ */)![0].length))
  return lines.map((line) => line.slice(indent)).join('\n')
}
