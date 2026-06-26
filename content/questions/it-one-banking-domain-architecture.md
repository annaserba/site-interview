---
id: it-one-banking-domain-architecture
title: Как спроектировать фронтенд для банковской системы кредитования?
category: Frontend Architecture
scope: language-specific
languages: ["JavaScript", "TypeScript"]
roles: ["Frontend"]
companies: ["IT One"]
level: Senior
stage: Архитектура
tags: ["Architecture", "Banking", "Domain Driven Design", "Microservices"]
duration: 20 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
sourceVideos: []
---

## Короткий ответ

Банковский фронтенд кредитования строится на разделении bounded contexts: заявка, скоринг, договор, платежи — каждый с собственным API и state management. Multi-step wizard для подачи заявки с валидацией на каждом шаге. Интеграция с backend через REST/gRPC, безопасность (PCI DSS, шифрование PII), аудит всех действий пользователя с timestamp и IP.

## Контекст

Интервьюер ожидает понимания домена (кредитование), архитектурных решений для сложных банковских систем, безопасностных требований и управления сложными workflow.

## Как строить ответ

### Bounded contexts

Разделение на контексты: Apply (заявка), Scoring (оценка), Contract (договор), Payment (платежи). Каждый — отдельный module с API.

### Multi-step workflow

Wizard с серверной валидацией: шаг 1 (personal data) → шаг 2 (income) → шаг 3 (documents) → решение. Состояние сохраняется между шагами.

### Security requirements

PCI DSS для платёжных данных, шифрование PII, JWT/session management, rate limiting, CSP headers, аудит.

### Audit trail

Каждое действие логируется: userId, action, timestamp, IP, userAgent. Хранится в отдельном audit log.

### API integration

REST для CRUD-операций, gRPC для real-time обновлений (статус заявки). Retry policies, circuit breaker для fault tolerance.

## Код из интервью

```typescript
// Multi-step credit application wizard
// features/credit-application/model/types.ts

interface CreditApplication {
  id: string;
  status: 'draft' | 'submitted' | 'scoring' | 'approved' | 'rejected';
  currentStep: 1 | 2 | 3 | 4;
  personalData: PersonalData;
  incomeData: IncomeData;
  documents: Document[];
  auditLog: AuditEntry[];
}

interface AuditEntry {
  userId: string;
  action: string;
  timestamp: string;
  ip: string;
  metadata?: Record<string, unknown>;
}

// Bounded context API client
class CreditAPI {
  private auditLogger: AuditLogger;

  async submitApplication(appId: string, data: Partial<CreditApplication>) {
    this.auditLogger.log('application.submit', appId);
    return this.client.post(`/api/v1/applications/${appId}/submit`, data);
  }

  async getScoringResult(appId: string) {
    this.auditLogger.log('scoring.request', appId);
    return this.client.get(`/api/v1/scoring/${appId}/result`);
  }
}

// Step validation with server-side check
async function validateStep(step: number, data: unknown): Promise<ValidationResult> {
  const response = await fetch(`/api/v1/validation/step-${step}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

## Пример ответа

Проектируя фронтенд для банковской системы кредитования, я начинаю с Domain Driven Design: выделяю bounded contexts — Apply (подача заявки), Scoring (кредитный скоринг), Contract (управление договорами), Payment (платежи и график). Каждый контекст имеет собственный API, state management и UI module.

Multi-step wizard для подачи заявки: шаг 1 — персональные данные (ФИО, паспорт), шаг 2 — доход и занятость, шаг 3 — загрузка документов, шаг 4 — подтверждение. На каждом шаге серверная валидация: бэкенд проверяет данные, возвращает ошибки, и только после этого разрешает переход дальше.

Безопасность — приоритет: PCI DSS для платёжных данных (не храним CVV, шифруем номер карты), JWT с коротким TTL, CSP headers, rate limiting на API. Все PII шифруются на клиенте перед отправкой.

Аудит: каждое действие пользователя (открытие формы, заполнение поля, отправка заявки) логируется с userId, timestamp, IP и userAgent. Это критично для Compliance и разрешения споров.

Интеграция с backend: REST для CRUD (создание/обновление заявки), gRPC для real-time обновлений (статус скоринга через streaming). Использую circuit breaker и retry policies для fault tolerance.

## Частые ошибки

- Хранитьные данные (номера карт, СНИЛС) в localStorage или Redux.
- Не делать серверную валидацию, полагаясь только на клиентскую.
- Пропускать аудит действий — это нарушение Compliance.
- Использовать один API для всех bounded contexts вместо разделения.
- Не учитывать offline-режим и retry при потере соединения.

## Дополнительные вопросы

- Как реализовать real-time статус заявки для пользователя?
- Как обеспечить PCI DSS compliance на фронтенде?
- Как спроектировать multi-tenant систему для разных банков?
- Как тестировать сложные workflow с множеством шагов?
