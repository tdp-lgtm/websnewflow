// Shared content helpers used across pages. Keeps publication/citation/filter
// logic in one place instead of copy-pasted into every page's frontmatter.

export function isPublished(item: { published?: boolean } | null | undefined): boolean {
  return !item || item.published !== false;
}

export function isOnCV(item: { cv?: boolean } | null | undefined): boolean {
  return !item || item.cv !== false;
}

/** Volume/issue/pages citation fragment, e.g. "52(4): 465-499". */
export function volStr(p: { volume?: string; issue?: string; pages?: string }): string {
  if (p.volume || p.issue) {
    const vi = p.volume
      ? (p.issue ? `${p.volume}(${p.issue})` : p.volume)
      : `(${p.issue})`;
    return vi + (p.pages ? `: ${p.pages}` : '');
  }
  return p.pages || '';
}

/** Short year label for publication lists. */
export function pubYear(year: string | number | undefined): string {
  const raw = year ? String(year) : '';
  if (raw === 'Forthcoming') return 'Forthc.';
  if (raw === 'Online first') return 'Online';
  return raw;
}

/** HTML-escape a plain-text value before interpolating it into an HTML string. */
export function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface PresentationRow {
  /** Display date: "May 2025", "2025", or a status word like "Scheduled". */
  date: string;
  /** "Venue, Institution" */
  where: string;
  type?: string;
  comment?: string;
}

/**
 * Flatten talks → one row per presentation (published only), ignoring the
 * paper titles. Sorted newest-first; non-numeric years ("Scheduled",
 * "Forthcoming") sort to the top. The sort is stable, so presentations within
 * the same year keep their authored order.
 */
export function flattenPresentations(talks: any[]): PresentationRow[] {
  const rows: (PresentationRow & { _k: number })[] = [];
  for (const t of talks || []) {
    for (const p of t.presentations || []) {
      if (!isPublished(p)) continue;
      const year = String(p.year ?? '').trim();
      const numeric = /^\d{4}$/.test(year) ? Number(year) : Number.POSITIVE_INFINITY;
      rows.push({
        date: p.month ? `${p.month} ${year}` : year,
        where: [p.venue, p.institution].filter(Boolean).join(', '),
        type: p.type,
        comment: p.comment,
        _k: numeric,
      });
    }
  }
  rows.sort((a, b) => {
    if (a._k === b._k) return 0;           // both same year, or both non-numeric
    if (a._k === Infinity) return -1;      // scheduled/forthcoming first
    if (b._k === Infinity) return 1;
    return b._k - a._k;                    // then newest first
  });
  return rows.map(({ _k, ...r }) => r);
}

/** Footnote marker for a presentation type, matching the page legend. */
export function presentationMark(type?: string): string {
  if (type === 'Invited') return '*';
  if (type === 'Peer-Review') return '†';
  return '';
}

/**
 * De-duplicate and validate slug ids for dynamic routes. Drops empty/invalid
 * ids and keeps only the first occurrence of each, so a CMS typo (duplicate or
 * malformed id) can never crash the whole build.
 */
export function validSlugs<T extends { id?: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items || []) {
    const id = (item.id || '').trim();
    if (!/^[a-z0-9-]+$/.test(id)) {
      if (id) console.warn(`[build] skipping item with invalid slug id: "${id}" (use lowercase letters, numbers, hyphens)`);
      continue;
    }
    if (seen.has(id)) {
      console.warn(`[build] skipping duplicate slug id: "${id}"`);
      continue;
    }
    seen.add(id);
    out.push(item);
  }
  return out;
}
