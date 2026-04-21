import { useState, useEffect } from 'react'

/* ─── WMO Weather Interpretation Codes → label + emoji ─── */
const WMO_MAP = {
  0:  { label: 'Clear Sky',          emoji: '☀️' },
  1:  { label: 'Mainly Clear',       emoji: '🌤️' },
  2:  { label: 'Partly Cloudy',      emoji: '⛅' },
  3:  { label: 'Overcast',           emoji: '☁️' },
  45: { label: 'Foggy',              emoji: '🌫️' },
  48: { label: 'Icy Fog',            emoji: '🌫️' },
  51: { label: 'Light Drizzle',      emoji: '🌦️' },
  53: { label: 'Moderate Drizzle',   emoji: '🌦️' },
  55: { label: 'Dense Drizzle',      emoji: '🌧️' },
  61: { label: 'Slight Rain',        emoji: '🌧️' },
  63: { label: 'Moderate Rain',      emoji: '🌧️' },
  65: { label: 'Heavy Rain',         emoji: '🌧️' },
  71: { label: 'Slight Snow',        emoji: '🌨️' },
  73: { label: 'Moderate Snow',      emoji: '❄️' },
  75: { label: 'Heavy Snow',         emoji: '❄️' },
  80: { label: 'Slight Showers',     emoji: '🌦️' },
  81: { label: 'Moderate Showers',   emoji: '🌧️' },
  82: { label: 'Violent Showers',    emoji: '⛈️' },
  95: { label: 'Thunderstorm',       emoji: '⛈️' },
  96: { label: 'Thunderstorm + Hail',emoji: '🌩️' },
  99: { label: 'Heavy Thunderstorm', emoji: '🌩️' },
}

/* ─── Derive season from month (India-centric) ─── */
function getSeason(month) {
  if (month >= 3 && month <= 5)  return { name: 'Summer',  emoji: '🌞' }
  if (month >= 6 && month <= 9)  return { name: 'Monsoon', emoji: '🌧️' }
  if (month >= 10 && month <= 11) return { name: 'Autumn', emoji: '🍂' }
  return { name: 'Winter', emoji: '❄️' }
}

/* ─── Disease risk message based on weather ─── */
function getRiskHint(temp, humidity, wmo) {
  const isRainy  = [51,53,55,61,63,65,80,81,82,95,96,99].includes(wmo)
  const isHot    = temp > 32
  const isHumid  = humidity > 75

  if (isRainy && isHumid)
    return { level: 'high',   msg: 'High humidity + rain: Elevated risk of fungal diseases (blight, rust, mildew). Inspect crops urgently.' }
  if (isHumid)
    return { level: 'medium', msg: 'High humidity: Moderate fungal disease risk. Ensure proper airflow and avoid overhead watering.' }
  if (isHot)
    return { level: 'medium', msg: 'High temperature: Watch for bacterial wilt and heat stress. Irrigate early morning.' }
  return { level: 'low',    msg: 'Weather conditions are favorable. Maintain regular inspection routines.' }
}

const RISK_STYLE = {
  high:   { bar: 'bg-red-500',    text: 'text-red-300',    badge: 'bg-red-900/60 text-red-200',    icon: '🔴' },
  medium: { bar: 'bg-yellow-400', text: 'text-yellow-300', badge: 'bg-yellow-900/60 text-yellow-200', icon: '🟡' },
  low:    { bar: 'bg-green-500',  text: 'text-green-300',  badge: 'bg-green-900/60 text-green-200',  icon: '🟢' },
}

/* ─── Stat Pill ─── */
const Pill = ({ label, value, icon }) => (
  <div className="flex flex-col items-center bg-white/5 rounded-xl px-3 py-2 flex-1 min-w-0">
    <span className="text-lg">{icon}</span>
    <span className="text-white font-semibold text-sm leading-tight mt-0.5">{value}</span>
    <span className="text-white/40 text-[10px] uppercase tracking-wide">{label}</span>
  </div>
)

