// Curated color schemes: full palettes selectable by name in the CMS.
// 'Custom' falls through to the individual hex fields in theme.json.
export const SCHEMES: Record<string, {
  paper: string; ink: string; fg2: string; fg3: string; rule: string; accent: string;
}> = {
  // fg3 (muted text) values are tuned to clear WCAG AA 4.5:1 on each paper.
  'Reading Room': { paper: '#F5F1E8', ink: '#211C16', fg2: '#574F44', fg3: '#736C5F', rule: '#E3DBCB', accent: '#7B2E2E' },
  'Ivory':        { paper: '#FAF7F0', ink: '#1F1B16', fg2: '#5A5246', fg3: '#787164', rule: '#E8E2D4', accent: '#8A3324' },
  'Porcelain':    { paper: '#F4F4F2', ink: '#1C1E21', fg2: '#4D5158', fg3: '#6C7076', rule: '#E0E1DD', accent: '#355070' },
  'Oxford':       { paper: '#FAFAF8', ink: '#14161A', fg2: '#4A4F58', fg3: '#6E727A', rule: '#E4E4E0', accent: '#1B365D' },
  'Sage':         { paper: '#F3F4EE', ink: '#20231C', fg2: '#535848', fg3: '#6C7061', rule: '#DFE2D2', accent: '#4A5D43' },
  'Plain':        { paper: '#FFFFFF', ink: '#111111', fg2: '#444444', fg3: '#767676', rule: '#E5E5E5', accent: '#1A56A0' },
};

// Font catalogue: named options available in the CMS.
// Each Google font carries its own URL; Base.astro loads only the selected
// ones via parallel <link> tags (faster than a serial @import in the CSS).
export const FONTS: Record<string, { stack: string; googleUrl?: string }> = {
  // ── Serif ─────────────────────────────────────────────────────────────────
  'Spectral': {
    stack: "'Spectral', Georgia, serif",
    googleUrl: 'https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap',
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
    googleUrl: 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&display=swap',
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
    googleUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap',
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

// The stylesheet (public/styles/style.css :root) already hardcodes the
// "Reading Room" palette + default fonts. When the active theme matches that
// baseline we emit nothing, so default pages don't ship a redundant inline
// <style> block on every response.
const BASELINE = {
  serif: FONTS['Spectral'].stack,
  sans: FONTS['Hanken Grotesk'].stack,
  mono: FONTS['IBM Plex Mono'].stack,
  ...SCHEMES['Reading Room'],
};

export function getThemeCss(theme: Record<string, string>): string {
  const serif  = FONTS[theme.font_serif]?.stack  ?? FONTS['Spectral'].stack;
  const sans   = FONTS[theme.font_sans]?.stack   ?? FONTS['Hanken Grotesk'].stack;
  const mono   = FONTS[theme.font_mono]?.stack   ?? FONTS['IBM Plex Mono'].stack;

  const scheme = SCHEMES[theme.color_scheme];
  const paper  = scheme?.paper  ?? (theme.color_paper  || BASELINE.paper);
  const ink    = scheme?.ink    ?? (theme.color_ink    || BASELINE.ink);
  const fg2    = scheme?.fg2    ?? (theme.color_fg2    || BASELINE.fg2);
  const fg3    = scheme?.fg3    ?? (theme.color_fg3    || BASELINE.fg3);
  const rule   = scheme?.rule   ?? (theme.color_rule   || BASELINE.rule);
  const accent = scheme?.accent ?? (theme.color_accent || BASELINE.accent);

  const hwOverride = theme.heading_weight && theme.heading_weight !== '400';
  const underlineOverride = theme.link_underline === 'always' || theme.link_underline === 'none';
  const tokensMatchBaseline =
    paper === BASELINE.paper && ink === BASELINE.ink && fg2 === BASELINE.fg2 &&
    fg3 === BASELINE.fg3 && rule === BASELINE.rule && accent === BASELINE.accent &&
    serif === BASELINE.serif && sans === BASELINE.sans && mono === BASELINE.mono;

  // Nothing differs from the stylesheet — skip the inline block entirely.
  if (tokensMatchBaseline && !hwOverride && !underlineOverride) return '';

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
