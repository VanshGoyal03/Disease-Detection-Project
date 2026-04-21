import { useState } from 'react'
import DiseaseDetector from '../components/DiseaseDetector'
import Chatbot from '../components/Chatbot'
import TipsSidebar from '../components/TipsSidebar'
import WeatherWidget from '../components/WeatherWidget'

export default function Home() {
  const [weather, setWeather] = useState(null)

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

        {/* Two-Column Layout: 65% left / 35% right */}
        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6 items-start">

          {/* ─── LEFT COLUMN ─────────────────────────────────────── */}
          <div className="space-y-6">
            <DiseaseDetector weather={weather} />
            <Chatbot />
          </div>

          {/* ─── RIGHT COLUMN ────────────────────────────────────── */}
          <div className="space-y-4">
            <WeatherWidget onWeatherReady={setWeather} />
            <TipsSidebar weather={weather} />
          </div>
        </div>
      </div>
    </div>
  )
}
