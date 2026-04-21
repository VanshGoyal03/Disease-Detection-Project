const CROPS = [
  { name: 'Wheat',      emoji: '🌾', diseases: ['Rust', 'Smut', 'Blight'] },
  { name: 'Rice',       emoji: '🍚', diseases: ['Blast', 'Brown Spot', 'Sheath Rot'] },
  { name: 'Tomato',     emoji: '🍅', diseases: ['Late Blight', 'Leaf Curl', 'Mosaic Virus'] },
  { name: 'Potato',     emoji: '🥔', diseases: ['Early Blight', 'Late Blight', 'Black Leg'] },
  { name: 'Maize/Corn', emoji: '🌽', diseases: ['Northern Leaf Blight', 'Rust', 'Smut'] },
  { name: 'Cotton',     emoji: '🌿', diseases: ['Bollworm', 'Leaf Spot', 'Wilt'] },
  { name: 'Sugarcane',  emoji: '🎋', diseases: ['Red Rot', 'Smut', 'Grassy Shoot'] },
  { name: 'Soybean',    emoji: '🫘', diseases: ['Sudden Death', 'Brown Stem Rot', 'Rust'] },
]

const DISEASE_INFO = [
  { name: 'Late Blight',    type: 'Fungal',    risk: 'High',   affectedCrop: 'Potato / Tomato' },
  { name: 'Leaf Rust',      type: 'Fungal',    risk: 'Medium', affectedCrop: 'Wheat / Maize' },
  { name: 'Mosaic Virus',   type: 'Viral',     risk: 'High',   affectedCrop: 'Tomato / Pepper' },
  { name: 'Bacterial Wilt', type: 'Bacterial', risk: 'High',   affectedCrop: 'Multiple Crops' },
  { name: 'Powdery Mildew', type: 'Fungal',    risk: 'Low',    affectedCrop: 'Cucurbits' },
  { name: 'Smut',           type: 'Fungal',    risk: 'Medium', affectedCrop: 'Wheat / Maize' },
]

const riskColor = (r) =>
  r === 'High' ? 'bg-red-900/60 text-red-300' :
  r === 'Medium' ? 'bg-orange-900/60 text-orange-300' :
  'bg-green-900/60 text-green-300'

const typeColor = (t) =>
  t === 'Fungal' ? 'bg-purple-900/50 text-purple-300' :
  t === 'Viral' ? 'bg-blue-900/50 text-blue-300' :
  'bg-yellow-900/50 text-yellow-300'

export default function Info() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12 fade-up">
          <span className="inline-block bg-[#2e7d32]/40 border border-green-500/30 text-[#a5d6a7]
                           text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
            Information Hub
          </span>
          <h2 className="font-poppins text-3xl md:text-4xl font-bold text-white mb-3">
            Supported <span className="text-[#f9a825]">Crops</span> &amp; <span className="text-[#a5d6a7]">Diseases</span>
          </h2>
          <p className="text-white/60 text-sm max-w-xl mx-auto font-inter">
            Our AI is trained on 200+ diseases across major Indian crops.
          </p>
        </div>

        {/* Crops Grid */}
        <h3 className="font-poppins font-bold text-white text-lg mb-5">🌱 Supported Crops</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          {CROPS.map((c, i) => (
            <div
              key={i}
              className="glass text-center p-5 hover:bg-white/10 transition-all duration-200
                         cursor-default fade-up group"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">
                {c.emoji}
              </div>
              <h4 className="font-poppins font-semibold text-white text-sm mb-2">{c.name}</h4>
              <div className="flex flex-wrap gap-1 justify-center">
                {c.diseases.map((d, j) => (
                  <span key={j} className="text-[10px] bg-green-900/40 text-green-300
                                           px-2 py-0.5 rounded-full border border-green-700/30">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Disease Table */}
        <h3 className="font-poppins font-bold text-white text-lg mb-5">🦠 Common Diseases</h3>
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-3 text-[#a5d6a7] font-semibold font-poppins text-xs uppercase tracking-wider">Disease</th>
                  <th className="text-left px-6 py-3 text-[#a5d6a7] font-semibold font-poppins text-xs uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-3 text-[#a5d6a7] font-semibold font-poppins text-xs uppercase tracking-wider">Risk</th>
                  <th className="text-left px-6 py-3 text-[#a5d6a7] font-semibold font-poppins text-xs uppercase tracking-wider">Affects</th>
                </tr>
              </thead>
              <tbody>
                {DISEASE_INFO.map((d, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-3.5 font-medium text-white">{d.name}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColor(d.type)}`}>
                        {d.type}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${riskColor(d.risk)}`}>
                        {d.risk}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-white/60">{d.affectedCrop}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
