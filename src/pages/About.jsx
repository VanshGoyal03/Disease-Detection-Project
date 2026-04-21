const STEPS = [
  {
    step: '01',
    icon: '📷',
    title: 'Upload',
    desc: 'Take a photo or upload an image of your affected crop from any device.',
    color: 'from-green-700/40 to-green-900/30',
  },
  {
    step: '02',
    icon: '🤖',
    title: 'Detect',
    desc: 'Our AI model analyzes the image and identifies the disease with high accuracy.',
    color: 'from-yellow-700/30 to-yellow-900/20',
  },
  {
    step: '03',
    icon: '✅',
    title: 'Act',
    desc: 'Get instant preventive measures, treatment suggestions, and expert tips.',
    color: 'from-green-800/40 to-green-700/20',
  },
]

export default function About() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'rgba(0,0,0,0.35)' }}>
      <div className="max-w-5xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-12 fade-up">
          <span className="inline-block bg-[#2e7d32]/40 border border-green-500/30 text-[#a5d6a7]
                           text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
            About Us
          </span>
          <h2 className="font-poppins text-3xl md:text-4xl font-bold text-white mb-4">
            Our <span className="text-[#f9a825]">Mission</span>
          </h2>
          <p className="text-white/70 text-base max-w-2xl mx-auto font-inter leading-relaxed">
            Kisaan Bandhu was born from a simple belief: every farmer deserves access to 
            cutting-edge technology. We combine artificial intelligence with agricultural expertise 
            to help farmers across India detect crop diseases early, reduce losses, and 
            maximize their yield — all at zero cost.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          {[
            { val: '50+', label: 'Crops Supported' },
            { val: '200+', label: 'Diseases Detected' },
            { val: '10K+', label: 'Farmers Helped' },
          ].map((s, i) => (
            <div key={i} className="glass text-center p-6 fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <p className="font-poppins text-3xl font-extrabold text-[#f9a825]">{s.val}</p>
              <p className="text-white/60 text-sm mt-1 font-inter">{s.label}</p>
            </div>
          ))}
        </div>

        {/* 3-Step Visual */}
        <h3 className="font-poppins text-xl font-bold text-white text-center mb-8">
          How It Works — <span className="text-[#a5d6a7]">3 Simple Steps</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-12 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-0.5 bg-gradient-to-r from-green-500/50 via-yellow-500/50 to-green-500/50" />

          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`glass bg-gradient-to-br ${s.color} p-6 text-center relative fade-up`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="w-12 h-12 rounded-full bg-[#2e7d32]/60 border-2 border-green-400/50
                              flex items-center justify-center text-2xl mx-auto mb-4 relative z-10 bg-[#0a1a0a]">
                {s.icon}
              </div>
              <span className="absolute top-4 right-4 font-poppins text-4xl font-black text-white/10">
                {s.step}
              </span>
              <h4 className="font-poppins font-bold text-[#f9a825] text-xl mb-2">{s.title}</h4>
              <p className="text-white/65 text-sm font-inter leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
