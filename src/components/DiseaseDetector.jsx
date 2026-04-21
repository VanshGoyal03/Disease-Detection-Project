import { useState, useRef, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

/* ─── Gemini SDK (disease context chat) ─────────────────────────── */
const diseaseGenAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_CHAT_KEY || '')
const diseaseModel = diseaseGenAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' })

/* ─── Severity Badge ─────────────────────────────────────────────── */
const SeverityBadge = ({ level }) => {
  const styles = {
    None:    'bg-green-900/70 text-green-300 border border-green-600/40',
    Low:     'bg-green-900/70 text-green-300 border border-green-600/40',
    Medium:  'bg-yellow-900/70 text-yellow-300 border border-yellow-600/40',
    High:    'bg-red-900/70 text-red-300 border border-red-600/40',
    Unknown: 'bg-gray-900/70 text-gray-300 border border-gray-600/40',
  }
  const icons = { None: '🟢', Low: '🟢', Medium: '🟠', High: '🔴', Unknown: '⚪' }
  const cls = styles[level] || styles.Unknown
  const icon = icons[level] || icons.Unknown
  return (
    <span className={`${cls} text-xs font-bold px-3 py-1 rounded-full`}>
      {icon} {level}
    </span>
  )
}

/* ─── Section Block ──────────────────────────────────────────────── */
const Section = ({ emoji, title, items, color = '#a5d6a7' }) => {
  if (!items?.length) return null
  return (
    <div>
      <p className="text-white/60 text-xs uppercase tracking-wider mb-2 font-semibold">
        {emoji} {title}
      </p>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-white/85">
            <span className="flex-shrink-0 mt-0.5" style={{ color }}>{i + 1}.</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ─── Voice Input Helper ─────────────────────────────────────────── */
function startVoiceInput(setInput) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) { alert('🎤 Voice input not supported in this browser.'); return }
  const recognition = new SpeechRecognition()
  recognition.lang = 'en-IN'
  recognition.interimResults = false
  recognition.onresult = (e) => setInput(e.results[0][0].transcript)
  recognition.onerror  = (e) => console.error('Voice error:', e.error)
  recognition.start()
}

/* ─── Contextual Chat (below result) ─────────────────────────────── */
function getSuggestedQuestions(diseaseName) {
  return [
    `How do I treat ${diseaseName}?`,
    `Will it spread to other crops?`,
    `What organic remedies work?`,
    `How to prevent it next season?`,
  ]
}

async function fetchContextualReply(userMessage, diseaseName) {
  try {
    const prompt = `You are Kisaan Bandhu AI, an expert in Indian crop diseases.
The farmer's crop has been diagnosed with: ${diseaseName}.
Answer the following question briefly and practically in English.
You may add a helpful Hindi phrase if relevant. Keep response under 3 sentences.
Question: ${userMessage}`

    const result = await diseaseModel.generateContent(prompt)
    return result.response.text()
  } catch (err) {
    console.error('Gemini SDK error:', err)
    return '🙏 Connection error. Please check your internet and try again.'
  }
}

