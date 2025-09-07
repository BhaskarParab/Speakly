"use client"

import { useEffect } from "react"
import logo from "./assets/speakly-high-resolution-logo-transparent.png";

function Navbar({ darkMode, toggleDarkMode }) {
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark-theme")
    } else {
      document.documentElement.classList.remove("dark-theme")
    }
  }, [darkMode])

  return (
    <nav className="navbar-theme flex items-center justify-between px-6 py-3 shadow-md transition-colors duration-300">
      {/* Logo / Title */}
      <h1 className="text-2xl font-bold tracking-wide navbar-text flex items-center">
      <img
        src={logo}
        alt="Speakly Logo"
        className="h-8 md:h-10 lg:h-12 object-contain"
      />
    </h1>

      {/* Dark Mode Toggle */}
      <button onClick={toggleDarkMode} className="p-2 rounded-full transition-colors duration-300 hover-bg">
        {darkMode ? (
          <span role="img" aria-label="sun" className="text-2xl">
            ☀️
          </span>
        ) : (
          <span role="img" aria-label="moon" className="text-2xl">
            🌙
          </span>
        )}
      </button>
    </nav>
  )
}

export default Navbar
