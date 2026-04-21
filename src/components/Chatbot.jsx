import { useState, useRef, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
/* ─── Stub Handlers ─────────────────────────────────────────────── */

/**
 * TODO: connect to backend — POST /api/chat
 * Send user message, receive AI response
 */
/* ─── Gemini SDK ────────────────────────────────────────────────── */
const chatGenAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_CHAT_KEY || '')
const chatModel = chatGenAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' })

async function fetchBotResponse(userMessage) {
  try {
    const prompt = `You are Kisaan Bandhu AI, a helpful assistant for Indian farmers.
Answer briefly in English or Hindi based on user's language strictly if he states language otherwise answer in English. You may add a helpful Hindi phrase if relevant.
Keep the response under 6 sentences.
User asked: ${userMessage}`

    const result = await chatModel.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    console.error('Gemini SDK Error:', error)
    return '🙏 Maaf kijiye, connection error. Please try again.'
  }
}

/**
 * TODO: connect to Web Speech API for voice input
 * Uses SpeechRecognition to capture voice and fill message input
 */
function handleVoiceInput(setInput) {
  console.log('handleVoiceInput() called')
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    alert('🎤 Voice input not supported in your browser.\nTODO: use a polyfill or server-side STT.')
    return
  }
  const recognition = new SpeechRecognition()
  recognition.lang = 'en-IN'
  recognition.interimResults = false
  recognition.maxAlternatives = 1
  recognition.onstart  = () => console.log('Voice recognition started…')
  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript
    console.log('Voice transcript:', transcript)
    setInput(transcript)
    // TODO: optionally auto-send after voice input
  }
  recognition.onerror  = (e) => { console.error('Voice error:', e.error); alert('Voice error: ' + e.error) }
  recognition.start()
}

/* ─── Message Bubble ─────────────────────────────────────────────── */
const Bubble = ({ msg }) => (
  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
    {msg.role === 'bot' && (
      <span className="text-xl mr-2 flex-shrink-0 self-end">🌿</span>
    )}
    <div
      className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
        ${msg.role === 'user'
          ? 'bg-[#f9a825]/90 text-black rounded-br-sm font-medium'
          : 'bg-[#2e7d32]/70 text-white rounded-bl-sm border border-green-500/30'
        }`}
    >
      {msg.text}
    </div>
    {msg.role === 'user' && (
      <span className="text-xl ml-2 flex-shrink-0 self-end">👨‍🌾</span>
    )}
  </div>
)

/* ─── Main Chatbot Component ─────────────────────────────────────── */
export default function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: '🙏 Namaste! I am Kisaan Bandhu AI. Ask me anything about crop diseases, prevention, or farming tips!' }
  ])
  const [input, setInput]     = useState('')
  const [typing, setTyping]   = useState(false)
  const chatWindowRef = useRef(null)
  const bottomRef     = useRef(null)

  // Scroll only the chat window — NOT the whole page
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
    }
  }, [messages, typing])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text) return

    // Add user message
    const userMsg = { id: Date.now(), role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)

    // TODO: connect to backend — fetchBotResponse calls /api/chat
    const botText = await fetchBotResponse(text)
    setTyping(false)
    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: botText }])
  }

  const onKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }

  return (
    <div className="glass p-6 md:p-8 mt-6 fade-up">
      <h2 className="font-poppins text-xl md:text-2xl font-bold text-white mb-1">
        🤖 Ask <span className="text-[#a5d6a7]">Kisaan Bandhu</span> AI
      </h2>
      <p className="text-white/50 text-xs mb-4 font-inter">Powered by AI · Hindi & English supported</p>

      {/* Chat Window */}
      <div
        id="chat-window"
        ref={chatWindowRef}
        className="chat-window h-64 overflow-y-auto mb-4 pr-1 space-y-1"
      >
        {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}

        {/* Typing indicator */}
        {typing && (
          <div className="flex justify-start mb-3">
            <span className="text-xl mr-2">🌿</span>
            <div className="bg-[#2e7d32]/70 border border-green-500/30 px-4 py-2.5 rounded-2xl rounded-bl-sm flex gap-1 items-center">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: '0ms'   }} />
              <span className="w-2 h-2 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="flex gap-2">
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask about any crop disease…"
          className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2.5
                     text-white placeholder-white/40 text-sm outline-none
                     focus:border-green-400 focus:ring-1 focus:ring-green-400 transition"
        />
        {/* Voice Button */}
        <button
          id="voice-btn"
          onClick={() => handleVoiceInput(setInput)}
          title="Voice Input"
          className="bg-white/10 hover:bg-white/20 text-white px-3 py-2.5 rounded-full
                     border border-white/20 transition text-base"
        >
          🎤
        </button>
        {/* Send Button */}
        <button
          id="send-btn"
          onClick={sendMessage}
          disabled={!input.trim() || typing}
          className="bg-[#2e7d32] hover:bg-[#388e3c] disabled:opacity-40 disabled:cursor-not-allowed
                     text-white px-5 py-2.5 rounded-full font-semibold text-sm transition"
        >
          Send
        </button>
      </div>
    </div>
  )
}