const Bubble = ({ msg }) => (
  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
    {msg.role === 'bot' && <span className="text-lg mr-2 flex-shrink-0 self-end">🌿</span>}
    <div
      className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed
        ${msg.role === 'user'
          ? 'bg-[#f9a825]/90 text-black rounded-br-sm font-medium'
          : 'bg-[#2e7d32]/70 text-white rounded-bl-sm border border-green-500/30'
        }`}
    >
      {msg.text}
    </div>
    {msg.role === 'user' && <span className="text-lg ml-2 flex-shrink-0 self-end">👨‍🌾</span>}
  </div>
)

function ResultChat({ result }) {
  const diseaseName = result.diseaseName
  const suggestions = getSuggestedQuestions(diseaseName)
  const [messages, setMessages] = useState([{
    id: 1, role: 'bot',
    text: `🙏 Analysis complete! Detected **${diseaseName}** with ${result.confidence ?? '–'}% confidence. Ask me anything about treatment, prevention, or next steps.`,
  }])
  const [input,  setInput]  = useState('')
  const [typing, setTyping] = useState(false)
  const chatRef = useRef(null)

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, typing])

  const send = async (text) => {
    const trimmed = (text ?? input).trim()
    if (!trimmed) return
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: trimmed }])
    setInput('')
    setTyping(true)
    const reply = await fetchContextualReply(trimmed, diseaseName)
    setTyping(false)
    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: reply }])
  }

  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">💬</span>
        <h4 className="font-poppins font-semibold text-white text-sm">Ask about this result</h4>
        <span className="text-[10px] bg-[#a5d6a7]/20 text-[#a5d6a7] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
          AI Assistant
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {suggestions.map((q, i) => (
          <button key={i} onClick={() => send(q)} disabled={typing}
            className="text-[11px] bg-white/5 hover:bg-[#2e7d32]/50 disabled:opacity-40
                       border border-white/15 hover:border-green-500/40
                       text-white/80 hover:text-white px-3 py-1.5 rounded-full transition-all">
            {q}
          </button>
        ))}
      </div>

      <div ref={chatRef} className="h-44 overflow-y-auto mb-3 pr-1 space-y-0.5"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
        {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}
        {typing && (
          <div className="flex justify-start mb-2">
            <span className="text-lg mr-2">🌿</span>
            <div className="bg-[#2e7d32]/70 border border-green-500/30 px-3 py-2 rounded-2xl rounded-bl-sm flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input id="result-chat-input" type="text" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Ask anything about this disease…"
          className="flex-1 rounded-full px-4 py-2 text-white text-xs outline-none transition
                     focus:border-green-400 focus:ring-1 focus:ring-green-400"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.18)', caretColor: '#a5d6a7' }}
        />
        <button id="result-chat-voice" onClick={() => startVoiceInput(setInput)} title="Voice input"
          className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full border border-white/20 transition text-sm flex-shrink-0">
          🎤
        </button>
        <button id="result-chat-send" onClick={() => send()} disabled={!input.trim() || typing}
          className="bg-[#2e7d32] hover:bg-[#388e3c] disabled:opacity-40 disabled:cursor-not-allowed
                     text-white px-4 py-2 rounded-full font-semibold text-xs transition flex-shrink-0">
          Send
        </button>
      </div>
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function DiseaseDetector({ weather }) {
  const [preview,         setPreview]         = useState(null)
  const [detectionResult, setDetectionResult] = useState(null)
  const [loading,         setLoading]         = useState(false)
  const [error,           setError]           = useState('')
  const [cameraActive,    setCameraActive]    = useState(false)

  const fileInputRef = useRef(null)
  const videoRef     = useRef(null)
  const streamRef    = useRef(null)
  const canvasRef    = useRef(null)

  // ── Real detect: sends image to POST /api/detect ──────────────────
  const detectDisease = async (file) => {
    if (!file) { alert('Please select an image first.'); return }
    setLoading(true)
    setError('')
    setDetectionResult(null)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch(`${API_BASE}/api/detect`, { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Detection failed')
      setDetectionResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── File upload ───────────────────────────────────────────────────
  const onFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setDetectionResult(null)
    setError('')
    detectDisease(file)
  }

  // ── Camera: open stream ───────────────────────────────────────────
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      setCameraActive(true)
    } catch (err) {
      alert('❌ Camera access denied: ' + err.message)
    }
  }

  // Attach stream to video element once camera is active
  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play()
    }
  }, [cameraActive])

  // ── Camera: stop stream ───────────────────────────────────────────
  const closeCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setCameraActive(false)
  }

  // ── Camera: capture frame → detect ───────────────────────────────
  const captureFrame = () => {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    canvas.toBlob(blob => {
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
      setPreview(URL.createObjectURL(blob))
      setDetectionResult(null)
      setError('')
      closeCamera()
      detectDisease(file)
    }, 'image/jpeg', 0.92)
  }

  return (
    <div className="glass p-6 md:p-8 fade-up">

      {/* Heading */}
      <h2 className="font-poppins text-2xl md:text-3xl font-bold text-white mb-2">
        🌿 Detect Crop Disease <span className="text-[#f9a825]">Instantly</span>
      </h2>
      <p className="text-white/60 text-sm mb-6 font-inter">
        Upload a photo or use your camera — our AI (powered by Gemini) identifies the disease in seconds.
      </p>

      {/* Live Weather Context Strip */}
      {weather && (
        <div className="flex items-center gap-3 mb-5 px-4 py-2.5 rounded-xl bg-[#1a2e3a]/60 border border-[#64b5f6]/20">
          <span className="text-xl">{weather.condEmoji}</span>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5">
            <span className="text-[#64b5f6] text-xs font-semibold">📍 {weather.city}</span>
            <span className="text-white/50 text-xs">{Math.round(weather.temp)}°C · {weather.condition} · 💧{weather.humidity}%</span>
            <span className="text-white/40 text-xs">{weather.season.emoji} {weather.season.name}</span>
          </div>
          <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
            weather.risk?.level === 'high'   ? 'bg-red-900/60 text-red-300' :
            weather.risk?.level === 'medium' ? 'bg-yellow-900/60 text-yellow-300' :
                                               'bg-green-900/60 text-green-300'
          }`}>
            {weather.risk?.level?.toUpperCase()} RISK
          </span>
        </div>
      )}

      {/* ── Camera Live View ─────────────────────────────────────── */}
      {cameraActive && (
        <div className="mb-5 relative rounded-xl overflow-hidden border border-white/20">
          <video ref={videoRef} autoPlay playsInline muted
            className="w-full max-h-72 object-cover bg-black" />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
            <button onClick={captureFrame}
              className="bg-white text-black font-bold text-sm px-6 py-2 rounded-full shadow-lg
                         hover:bg-green-200 transition-all duration-200 flex items-center gap-2">
              📸 Capture
            </button>
            <button onClick={closeCamera}
              className="bg-red-900/80 text-white text-sm px-4 py-2 rounded-full hover:bg-red-700 transition">
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* Upload / Preview Box */}
      {!cameraActive && (
        <div className="upload-box p-8 flex flex-col items-center justify-center gap-4 mb-6 min-h-[160px]">
          {preview ? (
            <div className="relative w-full">
              <img src={preview} alt="Uploaded crop" className="w-full max-h-64 object-contain rounded-xl" />
              <button
                onClick={() => { setPreview(null); setDetectionResult(null); setError('') }}
                className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full hover:bg-black/80 transition">
                ✕ Clear
              </button>
            </div>
          ) : (
            <>
              <div className="text-5xl opacity-40">📷</div>
              <p className="text-white/50 text-sm text-center">No image selected.<br/>Open camera or upload a photo.</p>
            </>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {!cameraActive && (
        <div className="flex gap-3 mb-6 flex-wrap">
          <button id="open-camera-btn" onClick={openCamera}
            className="flex items-center gap-2 bg-[#2e7d32]/80 hover:bg-[#2e7d32] text-white
                       font-semibold px-5 py-2.5 rounded-full transition text-sm">
            📷 Open Camera
          </button>
          <button id="upload-image-btn" onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-[#f9a825]/90 hover:bg-[#f9a825] text-black
                       font-semibold px-5 py-2.5 rounded-full transition text-sm">
            📁 Upload Image
          </button>
          <input ref={fileInputRef} id="file-input" type="file" accept="image/*"
            className="hidden" onChange={onFileChange} />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="glass-green p-4 flex items-center gap-3 mb-4">
          <svg className="animate-spin h-5 w-5 text-green-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          <div>
            <p className="text-green-300 text-sm font-medium">Analyzing your crop image…</p>
            <p className="text-white/40 text-xs">Powered by Gemini AI · Usually takes 3–8 seconds</p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && !loading && (
        <div className="bg-red-900/60 border border-red-500/40 text-red-300 text-sm px-4 py-3 rounded-lg mb-4">
          ❌ {error}
        </div>
      )}

      {/* ── Result Card ───────────────────────────────────────────── */}
      {detectionResult && !loading && (
        <div id="detection-result-card" className="glass-green p-6 fade-up space-y-5">

          {/* Header row */}
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Disease Detected</p>
              <h3 className="font-poppins font-bold text-white text-xl">{detectionResult.diseaseName}</h3>
              {detectionResult.confidence > 0 && (
                <p className="text-white/40 text-xs mt-1">
                  🎯 {detectionResult.confidence}% confidence
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Severity</p>
                <SeverityBadge level={detectionResult.severity} />
              </div>
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Spreads to Humans?</p>
                <span className={`text-xs font-bold px-3 py-1 rounded-full
                  ${detectionResult.spreadToHumans ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                  {detectionResult.spreadToHumans ? '⚠️ Yes' : '✅ No'}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {detectionResult.description && (
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">📋 Overview</p>
              <p className="text-white/80 text-sm leading-relaxed">{detectionResult.description}</p>
            </div>
          )}

          {/* Symptoms */}
          <Section emoji="🔎" title="Visible Symptoms" items={detectionResult.symptoms} color="#ef9a9a" />

          {/* Cure */}
          <Section emoji="💊" title="Treatment Steps" items={detectionResult.cure} color="#a5d6a7" />

          {/* Precautions */}
          <Section emoji="🛡️" title="Precautions" items={detectionResult.precautions} color="#90caf9" />

          {/* Organic Remedies */}
          <Section emoji="🌿" title="Organic Remedies" items={detectionResult.organicRemedies} color="#ce93d8" />

          {/* Inline Contextual Chat */}
          <ResultChat result={detectionResult} />
        </div>
      )}
    </div>
  )
}
