import DiseaseDetector from '../components/DiseaseDetector'
import Chatbot from '../components/Chatbot'
import TipsSidebar from '../components/TipsSidebar'

export default function Home() {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Hero Banner */}
        <div className="text-center mb-10 fade-up">
          <span className="inline-block bg-[#2e7d32]/40 border border-green-500/30 text-[#a5d6a7]
                           text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
            🌱 AI-Powered Farm Assistant
          </span>
          <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Protect Your <span className="text-[#f9a825]">Crops</span>,<br />
            Secure Your <span className="text-[#a5d6a7]">Harvest</span>
          </h1>
          <p className="mt-4 text-white/65 text-lg max-w-xl mx-auto font-inter">
            Kisaan Bandhu uses AI to detect crop diseases instantly and give you 
            actionable preventive measures — right from your phone.
          </p>
        </div>

        {/* ── Kisan Mental Health Helpline Banner ─────────────────── */}
        <div className="mb-8 fade-up" style={{ animationDelay: '0.1s' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(74,20,140,0.55) 0%, rgba(30,60,30,0.6) 100%)',
              border: '1px solid rgba(186,104,200,0.4)',
              borderRadius: '1rem',
              padding: '1.5rem 2rem',
              backdropFilter: 'blur(14px)',
            }}
          >
            {/* Header row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span style={{ fontSize: '2rem' }}>🧠</span>
              <div>
                <h2
                  className="font-poppins font-bold text-white"
                  style={{ fontSize: '1.15rem', lineHeight: 1.3 }}
                >
                  Kisan Mental Health Helpline
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem', marginTop: '2px' }}>
                  You are not alone — free, confidential support available 24 × 7
                </p>
              </div>
              <span
                style={{
                  marginLeft: 'auto',
                  background: 'rgba(186,104,200,0.25)',
                  border: '1px solid rgba(186,104,200,0.5)',
                  color: '#ce93d8',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                FREE &amp; TOLL-FREE
              </span>
            </div>

            {/* Why it matters */}
            <p
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.82rem',
                lineHeight: 1.65,
                marginBottom: '1.2rem',
                maxWidth: '860px',
              }}
            >
              Farming is one of the most stressful professions — crop failure, debt, drought, and uncertain
              markets can weigh heavily on a farmer&apos;s mind. If you or someone you know is feeling hopeless,
              overwhelmed, or is thinking of self-harm, please reach out immediately. Trained counsellors
              who understand rural hardships are available in <strong style={{ color: '#ce93d8' }}>Hindi, Marathi, Telugu, Tamil and 12+ other languages</strong>.
            </p>

            {/* Helpline cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              {/* KIRAN */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(186,104,200,0.3)',
                  borderRadius: '0.75rem',
                  padding: '1rem 1.1rem',
                }}
              >
                <p style={{ color: '#ce93d8', fontWeight: 700, fontSize: '0.8rem', marginBottom: '4px' }}>
                  🏛️ KIRAN (Govt. of India)
                </p>
                <a
                  href="tel:18005990019"
                  style={{
                    display: 'block',
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    letterSpacing: '-0.5px',
                    fontFamily: 'Poppins, sans-serif',
                    textDecoration: 'none',
                  }}
                >
                  1800-599-0019
                </a>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', marginTop: '4px' }}>
                  Toll-free · 24 × 7 · 13 languages
                </p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.73rem', marginTop: '6px', lineHeight: 1.5 }}>
                  India's official mental health helpline. Offers free counselling, first-aid support and crisis intervention for farmers facing depression or distress.
                </p>
              </div>

              {/* iCall */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(186,104,200,0.3)',
                  borderRadius: '0.75rem',
                  padding: '1rem 1.1rem',
                }}
              >
                <p style={{ color: '#ce93d8', fontWeight: 700, fontSize: '0.8rem', marginBottom: '4px' }}>
                  🎓 iCall (TISS Mumbai)
                </p>
                <a
                  href="tel:9152987821"
                  style={{
                    display: 'block',
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    letterSpacing: '-0.5px',
                    fontFamily: 'Poppins, sans-serif',
                    textDecoration: 'none',
                  }}
                >
                  9152987821
                </a>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', marginTop: '4px' }}>
                  Mon–Sat, 8 AM – 10 PM
                </p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.73rem', marginTop: '6px', lineHeight: 1.5 }}>
                  Psychologists trained at TISS offer free talk therapy. Especially helpful for farmers coping with financial anxiety, grief after crop loss or family pressure.
                </p>
              </div>

              {/* Vandrevala Foundation */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(186,104,200,0.3)',
                  borderRadius: '0.75rem',
                  padding: '1rem 1.1rem',
                }}
              >
                <p style={{ color: '#ce93d8', fontWeight: 700, fontSize: '0.8rem', marginBottom: '4px' }}>
                  💜 Vandrevala Foundation
                </p>
                <a
                  href="tel:18602662345"
                  style={{
                    display: 'block',
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    letterSpacing: '-0.5px',
                    fontFamily: 'Poppins, sans-serif',
                    textDecoration: 'none',
                  }}
                >
                  1860-2662-345
                </a>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', marginTop: '4px' }}>
                  Toll-free · 24 × 7 · Hindi &amp; English
                </p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.73rem', marginTop: '6px', lineHeight: 1.5 }}>
                  Round-the-clock crisis line. Ideal when a farmer or family member feels suicidal or is in acute emotional distress — no appointment needed, fully confidential.
                </p>
              </div>

            </div>

            {/* Reminder note */}
            <p
              style={{
                marginTop: '1rem',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '0.7rem',
                textAlign: 'center',
              }}
            >
              💡 Tap any number above to call directly · Seeking help is a sign of strength, not weakness
            </p>
          </div>
        </div>

        {/* Two-Column Layout: 65% left / 35% right */}
        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6">

          {/* ─── LEFT COLUMN ─────────────────────────────────────── */}
          <div className="space-y-6">
            <DiseaseDetector />
            <Chatbot />
          </div>

          {/* ─── RIGHT COLUMN ────────────────────────────────────── */}
          <div>
            <TipsSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
