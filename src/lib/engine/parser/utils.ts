export function hasKw(prompt: string, kw: string): boolean {
  return new RegExp("\\b" + kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(prompt);
}
