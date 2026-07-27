#!/usr/bin/env python3
"""Merge duplicate question files: canonical <- merged.
Merges frontmatter fields: aliases (+ merged title), companies (union),
sourceVideos / sourceReports (union by url), sourceUrl fallback. Deletes merged file."""
import json, re, sys
from pathlib import Path

D = Path('content/questions')

PAIRS = [
    # (canonical, merged)
    ('why-work-with-us', 'why-company'),
    ('why-left-last-job', 'tbank-hr-why-left'),
    ('learn-new-technologies', 'universal-new-technology'),
    ('teamlead-technical-debt', 'tbank-management-tech-debt'),
    ('teamlead-hiring-interview', 'tbank-management-hiring'),
    ('okko-throttle-debounce', 'yandex-debounce-throttle'),
    ('yandex-frontend-state-management', 'it-one-react-redux-patterns'),
    ('hr-ai-tools', 'universal-ai-tools'),
    ('universal-deadline-pressure', 'okko-hard-deadline'),
    ('universal-disagreement-with-team', 'okko-handle-disagreement'),
    ('universal-biggest-mistake', 'okko-failure-story'),
    ('event-loop-basics', 'frontend-event-loop-concept'),
    ('lexical-scope-closures', 'frontend-closure'),
    ('frontend-cookie', 'http-cookies'),
    ('klp-monitoring', 'sre-monitoring'),
    ('monitoring-observability', 'klp-observability'),
    ('teamlead-incident-management', 'sre-incident-management'),
    ('teamlead-full-cycle-management', 'teamlead-delivery-practices'),
    ('ds-gradient-boosting', 'ds-boosting-concept'),
    ('yandex-frontend-optimization', 'react-performance-optimization'),
    ('wildberries-websocket-sse', 'vk-frontend-realtime'),
    ('promises-methods', 'frontend-promise'),
    ('vk-js-function-types', 'function-declarations'),
    ('okko-mentoring', 'tbank-management-mentoring'),
    ('ci-cd-pipeline', 'yandex-cicd-setup'),
    ('http-basics', 'wildberries-http-frontend'),
    ('security-auth', 'auth-vs-authorization'),
    ('page-loading-rendering', 'rutube-url-to-render'),
    ('ozon-concurrency-limit', 'ozon-api-rate-limiter'),
    ('llm-evaluation', 'genai-evaluation'),
    ('klp-consistency-models', 'klp-distributed-consistency'),
    ('klp-partitioning', 'klp-sharding-strategies'),
]

TITLE_FIXES = {
    'tbank-management-mentoring': 'Как вы менторите junior и middle разработчиков?',
    'teamlead-tech-stack-knowledge': 'Как вы поддерживаете актуальные знания стека разработки в команде?',
    'teamlead-stakeholder-communication': 'Как вы выстраиваете коммуникацию со стейкхолдерами и менеджментом?',
    'teamlead-incident-management': 'Как вы обрабатываете инциденты и управляете кризисами?',
    'teamlead-developer-growth': 'Как вы помогаете junior-разработчикам расти до senior?',
    'teamlead-technical-roadmap': 'Как вы создаёте технический roadmap и согласуете его с бизнесом?',
}

TITLE_GENERALIZE = {
    'yandex-autocomplete': 'Как реализовать автодополнение (autocomplete) поисковых запросов?',
    'yandex-perf-optimization': 'Как оптимизировать производительность поисковой выдачи?',
}

FM_RE = re.compile(r'^---\n(.*?)\n---\n(.*)$', re.S)

def parse(path):
    src = path.read_text(encoding='utf-8')
    m = FM_RE.match(src)
    if not m:
        raise SystemExit(f'{path}: no frontmatter')
    meta, order = {}, []
    for line in m.group(1).split('\n'):
        if not line.strip():
            continue
        i = line.index(':')
        key, raw = line[:i].strip(), line[i+1:].strip()
        order.append(key)
        try:
            meta[key] = json.loads(raw) if raw[:1] in '[{"' or re.fullmatch(r'-?\d+(\.\d+)?|true|false|null', raw or '') else raw
        except json.JSONDecodeError:
            meta[key] = raw
    return meta, order, m.group(2)

def dump(meta, order, body):
    keys = list(dict.fromkeys(order + list(meta.keys())))
    lines = ['---']
    for k in keys:
        if k not in meta:
            continue
        v = meta[k]
        if isinstance(v, (list, dict)):
            lines.append(f'{k}: {json.dumps(v, ensure_ascii=False, separators=(",", ":")) if k.startswith("source") else json.dumps(v, ensure_ascii=False)}')
        elif isinstance(v, str) and (v.startswith('[') or v.startswith('{')):
            lines.append(f'{k}: {v}')
        else:
            lines.append(f'{k}: {v}')
    lines.append('---')
    return '\n'.join(lines) + '\n' + body

def merge_companies(a, b):
    union = list(dict.fromkeys([*(a or []), *(b or [])]))
    if len(union) > 1:
        union = [c for c in union if c != 'Несколько компаний']
    return union

merged_count = 0
for canon_id, merged_id in PAIRS:
    cp, mp = D / f'{canon_id}.md', D / f'{merged_id}.md'
    if not cp.exists() or not mp.exists():
        print(f'SKIP {canon_id} <- {merged_id}: file missing')
        continue
    cm, co, cb = parse(cp)
    mm, mo, mb = parse(mp)
    # aliases: existing + merged title + merged aliases
    aliases = list(dict.fromkeys([*(cm.get('aliases') or []), mm.get('title', ''), *(mm.get('aliases') or [])]))
    aliases = [a for a in aliases if a and a != cm.get('title')]
    cm['aliases'] = aliases
    if 'aliases' not in co:
        co.insert(co.index('title') + 1, 'aliases')
    cm['companies'] = merge_companies(cm.get('companies'), mm.get('companies'))
    for f in ('sourceVideos', 'sourceReports'):
        union, seen = [], set()
        for item in [*(cm.get(f) or []), *(mm.get(f) or [])]:
            key = item.get('url', json.dumps(item, ensure_ascii=False))
            if key not in seen:
                seen.add(key)
                union.append(item)
        if union or f in cm or f in mm:
            cm[f] = union
            if f not in co:
                co.insert(co.index('companies') + 1, f)
    if not cm.get('sourceUrl') and mm.get('sourceUrl'):
        cm['sourceUrl'] = mm['sourceUrl']
    cp.write_text(dump(cm, co, cb), encoding='utf-8')
    mp.unlink()
    merged_count += 1
    print(f'MERGED {merged_id} -> {canon_id}')

for fid, new_title in TITLE_FIXES.items():
    p = D / f'{fid}.md'
    if not p.exists():
        continue
    m, o, b = parse(p)
    if m.get('title') != new_title:
        print(f'TITLE {fid}: "{m.get("title")}" -> "{new_title}"')
        m['title'] = new_title
        p.write_text(dump(m, o, b), encoding='utf-8')

for fid, new_title in TITLE_GENERALIZE.items():
    p = D / f'{fid}.md'
    if not p.exists():
        continue
    m, o, b = parse(p)
    old = m.get('title')
    if old and old != new_title:
        aliases = list(dict.fromkeys([*(m.get('aliases') or []), old]))
        m['aliases'] = aliases
        if 'aliases' not in o:
            o.insert(o.index('title') + 1, 'aliases')
        m['title'] = new_title
        p.write_text(dump(m, o, b), encoding='utf-8')
        print(f'GENERALIZED {fid}: "{old}" -> "{new_title}"')

print(f'DONE: {merged_count} merges')
