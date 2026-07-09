import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'content/questions'
const files = readdirSync(dir).filter(f => f.endsWith('.md'))

let stats = { total: 0, dupes: [], longShort: [], missingExample: [], noShort: [] }

for (const f of files) {
  const content = readFileSync(join(dir, f), 'utf8')
  const id = f.replace('.md', '')
  stats.total++;

  // Extract short answer
  const shortMatch = content.match(/## Короткий ответ\n\n([\s\S]*?)(?=\n## |\n---|$)/);
  const shortRaw = shortMatch ? shortMatch[1].trim() : '';

  // Extract example answer
  const exampleMatch = content.match(/## Пример ответа\n\n([\s\S]*?)(?=\n## |\n---|$)/);
  const exampleRaw = exampleMatch ? exampleMatch[1].trim() : '';

  const clean = t => t.replace(/[*_~`#>\[\]!()-]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  const sa = clean(shortRaw);
  const ea = clean(exampleRaw);

  if (!shortRaw) stats.noShort.push(id);
  if (!exampleRaw) stats.missingExample.push(id);

  if (sa && ea) {
    let sim = 0;
    if (sa === ea) sim = 100;
    else if (sa.length > 20 && ea.includes(sa)) sim = 90;
    else if (ea.length > 20 && sa.includes(ea)) sim = 90;
    if (sim >= 80) stats.dupes.push({ id, sim: sim + '%' });
  }

  if (shortRaw.length > 300) stats.longShort.push({ id, len: shortRaw.length })
}

console.log('Всего:', stats.total);
console.log('');
console.log('ДУБЛИ (краткий ~ пример):', stats.dupes.length);
stats.dupes.forEach(d => console.log(' ', d.id, '-', d.sim));
console.log('');
console.log('ДЛИННЫЙ краткий (>300):', stats.longShort.length);
stats.longShort.forEach(d => console.log(' ', d.id, '-', d.len, 'симв'));
console.log('');
console.log('Нет КРАТКОГО ответа:', stats.noShort.length);
stats.noShort.forEach(id => console.log(' ', id));
console.log('');
console.log('Нет ПРИМЕРА ответа:', stats.missingExample.length);
if (stats.missingExample.length < 20) stats.missingExample.forEach(id => console.log(' ', id));
else console.log('  (' + stats.missingExample.length + ' вопросов)');
