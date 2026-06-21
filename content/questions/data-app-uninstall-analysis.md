---
id: data-app-uninstall-analysis
title: Как анализировать удаление мобильного приложения?
category: Product Analytics
scope: multi-language
languages: ["SQL", "Python", "R"]
roles: ["Data Analyst", "Product Analyst"]
companies: ["Несколько компаний"]
level: Senior
stage: Кейс
tags: ["Mobile analytics", "Retention", "Causal inference"]
duration: 20 мин
difficulty: 5
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Сначала определите наблюдаемый proxy удаления: uninstall напрямую часто не логируется, поэтому используют push-token invalidation, store signals или длительное отсутствие активности — у каждого источника есть bias. Постройте cohort survival по версии, платформе, каналу и lifecycle, свяжите изменение с crash/ANR, latency, permission prompts и продуктовым поведением. Для причинного вывода используйте эксперимент или квазиэксперимент, а не корреляцию последней сессии.

## Контекст

Кейс проверяет формулировку метрики при неполной наблюдаемости и отделение диагностического анализа от причинного.

## Как строить ответ

### Определить событие

Опишите источник uninstall-сигнала, задержку, false positive и различие между удалением и churn.

### Локализовать сегмент

Сравните когорты по release, OS, device, acquisition и стадии onboarding; ищите change point вокруг релизов.

### Проверить причины

Свяжите рост с техническими и продуктовыми событиями, затем подтвердите гипотезу rollout-анализом или экспериментом.

## Частые ошибки

- Считать отсутствие сессии точным uninstall.
- Сравнивать абсолютные удаления без install cohort.
- Делать причинный вывод по корреляции.

## Дополнительные вопросы

- Как учесть задержку uninstall-сигнала?
- Чем uninstall rate отличается от retention?
- Как оценить влияние конкретного релиза?
