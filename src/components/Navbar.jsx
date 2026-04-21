import { useState } from 'react'
import Modal from './Modal'
import FormInput from './FormInput'

/* ─── Leaf SVG Logo ─────────────────────────────────────────────── */
const LeafIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6 28C6 28 8 16 20 10C28 6 28 6 28 6C28 6 26 18 14 24C10 26 6 28 6 28Z"
      fill="#a5d6a7" stroke="#2e7d32" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M6 28C6 28 12 20 18 16" stroke="#2e7d32" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

/* ─── Stub Handlers ─────────────────────────────────────────────── */
/**
 * TODO: connect to backend — POST /api/auth/login
 */
function handleLogin(credentials) {
  console.log('handleLogin() called with:', credentials)
  alert(`🔐 Login stub fired!\nEmail: ${credentials.email}\n\nTODO: connect to /api/auth/login`)
}

/**
 * TODO: connect to backend — POST /api/auth/signup
 */
function handleSignUp(data) {
  console.log('handleSignUp() called with:', data)
  alert(`📝 Sign-Up stub fired!\nName: ${data.name}\nEmail: ${data.email}\n\nTODO: connect to /api/auth/signup`)
}

/**
 * TODO: connect to backend — PATCH /api/auth/change-password
 */
function handleChangePassword(data) {
  console.log('handleChangePassword() called with:', data)
  alert('🔑 Change Password stub fired!\nTODO: connect to /api/auth/change-password')
}

/**
 * TODO: connect to backend — PATCH /api/auth/change-username
 */
function handleChangeUsername(data) {
  console.log('handleChangeUsername() called with:', data)
  alert(`👤 Change Username stub fired!\nNew: ${data.newUsername}\n\nTODO: connect to /api/auth/change-username`)
}

