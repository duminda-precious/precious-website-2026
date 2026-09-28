# Regenerates docs/tokens.md from src/styles/tokens.css. Run from the repo root: python scripts/gen-tokens-doc.py
import re, glob, os

css = open('src/styles/tokens.css', encoding='utf-8').read()
files = [
    f for f in glob.glob('src/**/*.astro', recursive=True)
    + glob.glob('src/**/*.ts', recursive=True)
    + ['src/styles/base.css', 'src/styles/utilities.css']
    if '/dev/' not in f.replace(os.sep, '/')
]
src = {f.replace(os.sep, '/'): open(f, encoding='utf-8').read() for f in files}


def used(tok):
    out = set()
    for f, s in src.items():
        if re.search(re.escape('var(' + tok) + r'[),\s]', s) or ("'" + tok + "'") in s:
            out.add(os.path.basename(f).rsplit('.', 1)[0])
    return sorted(out)


def esc(s):
    return s.replace('|', '\\|')


out = [
    '# Design tokens',
    '',
    'All values live in [`src/styles/tokens.css`](../src/styles/tokens.css). This file is generated from it; '
    'if they ever disagree, tokens.css wins. Visual check: `/dev/tokens` (theme switcher and live contrast table).',
    '',
    '## How the system works',
    '',
    '- **Three tiers.** Primitives (raw values) → semantic tokens (meaning, remapped per theme) → component tokens '
    '(a few component-specific settings). Components use only semantic and component tokens, never primitives or hex codes.',
    '- **Themes.** `light` is the default. `[data-theme="dark"]` (the Work stage) and `[data-theme="ink"]` '
    '(footer, process card) remap the semantic colour tokens.',
    '- **Rebrand = token swap.** Change the primitives and the semantic mapping; components follow. '
    'Fonts: change `--font-family-sans` and `--font-family-mono`.',
    '- **Fluid values** interpolate between 320px and 1920px viewports with `clamp()`.',
    '- **Breakpoints** can\'t be tokens inside `@media`; use these literal values: sm `30rem` (480), md `47.5rem` (760), '
    'lg `62rem` (992), xl `75rem` (1200), 2xl `98.75rem` (1580). Also exported from `src/styles/breakpoints.ts`.',
    '- **Motion** tokens are read at runtime by `src/motion/tokens.ts`, so CSS is also the source for GSAP.',
    '- **"Used in"** lists the files that read a token (dev pages excluded). "—" means it is only referenced by other tokens or reserved.',
    '',
]

pattern = re.compile(
    r"(:root,\s*\[data-theme='light'\]|\[data-theme='dark'\]|\[data-theme='ink'\]|:root)\s*\{(.*?)\n  \}",
    re.S,
)
root_count = 0
total = 0
for sel, body in pattern.findall(css):
    key = re.sub(r'\s+', ' ', sel)
    titles = {
        ":root, [data-theme='light']": 'Semantic colours: light (default)',
        "[data-theme='dark']": 'Semantic colours: dark (Work stage)',
        "[data-theme='ink']": 'Semantic colours: ink (footer, process card)',
    }
    if key == ':root':
        root_count += 1
        title = 'Primitives and global tokens' if root_count == 1 else 'Component tokens'
    else:
        title = titles[key]
    out += [f'## {title}', '']

    group = None
    rows = []

    def flush():
        global rows
        if rows:
            if group:
                out.extend([f'### {group}', ''])
            out.append('| Token | Value | Note | Used in |')
            out.append('|---|---|---|---|')
            for r in rows:
                out.append(f'| `{r[0]}` | `{esc(r[1])}` | {esc(r[2])} | {r[3]} |')
            out.append('')
        rows = []

    merged = []
    for raw in body.split('\n'):
        if merged and re.match(r'--[a-z]', merged[-1].strip()) and ';' not in merged[-1]:
            merged[-1] = merged[-1].rstrip() + ' ' + raw.strip()
        else:
            merged.append(raw)
    for line in merged:
        stripped = line.strip().replace('( ', '(').replace(' )', ')').replace(', )', ')')
        m = re.match(r'(--[a-z0-9-]+):\s*(.*?);\s*(?:/\*\s*(.*?)\s*\*/)?$', stripped)
        if m:
            tok, val, note = m.groups()
            u = used(tok)
            rows.append((tok, val, note or '', ', '.join(u) if u else '—'))
            total += 1
            continue
        # Section headings: a single-line comment "/* X */", or an ALL-CAPS header line in a block comment.
        single = re.match(r'^/\*\s*(.+?)\s*\*/$', stripped)
        caps = re.match(r'^([A-Z][A-Z]+(?: [^a-z].*|\s*\(.*\))?)$', stripped)
        if single and not single.group(1).startswith('-'):
            flush()
            group = single.group(1)
        elif caps and not stripped.startswith('-') and not stripped.startswith('*'):
            flush()
            group = caps.group(1)
        elif re.match(r'^/\*\s*[A-Z]', stripped) and not stripped.endswith('*/') and not stripped.startswith('/* -'):
            flush()
            group = re.sub(r'^/\*\s*', '', stripped)
    flush()

open('docs/tokens.md', 'w', encoding='utf-8', newline='\n').write('\n'.join(out) + '\n')
print(total, 'tokens documented')
