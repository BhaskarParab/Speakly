"use client"

import { useEffect } from "react"

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
      <h1 className="text-2xl font-bold tracking-wide navbar-text">
  <span
    className={`bg-clip-text text-transparent ${
      darkMode
        ? "bg-gradient-to-r  from-white via-violet-200 to-white"
        : "bg-gradient-to-r  from-slate-500 via-slate-500 to-slate-500"
    }`}
  >
    Speakly
  </span>
  </h1>

      {/* Dark Mode Toggle */}
      <button onClick={toggleDarkMode} className="p-2 rounded-full transition-colors duration-300 hover-bg">
        {darkMode ? (
          <span role="img" aria-label="sun">
            ☀️
          </span>
        ) : (
          <span role="img" aria-label="moon">
            🌙
          </span>
        )}
      </button>
    </nav>
  )
}

export default Navbar
