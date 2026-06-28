const BLOCK_START = /^\s*<(p|ul|ol|li|h[1-6]|blockquote|div|figure|pre|table|section|article)\b/i;

export function prepHtml(text: string | undefined): string {
  const raw = text || '';

  // Wrap on blank-line boundaries so mixed plain-text + inline-HTML still gets
  // paragraphs. Chunks that already start with a block-level tag are left alone.
  let html = raw
    .split(/\n\n+/)
    .map(chunk => chunk.trim())
    .filter(Boolean)
    .map(chunk => (BLOCK_START.test(chunk) ? chunk : `<p>${chunk}</p>`))
    .join('');

  // Add target/rel to external links that don't already have a target.
  html = html.replace(
    /<a (?![^>]*\btarget=)([^>]*href=["']https?:\/\/[^"']*["'][^>]*)>/g,
    '<a target="_blank" rel="noopener noreferrer" $1>'
  );
  return html;
}