/* ─── Main Export ─── */
export default function WeatherWidget({ onWeatherReady }) {
  const [state, setState] = useState('idle') // idle | loading | success | error | denied
  const [weather, setWeather] = useState(null)
  const [locationName, setLocationName] = useState('')
  const [error, setError] = useState('')

  async function fetchWeather(lat, lon) {
    setState('loading')
    try {
      // Reverse geocode with Open-Meteo's geocoding partner (BigDataCloud – free, no key)
      const geoRes = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      )
      const geoData = await geoRes.json()
      const city    = geoData.city || geoData.locality || geoData.principalSubdivision || 'Your Location'
      setLocationName(city)

      // Open-Meteo — completely free, no API key
      const wRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,` +
        `weather_code,wind_speed_10m,precipitation` +
        `&wind_speed_unit=kmh&timezone=auto`
      )
      const wData = await wRes.json()
      const c = wData.current

      const month   = new Date().getMonth() + 1
      const season  = getSeason(month)
      const wmoInfo = WMO_MAP[c.weather_code] ?? { label: 'Unknown', emoji: '🌡️' }
      const risk    = getRiskHint(c.temperature_2m, c.relative_humidity_2m, c.weather_code)

      const result = {
        temp:        c.temperature_2m,
        feelsLike:   c.apparent_temperature,
        humidity:    c.relative_humidity_2m,
        windSpeed:   c.wind_speed_10m,
        precipitation: c.precipitation,
        wmoCode:     c.weather_code,
        condition:   wmoInfo.label,
        condEmoji:   wmoInfo.emoji,
        season,
        risk,
      }

      setWeather(result)
      setState('success')
      if (onWeatherReady) onWeatherReady({ city, ...result })
    } catch (err) {
      console.error('Weather fetch error:', err)
      setError('Could not load weather data. Check internet connection.')
      setState('error')
    }
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      setState('error')
      return
    }
    setState('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        console.warn('Geolocation denied:', err)
        setState('denied')
        setError('Location access denied. Enable location in browser settings.')
      },
      { timeout: 10000 }
    )
  }

  // Auto-prompt on mount
  useEffect(() => { requestLocation() }, [])

  const risk = weather?.risk
  const rs   = risk ? RISK_STYLE[risk.level] : null

  return (
    <aside className="fade-up" style={{ animationDelay: '0.15s' }}>
      <div className="glass p-5 mb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-poppins text-lg font-bold text-white">
              🌦️ Local <span className="text-[#64b5f6]">Weather</span>
            </h2>
            <p className="text-white/40 text-[11px]">
              {locationName ? `📍 ${locationName}` : 'Disease risk by your climate'}
            </p>
          </div>
          {state === 'success' && (
            <button
              onClick={requestLocation}
              title="Refresh weather"
              className="text-white/30 hover:text-white/70 transition text-base p-1 rounded-full"
            >
              🔄
            </button>
          )}
        </div>

        {/* ── IDLE / LOADING ─────────────────────────── */}
        {(state === 'idle' || state === 'loading') && (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-[#64b5f6]/30 border-t-[#64b5f6] animate-spin" />
            </div>
            <p className="text-white/50 text-xs text-center">
              {state === 'idle' ? 'Requesting location…' : 'Fetching live weather…'}
            </p>
          </div>
        )}

        {/* ── ERROR / DENIED ─────────────────────────── */}
        {(state === 'error' || state === 'denied') && (
          <div className="flex flex-col items-center gap-3 py-2">
            <span className="text-3xl">{state === 'denied' ? '🔒' : '⚠️'}</span>
            <p className="text-white/50 text-xs text-center">{error}</p>
            <button
              onClick={requestLocation}
              className="bg-[#64b5f6]/20 hover:bg-[#64b5f6]/40 text-[#64b5f6] text-xs
                         font-semibold px-4 py-2 rounded-full transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── SUCCESS ────────────────────────────────── */}
        {state === 'success' && weather && (
          <div className="space-y-4">
            {/* Big temp + condition */}
            <div className="flex items-center gap-4">
              <span className="text-5xl leading-none">{weather.condEmoji}</span>
              <div>
                <div className="font-poppins text-4xl font-extrabold text-white leading-none">
                  {Math.round(weather.temp)}°<span className="text-2xl text-white/50">C</span>
                </div>
                <div className="text-white/60 text-xs mt-1">{weather.condition}</div>
                <div className="text-white/40 text-[11px]">
                  Feels like {Math.round(weather.feelsLike)}°C
                </div>
              </div>
              <div className="ml-auto text-right">
                <span className="text-xl">{weather.season.emoji}</span>
                <p className="text-white/50 text-[11px] mt-0.5">{weather.season.name}</p>
              </div>
            </div>

            {/* Stat pills */}
            <div className="flex gap-2">
              <Pill label="Humidity"  value={`${weather.humidity}%`}         icon="💧" />
              <Pill label="Wind"      value={`${Math.round(weather.windSpeed)} km/h`} icon="💨" />
              <Pill label="Rain"      value={`${weather.precipitation} mm`}   icon="🌧️" />
            </div>

            {/* Disease Risk Banner */}
            <div className={`rounded-xl p-3 ${rs.badge}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{rs.icon}</span>
                <span className="font-poppins font-semibold text-xs uppercase tracking-wider">
                  {risk.level} Disease Risk
                </span>
              </div>
              <p className={`text-[11px] leading-relaxed ${rs.text}`}>{risk.msg}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
