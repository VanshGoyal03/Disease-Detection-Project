const BASE_TIPS = [
  {
    emoji: '🔍',
    title: 'Early Detection Signs',
    desc: 'Watch for yellowing leaves, brown spots, or wilting — these are the first warnings of infection.',
  },
  {
    emoji: '💧',
    title: 'Smart Watering Practices',
    desc: 'Water at the base, not the leaves. Overwatering creates the humid environment fungi love.',
  },
  {
    emoji: '🌍',
    title: 'Soil Health Matters',
    desc: 'Test your soil pH every season. Healthy soil (6.0–7.0 pH) builds natural disease resistance.',
  },
  {
    emoji: '🧪',
    title: 'Safe Pesticide Usage',
    desc: 'Use neem oil or copper-based fungicides. Always follow label instructions and wear protective gear.',
  },
  {
    emoji: '🔄',
    title: 'Crop Rotation',
    desc: 'Never plant the same crop in the same spot two seasons in a row — it breaks disease cycles naturally.',
  },
]

/* ──────────────────────────────────────────────────────────────────
   Pick the SINGLE most relevant weather tip based on current conditions.
   Returns null if no notable condition is detected.
─────────────────────────────────────────────────────────────────── */
function getTopWeatherTip(weather) {
  if (!weather) return null

  const isRainy = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weather.wmoCode)

  // Priority order: rain > high humidity > extreme heat > monsoon season
  if (isRainy)
    return {
      emoji: '☔',
      title: 'Rainy Conditions Nearby',
      desc: `${weather.condition} near ${weather.city || 'your farm'}. Avoid spraying pesticides now — rain washes them off. Check for waterlogging around roots.`,
      highlight: true,
    }
  if (weather.humidity > 75)
    return {
      emoji: '🍄',
      title: 'High Humidity Alert',
      desc: `Humidity is ${weather.humidity}% near you. Fungal pathogens thrive above 70%. Apply preventive fungicide and improve crop airflow today.`,
      highlight: true,
    }
  if (weather.temp > 35)
    return {
      emoji: '🌡️',
      title: 'Extreme Heat Warning',
      desc: `It's ${Math.round(weather.temp)}°C near ${weather.city || 'you'}. Bacterial wilt and heat stress risk is elevated. Irrigate early morning and consider shade netting.`,
      highlight: true,
    }
  if (weather.season?.name === 'Monsoon')
    return {
      emoji: '🌧️',
      title: 'Monsoon Season Mode',
      desc: `Monsoon is active near ${weather.city || 'you'}. Blight, rust and downy mildew risk peaks now. Schedule weekly crop walks and rotate fungicide types.`,
      highlight: true,
    }

  return null
}

export default function TipsSidebar({ weather }) {
  const weatherTip = getTopWeatherTip(weather)

  // Always show exactly 5 tips:
  // • No weather → show all 5 base tips
  // • Weather available → inject 1 live tip at top, show first 4 base tips = 5 total
  const tips = weatherTip
    ? [weatherTip, ...BASE_TIPS.slice(0, 4)]   // 1 live + first 4 base = 5
    : BASE_TIPS                                  // all 5 base

  return (
    <aside className="fade-up" style={{ animationDelay: '0.2s' }}>
      <div className="glass p-6 sticky top-20">
        <h2 className="font-poppins text-xl font-bold text-white mb-1">
          🌾 Crop Disease <span className="text-[#f9a825]">Tips</span>
        </h2>
        <p className="text-white/50 text-xs mb-5">
          {weather
            ? `📍 Personalised for ${weather.city || 'your location'}`
            : 'Expert guidance for healthier harvests'}
        </p>

        <div className="space-y-3">
          {tips.map((tip, i) => (
            <div
              key={i}
              className={`tip-card p-4 cursor-default ${
                tip.highlight
                  ? 'border border-yellow-500/30 bg-yellow-900/20 rounded-xl'
                  : 'glass-green'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{tip.emoji}</span>
                <div>
                  <h3 className="font-poppins font-semibold text-white text-sm mb-0.5 flex items-center gap-2">
                    {tip.title}
                    {tip.highlight && (
                      <span className="text-[10px] bg-yellow-500/30 text-yellow-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                        Live
                      </span>
                    )}
                  </h3>
                  <p className="text-white/65 text-xs leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
