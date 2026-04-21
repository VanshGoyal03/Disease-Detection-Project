import { useState, useRef, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Info from './pages/Info'
import Contact from './pages/Contact'

export default function App() {
  // Track active hash section for scroll-spy
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.35 }
    )
    ;['home', 'about', 'info', 'contact'].forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="hero-bg min-h-screen">
      <Navbar activeSection={activeSection} />
      <main>
        <section id="home">  <Home /></section>
        <section id="about"><About /></section>
        <section id="info"> <Info /></section>
        <section id="contact"><Contact /></section>
      </main>
    </div>
  )
}
