"use client"

import { useState, useRef, useEffect } from "react"
import { useLocation } from "react-router-dom"
import Navbar from "./Navbar"
import "../src/DarkTheme.css"

function TextToSpeech({ darkMode, toggleDarkMode }) {
  const location = useLocation()
  const selectedVoiceName = location.state?.selectedVoiceName || ""

  const [text, setText] = useState("")
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState("")
  const [rate, setRate] = useState(1)

  const [isPaused, setIsPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const chunksRef = useRef([])
  const currentIndexRef = useRef(0)
  const charIndexRef = useRef(0)
  const currentUtteranceRef = useRef(null)

  const languageMap = {
  "español": "Spanish",
  "español de Estados Unidos": "Spanish (US)",
  "français": "French",
  "Deutsch": "German",
  "हिन्दी": "Hindi",
  "Bahasa Indonesia": "Indonesian",
  "italiano": "Italian",
  "日本語": "Japanese",
  "한국의": "Korean",
  "Nederlands": "Dutch",
  "polski": "Polish",
  "português do Brasil": "Portuguese (Brazil)",
  "русский": "Russian",
  "普通话（中国大陆）": "Mandarin (China)",
  "粤語（香港）": "Cantonese (Hong Kong)",
  "國語（臺灣）": "Mandarin (Taiwan)",
  "US English": "English (US)",
  "UK English": "English (UK)",
  "UK English Female": "English (UK) – Female",
  "UK English Male": "English (UK) – Male"
};

  const displayName = selectedVoiceName
    ? languageMap[selectedVoiceName.replace(/^Google\s*/i, "")] || selectedVoiceName
    : "Default"

  const playChunk = (index, startChar = 0) => {
    const chunks = chunksRef.current
    if (!chunks || index >= chunks.length) {
      setIsPlaying(false)
      currentIndexRef.current = 0
      charIndexRef.current = 0
      return
    }

    currentIndexRef.current = index
    charIndexRef.current = startChar

    const chunk = chunks[index].substring(startChar)
    const utterance = new SpeechSynthesisUtterance(chunk)
    currentUtteranceRef.current = utterance

    const voice = voices.find((v) => v.name === selectedVoice)
    if (voice) utterance.voice = voice
    utterance.rate = rate

    utterance.onboundary = (event) => {
      if (event.charIndex != null) {
        charIndexRef.current = startChar + event.charIndex
      }
    }

    utterance.onend = () => {
      playChunk(index + 1, 0)
    }

    utterance.onerror = () => {
      playChunk(index + 1, 0)
    }

    window.speechSynthesis.speak(utterance)
    setIsPlaying(true)
  }

  const handleSpeak = () => {
    if (!text.trim()) return
    window.speechSynthesis.cancel()
    currentUtteranceRef.current = null
    chunksRef.current = text.match(/.{1,200}(\s|$)/g) || [text]
    currentIndexRef.current = 0
    charIndexRef.current = 0
    setIsPaused(false)
    setTimeout(() => playChunk(0, 0), 10)
  }

  const handleStop = () => {
    window.speechSynthesis.cancel()
    currentUtteranceRef.current = null
    chunksRef.current = []
    currentIndexRef.current = 0
    charIndexRef.current = 0
    setIsPlaying(false)
    setIsPaused(false)
  }

  const handlePause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause()
      setIsPaused(true)
    }
  }

  const handleRateChange = (newRate) => {
    setRate(newRate)
    if (window.speechSynthesis.speaking) {
      const resumeIndex = currentIndexRef.current
      const resumeChar = charIndexRef.current
      window.speechSynthesis.cancel()
      setTimeout(() => playChunk(resumeIndex, resumeChar), 10)
    }
  }

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
      currentUtteranceRef.current = null
      chunksRef.current = []
      currentIndexRef.current = 0
      charIndexRef.current = 0
      setIsPlaying(false)
      setIsPaused(false)
    }
  }, [])

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices() || []
      setVoices(availableVoices)

      if (selectedVoiceName) {
        const matched = availableVoices.find((v) => v.name === selectedVoiceName)
        if (matched) {
          setSelectedVoice(matched.name)
          return
        }
      }

      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name)
      }
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [selectedVoiceName])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark-theme")
    } else {
      document.documentElement.classList.remove("dark-theme")
    }
  }, [darkMode])

  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="min-h-screen theme-gradient-bg transition-all duration-700">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10">
          <div className="container mx-auto px-6 pt-20 pb-12">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 theme-bg-card backdrop-blur-xl theme-border-primary border rounded-full shadow-2xl">
                <div className="relative">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-ping"></div>
                </div>
                <span className="text-sm font-semibold theme-text-secondary tracking-wide">
                  Neural Voice Synthesis • Live
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 theme-text-primary bg-clip-text text-transparent">
                    Speakly
                  </span>
                </h1>

                <div className="max-w-4xl mx-auto space-y-4">
                  <p className="text-2xl md:text-3xl theme-text-secondary font-light leading-relaxed">
                    Transform your words into{" "}
                    <span className="font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                      lifelike speech
                    </span>
                  </p>
                  <p className="text-lg theme-text-tertiary">
                    Professional-grade text-to-speech with unlimited characters and natural voices
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="theme-bg-card backdrop-blur-2xl theme-border-primary border rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8 md:p-12 border-b theme-border-secondary">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur opacity-30 animate-pulse"></div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold theme-text-primary">Compose Your Message</h2>
                      <p className="theme-text-secondary mt-1">Write or paste any text to bring it to life</p>
                    </div>
                  </div>

                  <div className="relative group">
                    <textarea
                      rows={16}
                      className="w-full p-8 theme-bg-input theme-border-secondary border-2 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 resize-none theme-text-primary placeholder:text-slate-400 text-lg leading-relaxed font-medium"
                      placeholder="Enter your text here and experience the magic of natural speech synthesis. Whether it's a story, article, or any content - we'll make it sound amazing..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                    <div className="absolute bottom-6 right-6 flex items-center gap-3">
                      <div className="px-3 py-1 theme-bg-secondary rounded-full">
                        <span className="text-sm font-semibold theme-text-secondary">
                          {text.length.toLocaleString()} chars
                        </span>
                      </div>
                      {text.length > 0 && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-12 theme-bg-tertiary">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold theme-text-primary">Voice Profile</h3>
                        <p className="theme-text-secondary">Currently selected voice</p>
                      </div>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 theme-border-secondary border-2 rounded-2xl p-6">
                      <div className="relative z-10 flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-emerald-700 mb-1 uppercase tracking-wide">
                            Active Voice Engine
                          </p>
                          <p className="font-black text-emerald-800 text-xl">{displayName}</p>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-xl"></div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold theme-text-primary">Speech Rate</h3>
                        <p className="theme-text-secondary">Adjust playback speed</p>
                      </div>
                    </div>

                    <div className="relative">
                      <select
                        className="w-full p-6 theme-bg-input theme-border-secondary border-2 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 theme-text-primary font-bold text-lg appearance-none cursor-pointer"
                        value={rate}
                        onChange={(e) => handleRateChange(Number(e.target.value))}
                      >
                        <option value="0.5">🐌 0.5x - Ultra Slow</option>
                        <option value="0.75">🚶 0.75x - Relaxed Pace</option>
                        <option value="1">🎯 1x - Natural Flow</option>
                        <option value="1.25">🏃 1.25x - Energetic</option>
                        <option value="1.5">⚡ 1.5x - Quick Pace</option>
                        <option value="2">🚀 2x - Lightning Fast</option>
                      </select>
                      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-5 h-5 theme-text-tertiary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-12 theme-bg-secondary theme-border-secondary border-t">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold theme-text-primary mb-2">Voice Control Center</h3>
                  <p className="text-lg theme-text-secondary">Master your audio experience</p>
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    className="group relative px-12 py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white rounded-2xl font-black text-xl transition-all duration-500 hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg min-w-[160px] overflow-hidden"
                    onClick={handleSpeak}
                    disabled={isPlaying && !isPaused}
                  >
                    <span className="relative z-10 flex items-center gap-4">
                      {isPlaying && !isPaused ? (
                        <>
                          <div className="flex gap-1">
                            <div className="w-1 h-4 bg-white rounded-full animate-pulse"></div>
                            <div className="w-1 h-4 bg-white rounded-full animate-pulse delay-100"></div>
                            <div className="w-1 h-4 bg-white rounded-full animate-pulse delay-200"></div>
                          </div>
                          Speaking...
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          Generate Speech
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  </button>

                  <button
                    className="px-12 py-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-2xl font-black text-xl transition-all duration-500 hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg min-w-[160px]"
                    onClick={handlePause}
                    disabled={!isPlaying || isPaused}
                  >
                    <span className="flex items-center gap-4">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 6h12v12H6z" />
                      </svg>
                      Pause
                    </span>
                  </button>

                  <button
                    className="px-12 py-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-black text-xl transition-all duration-500 hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg min-w-[160px]"
                    onClick={handleSpeak}
                    disabled={!isPaused}
                  >
                    <span className="flex items-center gap-4">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Resume
                    </span>
                  </button>

                  <button
                    className="px-12 py-6 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-2xl font-black text-xl transition-all duration-500 hover:shadow-2xl hover:scale-105 min-w-[160px]"
                    onClick={handleStop}
                  >
                    <span className="flex items-center gap-4">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 6h12v12H6z" />
                      </svg>
                      Stop
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TextToSpeech
