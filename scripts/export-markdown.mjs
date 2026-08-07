#!/usr/bin/env node
/**
 * Export all Astro slides to a downloadable Markdown playbook.
 * Usage: node scripts/export-markdown.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SLIDES_DIR = path.join(ROOT, 'src/components/slides');
const OUT = path.join(ROOT, 'public/kubernetes-troubleshooting-playbook.md');

function sortKey(name) {
  const m = name.match(/^S(\d+)([a-z]*)_/i);
  if (!m) return [9999, '', name];
  return [parseInt(m[1], 10), m[2] || '', name];
}

function attr(src, name) {
  const re = new RegExp(`${name}=\\{?\`([\\s\\S]*?)\`\\}?|${name}="([^"]*)"|${name}=\\{'([^']*)'\\}`);
  const m = src.match(re);
  if (!m) return '';
  return (m[1] ?? m[2] ?? m[3] ?? '').trim();
}

function decode(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\\'/g, "'")
    .replace(/\\n/g, '\n')
    .replace(/\\`/g, '`');
}

function stripTags(html) {
  return decode(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, '\n')
      .replace(/<li[^>]*>/gi, '- ')
      .replace(/<[^>]+>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim(),
  );
}

function extractCodeBlocks(body) {
  const blocks = [];
  const re = /code=\{`([\s\S]*?)`\}/g;
  let m;
  while ((m = re.exec(body))) {
    blocks.push(decode(m[1].trim()));
  }
  // also code={`...`} with caption
  return blocks;
}

function extractMatrix(body) {
  const matrices = [];
  const re = /headers=\{(\[[\s\S]*?\])\}\s*rows=\{(\[[\s\S]*?\])\}/g;
  let m;
  while ((m = re.exec(body))) {
    try {
      const headers = eval(m[1]);
      const rows = eval(m[2]);
      matrices.push({ headers, rows });
    } catch {
      // ignore unparseable
    }
  }
  return matrices;
}

function extractCallouts(body) {
  const items = [];
  const re = /<Callout([^>]*)>([\s\S]*?)<\/Callout>/g;
  let m;
  while ((m = re.exec(body))) {
    const type = (m[1].match(/type="([^"]+)"/) || [])[1] || 'tip';
    const title = (m[1].match(/title="([^"]+)"/) || [])[1];
    const text = stripTags(m[2]);
    if (text) items.push({ type, title, text });
  }
  return items;
}

function extractPlainParagraphs(body) {
  // Remove SVG and script-like noise
  let cleaned = body
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/\{`[\s\S]*?`\}/g, '')
    .replace(/\{[\s\S]*?\}/g, ' ');

  const chunks = [];
  const pRe = /<(p|h[1-6]|li|div)[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = pRe.exec(cleaned))) {
    const t = stripTags(m[2]);
    if (t && t.length > 8 && !t.includes('class=') && !/^[→↓]$/.test(t)) {
      chunks.push(t);
    }
  }
  // dedupe short noise
  return [...new Set(chunks)].filter((t) => !t.startsWith('import '));
}

function matrixToMd({ headers, rows }) {
  const esc = (c) => String(c).replace(/\|/g, '\\|');
  const head = `| ${headers.map(esc).join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${r.map(esc).join(' | ')} |`).join('\n');
  return `${head}\n${sep}\n${body}`;
}

function slideBody(src) {
  const start = src.indexOf('>');
  // Find end of opening Slide tag more carefully
  const open = src.match(/<Slide[\s\S]*?>/);
  if (!open) return '';
  const after = src.slice(src.indexOf(open[0]) + open[0].length);
  const end = after.lastIndexOf('</Slide>');
  return end >= 0 ? after.slice(0, end) : after;
}

const files = fs
  .readdirSync(SLIDES_DIR)
  .filter((f) => f.endsWith('.astro'))
  .sort((a, b) => {
    const ka = sortKey(a);
    const kb = sortKey(b);
    if (ka[0] !== kb[0]) return ka[0] - kb[0];
    if (ka[1] !== kb[1]) return ka[1].localeCompare(kb[1]);
    return ka[2].localeCompare(kb[2]);
  });

const lines = [];
lines.push('# The Kubernetes Troubleshooting Playbook');
lines.push('');
lines.push('**Think Like a Platform Engineer**');
lines.push('');
lines.push('> Markdown export of the conference presentation. Same content as the Astro deck — for reading, studying, and sharing offline.');
lines.push('');
lines.push(`- Slides: **${files.length}**`);
lines.push(`- Generated: **${new Date().toISOString().slice(0, 10)}**`);
lines.push('- Navigation in the live deck: `→` next · `N` notes · `O` overview');
lines.push('');
lines.push('## Mental models (quick reference)');
lines.push('');
lines.push('1. **Investigation lifecycle:** Observe → Locate → Narrow → Verify → Fix → Validate → Prevent');
lines.push('2. **Troubleshooting pyramid:** Infrastructure → Cluster → Workload → Application → Business');
lines.push('3. **Kubernetes onion:** peel layers outside-in');
lines.push('4. **Signal triangle:** Events = WHAT · Logs = WHY · Metrics = WHEN · Traces = WHERE');
lines.push('5. **Mantras:** Running ≠ Healthy · Ready ≠ Alive · Scheduled ≠ Working · Events before Logs');
lines.push('');
lines.push('---');
lines.push('');
lines.push('## Table of contents');
lines.push('');

const slides = files.map((file, i) => {
  const src = fs.readFileSync(path.join(SLIDES_DIR, file), 'utf8');
  const id = attr(src, 'id') || file.replace(/\.astro$/, '');
  const chapter = attr(src, 'chapter') || 'General';
  const title = attr(src, 'title') || id;
  const notes = attr(src, 'notes');
  const variant = attr(src, 'variant');
  return { file, i: i + 1, id, chapter, title, notes, variant, src };
});

let lastChapter = '';
for (const s of slides) {
  if (s.chapter !== lastChapter) {
    lines.push(`- **${s.chapter}**`);
    lastChapter = s.chapter;
  }
  lines.push(`  - [${s.i}. ${s.title}](#slide-${s.i})`);
}

lines.push('');
lines.push('---');
lines.push('');

lastChapter = '';
for (const s of slides) {
  if (s.chapter !== lastChapter) {
    lines.push(`# ${s.chapter}`);
    lines.push('');
    lastChapter = s.chapter;
  }

  lines.push(`## Slide ${s.i}: ${s.title} {#slide-${s.i}}`);
  lines.push('');
  lines.push(`*File: \`${s.file}\` · id: \`${s.id}\`${s.variant ? ` · variant: ${s.variant}` : ''}*`);
  lines.push('');

  if (s.notes) {
    lines.push('### Speaker notes');
    lines.push('');
    lines.push(s.notes);
    lines.push('');
  }

  const body = slideBody(s.src);
  const matrices = extractMatrix(body);
  for (const mx of matrices) {
    lines.push('### Table');
    lines.push('');
    lines.push(matrixToMd(mx));
    lines.push('');
  }

  const codes = extractCodeBlocks(body);
  for (const code of codes) {
    lines.push('### Commands');
    lines.push('');
    lines.push('```bash');
    lines.push(code);
    lines.push('```');
    lines.push('');
  }

  const callouts = extractCallouts(body);
  for (const c of callouts) {
    lines.push(`> **${(c.title || c.type).toUpperCase()}:** ${c.text}`);
    lines.push('');
  }

  const calloutTexts = new Set(callouts.map((c) => c.text));
  const paras = extractPlainParagraphs(body)
    .filter((p) => p !== s.title)
    .filter((p) => !calloutTexts.has(p))
    .filter((p) => !p.includes('font-family') && !p.includes('stop-color'))
    .slice(0, 10);
  if (paras.length) {
    lines.push('### Content');
    lines.push('');
    for (const p of paras) {
      if (p.startsWith('- ')) lines.push(p);
      else lines.push(`- ${p}`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');
}

lines.push('## Closing');
lines.push('');
lines.push("> Don't memorize kubectl commands.");
lines.push('>');
lines.push('> Memorize the engineering thought process.');
lines.push('');
lines.push('---');
lines.push('');
lines.push('*Exported from the Astro presentation in this repository.*');
lines.push('');

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, lines.join('\n'));
console.log(`Wrote ${OUT} (${slides.length} slides, ${lines.length} lines)`);
