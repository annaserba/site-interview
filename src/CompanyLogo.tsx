import { useState } from 'react'

export const companyLogoFiles: Record<string, string> = {
  'Яндекс': '/logos/yandex.svg',
  Ozon: '/logos/ozon.svg',
  Avito: '/logos/avito.svg',
  'Т-Банк': '/logos/tbank.svg',
  VK: '/logos/vk.svg',
  Wildberries: '/logos/wildberries.png',
  Okko: '/logos/okko.svg',
  'Сбер': '/logos/sber.svg',
  'Гознак': '/logos/goznak.svg',
  'Лига Ставок': '/logos/liga.svg',
}

export const companyFallbackColors: Record<string, string> = {
  'Яндекс': '#FFCC00',
  Ozon: '#005BFF',
  Avito: '#00AAFF',
  'Т-Банк': '#FFDD2D',
  VK: '#0077FF',
  Wildberries: '#EC238D',
  Okko: '#4B0A9A',
  'Сбер': '#21A038',
  'Гознак': '#003366',
  'Лига Ставок': '#FF6600',
  'IT One': '#E53935',
  Rutube: '#000000',
  Usetech: '#1E88E5',
}

type CompanyLogoProps = {
  name: string
  size?: number
}

export function CompanyLogo({ name, size = 36 }: CompanyLogoProps) {
  const file = companyLogoFiles[name]
  const [failed, setFailed] = useState(false)

  if (file && !failed) {
    return (
      <span
        className="company-logo company-logo--img"
        style={{ height: size, borderRadius: Math.max(7, Math.round(size * 0.3)) }}
        title={name}
      >
        <img src={file} alt={name} loading="lazy" onError={() => setFailed(true)} />
      </span>
    )
  }

  return (
    <span
      className="company-logo"
      title={name}
      style={{
        background: companyFallbackColors[name] || '#c9ff32',
        width: size,
        height: size,
        flexBasis: size,
        fontSize: Math.max(9, Math.round(size * 0.34)),
      }}
    >
      {name.slice(0, 1)}
    </span>
  )
}
