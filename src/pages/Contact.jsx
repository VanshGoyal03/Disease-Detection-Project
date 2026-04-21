import { useState } from 'react'
import FormInput from '../components/FormInput'

/**
 * TODO: connect to backend — POST /api/contact
 * Sends farmer's name, email, and message to support team
 */
function handleContactSubmit(data) {
  console.log('handleContactSubmit() called with:', data)
  alert(`✅ Message sent!\nName: ${data.name}\nEmail: ${data.email}\n\nTODO: connect to POST /api/contact`)
}

const CONTACT_INFO = [
  { icon: '📍', label: 'Address',   value: 'Krishi Bhavan, New Delhi, India - 110001' },
  { icon: '📞', label: 'Helpline',  value: '1800-XXX-XXXX (Toll Free)' },
  { icon: '✉️', label: 'Email',     value: 'support@kisaanbandhu.in' },
  { icon: '🕐', label: 'Hours',     value: 'Mon–Sat, 9:00 AM – 6:00 PM IST' },
]

export default function Contact() {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent]       = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    if (!name || !email || !message) { alert('Please fill in all fields.'); return }
    handleContactSubmit({ name, email, message })
    setSent(true)
    setName(''); setEmail(''); setMessage('')
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <div
      className="py-20 px-4 sm:px-6 lg:px-8"
      style={{ background: 'rgba(0,0,0,0.4)' }}
    >
      <div className="max-w-5xl mx-auto">

        {/* ── Kisan Mental Health Helpline Banner ─────────────────── */}
        <div className="mb-10 fade-up">
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
                <h3
                  className="font-poppins font-bold text-white"
                  style={{ fontSize: '1.15rem', lineHeight: 1.3 }}
                >
                  Kisan Mental Health Helpline
                </h3>
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
                  India&apos;s official mental health helpline. Offers free counselling, first-aid support and crisis intervention for farmers facing depression or distress.
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

        {/* Header */}
        <div className="text-center mb-12 fade-up">
          <span className="inline-block bg-[#2e7d32]/40 border border-green-500/30 text-[#a5d6a7]
                           text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
            Contact Us
          </span>
          <h2 className="font-poppins text-3xl md:text-4xl font-bold text-white mb-3">
            Get In <span className="text-[#f9a825]">Touch</span>
          </h2>
          <p className="text-white/60 text-sm max-w-md mx-auto font-inter">
            Have a question, feedback, or need help? Our team is here to support you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ── Contact Form ─────────────────────────────────────── */}
          <div className="glass p-8 fade-up">
            <h3 className="font-poppins font-bold text-white text-lg mb-6">Send a Message</h3>

            {sent && (
              <div className="bg-green-900/60 border border-green-500/40 text-green-300 text-sm
                              px-4 py-3 rounded-lg mb-5 flex items-center gap-2 fade-up">
                ✅ Your message has been sent! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={onSubmit} noValidate>
              <FormInput
                id="contact-name"
                label="Your Name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ramesh Kumar"
              />
              <FormInput
                id="contact-email"
                label="Email Address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <div className="mb-4">
                <label htmlFor="contact-message" className="block text-sm font-medium text-green-300 mb-1">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Describe your query or feedback…"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5
                             text-white placeholder-white/40 text-sm outline-none resize-none
                             focus:border-green-400 focus:ring-1 focus:ring-green-400 transition"
                />
              </div>
              <button
                id="contact-submit-btn"
                type="submit"
                className="w-full bg-[#2e7d32] hover:bg-[#388e3c] text-white font-semibold
                           py-2.5 rounded-lg transition-all duration-200 pulse-btn"
              >
                📨 Send Message
              </button>
            </form>
          </div>

          {/* ── Contact Info & Map placeholder ───────────────────── */}
          <div className="flex flex-col gap-5 fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="glass p-6">
              <h3 className="font-poppins font-bold text-white text-lg mb-5">Contact Information</h3>
              <div className="space-y-4">
                {CONTACT_INFO.map((c, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-2xl flex-shrink-0">{c.icon}</span>
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wider font-medium">{c.label}</p>
                      <p className="text-white text-sm mt-0.5">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social / CTA */}
            <div className="glass p-6 flex flex-col items-center text-center">
              <span className="text-4xl mb-3">🌾</span>
              <h4 className="font-poppins font-bold text-white mb-2">Join Our Farmer Community</h4>
              <p className="text-white/60 text-sm mb-4 font-inter">
                Connect with thousands of farmers and get real-time disease alerts.
              </p>
              <div className="flex gap-3">
                {['WhatsApp', 'Telegram', 'YouTube'].map((s, i) => (
                  <button
                    key={i}
                    className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5
                               rounded-full border border-white/20 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-white/10">
          <p className="text-white/30 text-xs font-inter">
            © {new Date().getFullYear()} Kisaan Bandhu · Built with ❤️ for Indian Farmers
          </p>
        </div>
      </div>
    </div>
  )
}
