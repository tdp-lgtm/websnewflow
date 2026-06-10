// Font catalogue: named options available in the CMS.
// Fonts already bundled in style.css @import have no googleUrl — no extra load.
const FONTS: Record<string, { stack: string; googleUrl?: string }> = {
  // ── Serif ─────────────────────────────────────────────────────────────────
  'Spectral': {
    stack: "'Spectral', Georgia, serif",
  },
  'Georgia': {
    stack: 'Georgia, serif',
  },
  'Palatino': {
    stack: "'Palatino Linotype', Palatino, 'Book Antiqua', serif",
  },
  'Libre Baskerville': {
    stack: "'Libre Baskerville', Georgia, serif",
    googleUrl: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap',
  },
  // ── Sans ──────────────────────────────────────────────────────────────────
  'Hanken Grotesk': {
    stack: "'Hanken Grotesk', system-ui, sans-serif",
  },
  'System': {
    stack: 'system-ui, sans-serif',
  },
  'Inter': {
    stack: "'Inter', system-ui, sans-serif",
    googleUrl: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;1,14..32,400&display=swap',
  },
  'Source Sans 3': {
    stack: "'Source Sans 3', system-ui, sans-serif",
    googleUrl: 'https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,600;1,400&display=swap',
  },
  // ── Mono ──────────────────────────────────────────────────────────────────
  'IBM Plex Mono': {
    stack: "'IBM Plex Mono', ui-monospace, monospace",
  },
  'JetBrains Mono': {
    stack: "'JetBrains Mono', ui-monospace, monospace",
    googleUrl: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;1,400&display=swap',
  },
  'System Mono': {
    stack: 'ui-monospace, Menlo, monospace',
  },
};

function adjust(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return '#' + [r, g, b].map(v => clamp(v + amount).toString(16).padStart(2, '0')).join('');
}

export function getThemeCss(theme: Record<string, string>): string {
  const serif  = FONTS[theme.font_serif]?.stack  ?? FONTS['Spectral'].stack;
  const sans   = FONTS[theme.font_sans]?.stack   ?? FONTS['Hanken Grotesk'].stack;
  const mono   = FONTS[theme.font_mono]?.stack   ?? FONTS['IBM Plex Mono'].stack;

  const paper  = theme.color_paper  || '#F5F1E8';
  const ink    = theme.color_ink    || '#211C16';
  const fg2    = theme.color_fg2    || '#574F44';
  const fg3    = theme.color_fg3    || '#8C8474';
  const rule   = theme.color_rule   || '#E3DBCB';
  const accent = theme.color_accent || '#7B2E2E';

  const lines = [
    ':root {',
    `  --paper: ${paper};`,
    `  --paper-2: ${adjust(paper, 6)};`,
    `  --paper-sunk: ${adjust(paper, -6)};`,
    `  --ink: ${ink};`,
    `  --fg-1: ${ink};`,
    `  --fg-2: ${fg2};`,
    `  --fg-3: ${fg3};`,
    `  --rule: ${rule};`,
    `  --rule-strong: ${adjust(rule, -20)};`,
    `  --accent: ${accent};`,
    `  --accent-deep: ${adjust(accent, -25)};`,
    `  --serif: ${serif};`,
    `  --sans: ${sans};`,
    `  --mono: ${mono};`,
    '}',
  ];

  if (theme.link_underline === 'always') {
    lines.push('a { text-decoration: underline; }');
  } else if (theme.link_underline === 'none') {
    lines.push('a { text-decoration: none !important; }');
  }

  const hw = theme.heading_weight;
  if (hw && hw !== '400') {
    lines.push(`h1, h2, h3, h4 { font-weight: ${hw}; }`);
  }

  return lines.join('\n');
}

export function getThemeFontLinks(theme: Record<string, string>): string[] {
  const keys = [theme.font_serif, theme.font_sans, theme.font_mono];
  return [...new Set(keys.flatMap(k => FONTS[k]?.googleUrl ? [FONTS[k]!.googleUrl!] : []))];
}
