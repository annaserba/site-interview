---
id: genai-diffusion
title: Как работают diffusion models для генерации изображений?
category: System Design
scope: universal
languages: []
roles: ["Data Engineering", "Data Science"]
companies: ["Несколько компаний"]
level: Senior
stage: Архитектура
tags: ["GenAI", "Diffusion", "Image Generation"]
duration: 10 мин
difficulty: 4
sourceType: aggregated
sourceUrl: ""
---

## Короткий ответ

Diffusion models: добавляют noise к изображению (forward process), затем учат model denoise (reverse process). Stable Diffusion: latent diffusion (working в latent space). Другие: DALL-E, Midjourney.

## Контекст

Ключевая архитектура для image generation. Проверяют понимание diffusion process.

## Как строить ответ

### Forward process

Изображение → добавляем Gaussian noise → чистый noise. Много шагов (1000+).

### Reverse process

Noise → model предсказывает noise → denoise → изображение.

### Latent diffusion

Stable Diffusion: работает в latent space (compress через VAE). Быстрее, menos memory.

## Пример ответа

Training: изображение → add noise → model learns to predict noise. Generation: random noise → iterative denoising → image. Prompt: "a cat sitting on a mat" → cross-attention → controls denoising process.

## Частые ошибки

- Не понимать forward/reverse process
- Игнорировать computational cost
- Не использовать latent space
- Не контролировать generation через prompts

## Дополнительные вопросы

- Как работает latent space в Stable Diffusion?
- Что такое cross-attention в diffusion models?
- Как связать diffusion models и text-to-image?
