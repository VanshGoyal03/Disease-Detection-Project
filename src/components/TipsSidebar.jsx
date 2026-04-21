const TIPS = [
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
    emoji: '🌦️',
    title: 'Seasonal Care Tips',
    desc: 'Monsoon seasons increase blight risk. Increase inspection frequency and apply protective sprays before rain.',
  },
  {
    emoji: '🔄',
    title: 'Crop Rotation',
    desc: 'Never plant the same crop in the same spot two seasons in a row — it breaks disease cycles naturally.',
  },
]

export default function TipsSidebar() {
  return (
    <aside className="fade-up" style={{ animationDelay: '0.2s' }}>
      <div className="glass p-6 sticky top-20">
        <h2 className="font-poppins text-xl font-bold text-white mb-1">
          🌾 Crop Disease <span className="text-[#f9a825]">Tips</span>
        </h2>
        <p className="text-white/50 text-xs mb-5">Expert guidance for healthier harvests</p>

        <div className="space-y-3">
          {TIPS.map((tip, i) => (
            <div
              key={i}
              className="tip-card glass-green p-4 cursor-default"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{tip.emoji}</span>
                <div>
                  <h3 className="font-poppins font-semibold text-white text-sm mb-0.5">{tip.title}</h3>
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
