---
id: sre-incident-management
title: Как управлять инцидентами в production?
category: Delivery
scope: universal
languages: []
roles: ["DevOps", "Backend"]
companies: ["Несколько компаний"]
level: Middle
stage: Техническое
tags: ["SRE", "Incident Management", "On-Call"]
duration: 10 мин
difficulty: 3
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Incident lifecycle: detection → triage → mitigation → resolution → post-mortem. On-call rotation: ротация, runbooks, escalation. Blameless post-mortems: без вины, с improvements.

## Контекст

Ключевой operational process. Проверяют понимание incident management.

## Как строить ответ

### Detection

Alerting: PagerDuty, Opsgenie. Monitoring: Prometheus, Grafana. User reports.

### Triage

Severity levels: P1 (critical), P2 (high), P3 (medium). Impact assessment.

### Mitigation

Rollback, feature flag disable, scaling. Communication: status page, stakeholders.

### Post-mortem

Blameless: focus on system, not people. Action items: improvements. Documentation.

## Пример ответа

P1 incident: service down. Detection: alert fires. Triage: P1, affects 100% users. Mitigation: rollback to previous version. Resolution: 15 minutes. Post-mortem: root cause - bad deployment, action: add canary deployment.

## Частые ошибки

- Нет escalation path
- Не делать blameless post-mortems
- Не документировать incidents
- Не отслеживатьMTTR

## Дополнительные вопросы

- Как настроить on-call rotation?
- Что такое blameless post-mortem?
- Как связать incidents и SLO?
