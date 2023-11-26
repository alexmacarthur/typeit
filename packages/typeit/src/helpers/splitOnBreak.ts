export default function splitOnBreak(str: string): string[] {
  return str
    .replace(/<!--(.+?)-->/g, "")
    .trim()
    .split(/<br(?:\s*?)(?:\/)?>/);
}
