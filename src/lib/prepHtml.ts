export function prepHtml(text: string | undefined): string {
  let html = text || '';
  if (!/<\w+/.test(html)) {
    html = html.split('\n\n').filter(Boolean).map(p => `<p>${p}</p>`).join('');
  }
  // Add target/rel to external links that don't already have a target.
  html = html.replace(
    /<a (?![^>]*\btarget=)([^>]*href=["']https?:\/\/[^"']*["'][^>]*)>/g,
    '<a target="_blank" rel="noopener" $1>'
  );
  return html;
}
