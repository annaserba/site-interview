import { useState } from 'react'

// Превью YouTube-видео с цепочкой фолбэков:
// 1. локальный файл /thumbnails/<id>.jpg (скачивается scripts/fetch-thumbnails.mjs)
// 2. i.ytimg.com (если YouTube доступен)
// 3. ничего — показывается фон .youtube-preview с кнопкой play
export function YtThumb({ videoId }: { videoId: string }) {
  const [stage, setStage] = useState<'local' | 'remote' | 'failed'>('local')

  if (stage === 'failed') return null

  return (
    <img
      src={stage === 'local'
        ? `/thumbnails/${videoId}.jpg`
        : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
      alt=""
      loading="lazy"
      onError={() => setStage(stage === 'local' ? 'remote' : 'failed')}
    />
  )
}
