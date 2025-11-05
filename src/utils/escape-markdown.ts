export function escapeMarkdown(text: string): string {
  const escaped = text.replace(
    /[\\_\*\[\]\(\)~`><&#\+\-=|{}\.!]/g,
    (match) => "\\" + match
  );
  return escaped;
}
