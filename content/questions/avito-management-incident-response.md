---
id: avito-management-incident-response
title: Как вы организуете response на инциденты в продакшене?
category: Behavioral
scope: universal
languages: []
roles: ["Leadership"]
companies: ["Avito"]
level: Senior
stage: Управление
tags: ["Management", "Incident", "Process"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Чёткий process: detection, triage, mitigation, post-mortem. On-call rotation, runbook, escalation matrix. Post-mortem без blame culture. Метрики: MTTD, MTTR, количество инцидентов.

## Контекст

Проверяют зрелость: понимает ли кандидат, что инциденты — это не «авария», а процесс.

## Как строить ответ

### Process

Detection (мониторинг), triage (классификация), mitigation (быстрое решение), post-mortem (анализ).

### Инструменты

On-call, runbook, escalation matrix, post-mortem template.

### Культура

Blameless post-mortem, learning, process improvement.

## Пример ответа

Process: 1) Detection — мониторинг (Grafana, PagerDuty), 2) Triage — on-call классифицирует (P1-P4), 3) Mitigation — runbook или escalation, 4) Post-mortem — blameless, с action items. On-call: ротация, 1 неделя, shadow first. Post-mortem: template (timeline, root cause, action items). Метрики: MTTD — 5 мин, MTTR — 30 мин, инцидентов в месяц — 2-3. Результат: снижение MTTR на 50% за квартал.

## Частые ошибки

- Нет process
- Blame culture в post-mortem
- Нет runbook
- Не анализируете root cause

## Дополнительные вопросы

- Как мотивируете команду на on-call?
- Как обрабатываете repeat incidents?
- Как связываете инциденты с tech debt?
