import { useState, useRef } from 'react'

/* ─── Stub Handlers ─────────────────────────────────────────────── */

/**
 * TODO: connect to backend — access device camera via getUserMedia
 * Then send captured frame to POST /api/detect
 */
function handleOpenCamera(setPreview, setDetectionResult) {
  console.log('handleOpenCamera() called')
  if (!navigator.mediaDevices?.getUserMedia) {
    alert('⚠️ Camera not supported in this browser.\nTODO: implement camera capture flow.')
    return
  }
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      alert('📷 Camera access granted!\nTODO: display live stream and capture frame, then POST to /api/detect')
      // TODO: display stream in a <video> element, provide capture button
      stream.getTracks().forEach(t => t.stop()) // stop immediately (stub)
    })
    .catch(err => {
      console.error('Camera error:', err)
      alert('❌ Camera access denied. ' + err.message)
    })
}

/**
 * TODO: connect to backend — upload selected image to POST /api/detect
 * Returns { diseaseName, severity, measures[], spreadToHumans }
 */
function handleDetect(file, setDetectionResult, setLoading) {
  console.log('handleDetect() called with file:', file?.name)
  if (!file) { alert('Please select an image first.'); return }
  setLoading(true)

  // Simulate async API call
  setTimeout(() => {
    // TODO: replace with real fetch('/api/detect', { method:'POST', body: FormData })
    setDetectionResult({
      diseaseName:     'Late Blight (Phytophthora infestans)',
      severity:        'High',
      measures: [
        'Remove and destroy infected plant parts immediately.',
        'Apply copper-based fungicide every 7–10 days.',
        'Ensure proper drainage and avoid overhead irrigation.',
        'Rotate crops and use certified disease-free seeds next season.',
      ],
      spreadToHumans: false,
    })
    setLoading(false)
  }, 1800)
}

/* ─── Severity Badge ─────────────────────────────────────────────── */
const SeverityBadge = ({ level }) => {
  const cls = level === 'Low' ? 'badge-low' : level === 'Medium' ? 'badge-medium' : 'badge-high'
  const icon = level === 'Low' ? '🟢' : level === 'Medium' ? '🟠' : '🔴'
  return (
    <span className={`${cls} text-xs font-bold px-3 py-1 rounded-full`}>
      {icon} {level}
    </span>
  )
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function DiseaseDetector() {
  const [preview, setPreview]               = useState(null)
  const [detectionResult, setDetectionResult] = useState(null)
  const [loading, setLoading]               = useState(false)
  const fileInputRef                        = useRef(null)

  /** TODO: connect to backend — handleUploadImage triggers file picker */
  const handleUploadImage = () => {
    console.log('handleUploadImage() called')
    fileInputRef.current?.click()
  }

  const onFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    setDetectionResult(null)
    handleDetect(file, setDetectionResult, setLoading)
  }

  return (
    <div className="glass p-6 md:p-8 fade-up">
      {/* Heading */}
      <h2 className="font-poppins text-2xl md:text-3xl font-bold text-white mb-2">
        🌿 Detect Crop Disease <span className="text-[#f9a825]">Instantly</span>
      </h2>
      <p className="text-white/60 text-sm mb-6 font-inter">
        Upload a photo or use your camera — our AI identifies the disease in seconds.
      </p>

      {/* Upload / Camera Box */}
      <div className="upload-box p-8 flex flex-col items-center justify-center gap-4 mb-6 min-h-[180px]">
        {preview ? (
          <div className="relative w-full">
            <img src={preview} alt="Uploaded crop" className="w-full max-h-64 object-contain rounded-xl" />
            <button
              onClick={() => { setPreview(null); setDetectionResult(null) }}
              className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full hover:bg-black/80 transition"
            >
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

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          id="open-camera-btn"
          onClick={() => handleOpenCamera(setPreview, setDetectionResult)}
          className="flex items-center gap-2 bg-[#2e7d32]/80 hover:bg-[#2e7d32] text-white
                     font-semibold px-5 py-2.5 rounded-full transition text-sm"
        >
          📷 Open Camera
        </button>
        <button
          id="upload-image-btn"
          onClick={handleUploadImage}
          className="flex items-center gap-2 bg-[#f9a825]/90 hover:bg-[#f9a825] text-black
                     font-semibold px-5 py-2.5 rounded-full transition text-sm"
        >
          📁 Upload Image
        </button>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          id="file-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="glass-green p-4 flex items-center gap-3 mb-4">
          <svg className="animate-spin h-5 w-5 text-green-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          <span className="text-green-300 text-sm font-medium">Analyzing your crop image…</span>
        </div>
      )}

      {/* Result Card */}
      {detectionResult && !loading && (
        <div id="detection-result-card" className="glass-green p-6 fade-up space-y-4">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Disease Detected</p>
              <h3 className="font-poppins font-bold text-white text-lg">{detectionResult.diseaseName}</h3>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Severity</p>
                <SeverityBadge level={detectionResult.severity} />
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Spreads to Humans?</p>
                <span className={`text-xs font-bold px-3 py-1 rounded-full
                  ${detectionResult.spreadToHumans ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                  {detectionResult.spreadToHumans ? '⚠️ Yes' : '✅ No'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Preventive Measures</p>
            <ul className="space-y-1.5">
              {detectionResult.measures.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/85">
                  <span className="text-[#a5d6a7] mt-0.5 flex-shrink-0">•</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