/* ─── Navbar Component ──────────────────────────────────────────── */
export default function Navbar({ activeSection }) {
  /* modal visibility states */
  const [modal, setModal] = useState(null) // 'login'|'signup'|'changePwd'|'changeUser'

  /* mobile menu */
  const [mobileOpen, setMobileOpen] = useState(false)

  /* settings dropdown */
  const [settingsOpen, setSettingsOpen] = useState(false)

  /* ── Login form state ── */
  const [loginEmail, setLoginEmail]       = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  /* ── Sign-Up form state ── */
  const [signupName, setSignupName]               = useState('')
  const [signupEmail, setSignupEmail]             = useState('')
  const [signupPassword, setSignupPassword]       = useState('')
  const [signupConfirm, setSignupConfirm]         = useState('')

  /* ── Change Password form state ── */
  const [oldPwd, setOldPwd]         = useState('')
  const [newPwd, setNewPwd]         = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')

  /* ── Change Username form state ── */
  const [currentUser, setCurrentUser] = useState('')
  const [newUser, setNewUser]         = useState('')

  const closeModal = () => setModal(null)
  const openModal  = (name) => { setModal(name); setMobileOpen(false); setSettingsOpen(false) }

  const navLinks = [
    { label: 'About',      href: '#about'   },
    { label: 'Info',       href: '#info'    },
    { label: 'Contact Us', href: '#contact' },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
           style={{ borderRadius: 0, backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Brand ─────────────────────────────────────────── */}
            <a href="#home" className="flex items-center gap-2 group">
              <LeafIcon />
              <span className="font-poppins font-bold text-xl text-white group-hover:text-green-300 transition-colors">
                Kisaan Bandhu
              </span>
            </a>

            {/* ── Desktop Links ─────────────────────────────────── */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(l => (
                <a key={l.label} href={l.href} className="navbar-link text-sm">{l.label}</a>
              ))}

              {/* Settings Dropdown */}
              <div className="relative">
                <button
                  id="settings-btn"
                  onClick={() => setSettingsOpen(o => !o)}
                  className="navbar-link text-sm flex items-center gap-1"
                >
                  ⚙ Settings
                  <span className="text-xs">{settingsOpen ? '▲' : '▾'}</span>
                </button>
                {settingsOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass rounded-xl overflow-hidden shadow-lg py-1 z-50">
                    <button
                      id="change-pwd-btn"
                      onClick={() => openModal('changePwd')}
                      className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/10 transition"
                    >
                      🔑 Change Password
                    </button>
                    <button
                      id="change-user-btn"
                      onClick={() => openModal('changeUser')}
                      className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/10 transition"
                    >
                      👤 Change Username
                    </button>
                  </div>
                )}
              </div>

              {/* Sign In Button */}
              <button
                id="signin-btn"
                onClick={() => openModal('login')}
                className="ml-2 bg-[#2e7d32] hover:bg-[#388e3c] text-white text-sm font-semibold
                           px-5 py-2 rounded-full transition-all duration-200 pulse-btn"
              >
                Sign In / Login
              </button>
            </div>

            {/* ── Mobile Hamburger ──────────────────────────────── */}
            <button
              id="hamburger-btn"
              className="md:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle mobile menu"
            >
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>

          {/* ── Mobile Menu ───────────────────────────────────────── */}
          {mobileOpen && (
            <div className="md:hidden pb-4 space-y-2 fade-up">
              {navLinks.map(l => (
                <a key={l.label} href={l.href}
                   onClick={() => setMobileOpen(false)}
                   className="block px-3 py-2 text-white/80 hover:text-yellow-400 transition text-sm">
                  {l.label}
                </a>
              ))}
              <button onClick={() => openModal('changePwd')}
                className="block w-full text-left px-3 py-2 text-white/80 hover:text-yellow-400 transition text-sm">
                ⚙ Change Password
              </button>
              <button onClick={() => openModal('changeUser')}
                className="block w-full text-left px-3 py-2 text-white/80 hover:text-yellow-400 transition text-sm">
                ⚙ Change Username
              </button>
              <button onClick={() => openModal('login')}
                className="w-full mt-2 bg-[#2e7d32] text-white text-sm font-semibold
                           px-5 py-2 rounded-full transition">
                Sign In / Login
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════════
          MODAL: Login
      ════════════════════════════════════════════════════════════ */}
      <Modal isOpen={modal === 'login'} onClose={closeModal} title="🌿 Sign In to Kisaan Bandhu">
        <FormInput id="login-email" label="Email" type="email"
          value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="you@example.com" />
        <FormInput id="login-password" label="Password" type="password"
          value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••••" />
        <button
          id="login-submit-btn"
          onClick={() => { handleLogin({ email: loginEmail, password: loginPassword }); closeModal() }}
          className="w-full bg-[#2e7d32] hover:bg-[#388e3c] text-white font-semibold py-2.5 rounded-lg transition mt-2"
        >
          Login
        </button>
        <p className="text-center text-sm text-white/60 mt-4">
          Don't have an account?{' '}
          <button onClick={() => setModal('signup')}
            className="text-[#a5d6a7] hover:text-white underline transition">
            Sign Up
          </button>
        </p>
      </Modal>

      {/* ════════════════════════════════════════════════════════════
          MODAL: Sign Up
      ════════════════════════════════════════════════════════════ */}
      <Modal isOpen={modal === 'signup'} onClose={closeModal} title="🌱 Create Your Account">
        <FormInput id="signup-name" label="Full Name"
          value={signupName} onChange={e => setSignupName(e.target.value)} placeholder="Ramesh Kumar" />
        <FormInput id="signup-email" label="Email" type="email"
          value={signupEmail} onChange={e => setSignupEmail(e.target.value)} placeholder="you@example.com" />
        <FormInput id="signup-password" label="Password" type="password"
          value={signupPassword} onChange={e => setSignupPassword(e.target.value)} placeholder="••••••••" />
        <FormInput id="signup-confirm" label="Confirm Password" type="password"
          value={signupConfirm} onChange={e => setSignupConfirm(e.target.value)} placeholder="••••••••" />
        <button
          id="signup-submit-btn"
          onClick={() => { handleSignUp({ name: signupName, email: signupEmail, password: signupPassword }); closeModal() }}
          className="w-full bg-[#f9a825] hover:bg-yellow-500 text-black font-semibold py-2.5 rounded-lg transition mt-2"
        >
          Create Account
        </button>
        <p className="text-center text-sm text-white/60 mt-4">
          Already have an account?{' '}
          <button onClick={() => setModal('login')}
            className="text-[#a5d6a7] hover:text-white underline transition">
            Sign In
          </button>
        </p>
      </Modal>

      {/* ════════════════════════════════════════════════════════════
          MODAL: Change Password
      ════════════════════════════════════════════════════════════ */}
      <Modal isOpen={modal === 'changePwd'} onClose={closeModal} title="🔑 Change Password">
        <FormInput id="old-pwd" label="Current Password" type="password"
          value={oldPwd} onChange={e => setOldPwd(e.target.value)} placeholder="••••••••" />
        <FormInput id="new-pwd" label="New Password" type="password"
          value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="••••••••" />
        <FormInput id="confirm-pwd" label="Confirm New Password" type="password"
          value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="••••••••" />
        <button
          id="change-pwd-submit-btn"
          onClick={() => { handleChangePassword({ oldPwd, newPwd, confirmPwd }); closeModal() }}
          className="w-full bg-[#2e7d32] hover:bg-[#388e3c] text-white font-semibold py-2.5 rounded-lg transition mt-2"
        >
          Update Password
        </button>
      </Modal>

      {/* ════════════════════════════════════════════════════════════
          MODAL: Change Username
      ════════════════════════════════════════════════════════════ */}
      <Modal isOpen={modal === 'changeUser'} onClose={closeModal} title="👤 Change Username">
        <FormInput id="current-username" label="Current Username"
          value={currentUser} onChange={e => setCurrentUser(e.target.value)} placeholder="current_user" />
        <FormInput id="new-username" label="New Username"
          value={newUser} onChange={e => setNewUser(e.target.value)} placeholder="new_username" />
        <button
          id="change-user-submit-btn"
          onClick={() => { handleChangeUsername({ currentUser, newUsername: newUser }); closeModal() }}
          className="w-full bg-[#2e7d32] hover:bg-[#388e3c] text-white font-semibold py-2.5 rounded-lg transition mt-2"
        >
          Update Username
        </button>
      </Modal>
    </>
  )
}
