"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

import logo from "./assets/speakly-high-resolution-logo-transparent.png";
// import enUS from "./assets/Gemini_Generated_Image_x3rx1sx3rx1sx3rx.png";
// import enGB from "./assets/Gemini_Generated_Image_x3rx1sx3rx1sx3rx (1).png";
// import esES from "./assets/Spanish Speaker (Spain).png";
// import esUS from "./assets/Spanish Speaker (US).png";
// import frFR from "./assets/French Speaker.png";
// import hiIN from "./assets/Hindi Speaker.png";
// import idID from "./assets/Indonesian Speaker.png";
// import itIT from "./assets/Italian Speaker.png";
// import jaJP from "./assets/Japanese Speaker.png";
// import koKR from "./assets/Korean Speaker.png";
// import nlNL from "./assets/Gemini_Generated_Image_tqy3iwtqy3iwtqy3 (7).png";
// import plPL from "./assets/Gemini_Generated_Image_tqy3iwtqy3iwtqy3 (6).png";
// import ptBR from "./assets/Gemini_Generated_Image_tqy3iwtqy3iwtqy3 (5).png";
// import ruRU from "./assets/Gemini_Generated_Image_tqy3iwtqy3iwtqy3 (4).png";
// import zhCN from "./assets/Mandarin Speaker (Mainland China).png";
// import zhHK from "./assets/Cantonese Speaker (Hong Kong).png";
// import zhTW from "./assets/Gemini_Generated_Image_tqy3iwtqy3iwtqy3 (1).png";
// import deDE from "./assets/German Speaker.png";

// const voiceImages = {
//   "en-US": enUS,
//   "en-GB": enGB,
//   "es-ES": esES,
//   "es-US": esUS,
//   "fr-FR": frFR,
//   "hi-IN": hiIN,
//   "id-ID": idID,
//   "it-IT": itIT,
//   "ja-JP": jaJP,
//   "ko-KR": koKR,
//   "nl-NL": nlNL,
//   "pl-PL": plPL,
//   "pt-BR": ptBR,
//   "ru-RU": ruRU,
//   "zh-CN": zhCN,
//   "zh-HK": zhHK,
//   "zh-TW": zhTW,
//   "de-DE": deDE,
// };

function Home({ darkMode, toggleDarkMode }) {
  const [voices, setVoices] = useState([]);
  const [filteredVoices, setFilteredVoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [playingVoice, setPlayingVoice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices() || [];
      console.log(availableVoices); // for debugging exact voice names and langs
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  useEffect(() => {
    let filtered = voices;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((voice) => {
        const [langCode, countryCode] = voice.lang.split("-");
        const language = languageMap[langCode] || langCode;
        const country = countryMap[countryCode] || countryCode;
        const displayName = `${language} – ${country}`;
        return (
          displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          voice.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((voice) => {
        const [langCode] = voice.lang.split("-");
        switch (selectedCategory) {
          case "english":
            return langCode === "en";
          case "european":
            return ["es", "fr", "de", "it", "nl", "pl", "ru"].includes(
              langCode
            );
          case "asian":
            return ["hi", "ja", "ko", "zh", "id"].includes(langCode);
          case "americas":
            return (
              (["pt", "es"].includes(langCode) && voice.lang.includes("US")) ||
              voice.lang.includes("BR")
            );
          default:
            return true;
        }
      });
    }

    setFilteredVoices(filtered);
  }, [voices, searchTerm, selectedCategory]);

  const handleSelectVoice = (voice) => {
    navigate("/tts", { state: { selectedVoiceName: voice.name } });
  };

  const handleVoicePreview = (voice, e) => {
    e.stopPropagation();

    if (playingVoice === voice.name) {
      window.speechSynthesis.cancel();
      setPlayingVoice(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      "Hello, this is a preview of my voice. How do I sound?"
    );
    utterance.voice = voice;
    utterance.rate = 1;
    utterance.onstart = () => setPlayingVoice(voice.name);
    utterance.onend = () => setPlayingVoice(null);
    utterance.onerror = () => setPlayingVoice(null);

    window.speechSynthesis.speak(utterance);
  };

  // Map language codes to human-friendly names
  const languageMap = {
    en: "English",
    es: "Spanish",
    fr: "French",
    hi: "Hindi",
    id: "Indonesian",
    it: "Italian",
    ja: "Japanese",
    ko: "Korean",
    nl: "Dutch",
    pl: "Polish",
    pt: "Portuguese",
    ru: "Russian",
    zh: "Chinese",
    de: "German",
  };

  // Map country codes to full names
  const countryMap = {
    US: "United States",
    GB: "United Kingdom",
    ES: "Spain",
    FR: "France",
    IN: "India",
    ID: "Indonesia",
    IT: "Italy",
    JP: "Japan",
    KR: "Korea",
    NL: "Netherlands",
    PL: "Poland",
    BR: "Brazil",
    RU: "Russia",
    CN: "China",
    HK: "Hong Kong",
    TW: "Taiwan",
    DE: "Germany",
  };

  // Map language codes to images
  // const voiceImages = {
  //   "en-US": "src/assets/Gemini_Generated_Image_x3rx1sx3rx1sx3rx.png",
  //   "en-GB": "src/assets/Gemini_Generated_Image_x3rx1sx3rx1sx3rx (1).png",
  //   "es-ES": "src/assets/Spanish Speaker (Spain).png",
  //   "es-US": "src/assets/Spanish Speaker (US).png",
  //   "fr-FR": "src/assets/French Speaker.png",
  //   "hi-IN": "src/assets/Hindi Speaker.png",
  //   "id-ID": "src/assets/Indonesian Speaker.png",
  //   "it-IT": "src/assets/Italian Speaker.png",
  //   "ja-JP": "src/assets/Japanese Speaker.png",
  //   "ko-KR": "src/assets/Korean Speaker.png",
  //   "nl-NL": "src/assets/Gemini_Generated_Image_tqy3iwtqy3iwtqy3 (7).png",
  //   "pl-PL": "src/assets/Gemini_Generated_Image_tqy3iwtqy3iwtqy3 (6).png",
  //   "pt-BR": "src/assets/Gemini_Generated_Image_tqy3iwtqy3iwtqy3 (5).png",
  //   "ru-RU": "src/assets/Gemini_Generated_Image_tqy3iwtqy3iwtqy3 (4).png",
  //   "zh-CN": "src/assets/Mandarin Speaker (Mainland China).png",
  //   "zh-HK": "src/assets/Cantonese Speaker (Hong Kong).png",
  //   "zh-TW": "src/assets/Gemini_Generated_Image_tqy3iwtqy3iwtqy3 (1).png",
  //   "de-DE": "src/assets/German Speaker.png",
  // };

  // Separate image for 4th English male voice
  // const maleEnglishImage =
  //   "src/assets/Gemini_Generated_Image_x3rx1sx3rx1sx3rx (2).png";

  const categories = [
    { id: "all", name: "All Voices", icon: "🌍" },
    { id: "english", name: "English", icon: "🇺🇸" },
    { id: "european", name: "European", icon: "🇫🇷" },
    { id: "asian", name: "Asian", icon: "🌏" },
    { id: "americas", name: "Americas", icon: "🌎" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Content Creator",
      text: "Speakly has revolutionized how I create audio content. The voice quality is incredible!",
      rating: 5,
    },
    {
      name: "Miguel Rodriguez",
      role: "Language Teacher",
      text: "Perfect for helping my students with pronunciation. The variety of accents is amazing.",
      rating: 5,
    },
    {
      name: "Aisha Patel",
      role: "Student",
      text: "This tool is great for listening to my favorite novels in my free time. Thank you!",
      rating: 4,
    },
  ];

  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div
        className={`theme-bg relative min-h-screen overflow-hidden ${
          darkMode ? "dark-theme" : ""
        }`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center p-6 min-h-screen">
          <div className="text-center mb-16 max-w-4xl">
            <h1 className="text-6xl font-extrabold mb-4 flex justify-center">
      <img
        src={logo}
        alt="Speakly Logo"
        className="h-16 md:h-20 lg:h-24 object-contain"
      />
    </h1>
            <p className="text-2xl theme-text-secondary font-light mb-8">
              Transform text into natural speech with unlimited characters
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="theme-bg-card backdrop-blur-sm rounded-full px-6 py-3 border theme-border-primary">
                <span className="theme-text-primary font-medium">
                   19+ AI Voices
                </span>
              </div>
              <div className="theme-bg-card backdrop-blur-sm rounded-full px-6 py-3 border theme-border-primary">
                <span className="theme-text-primary font-medium">
                   Multiple Languages
                </span>
              </div>
              <div className="theme-bg-card backdrop-blur-sm rounded-full px-6 py-3 border theme-border-primary">
                <span className="theme-text-primary font-medium">
                   Emotional Voices
                </span>
              </div>
              <div className="theme-bg-card backdrop-blur-sm rounded-full px-6 py-3 border theme-border-primary">
                <span className="theme-text-primary font-medium">
                   Instant Preview
                </span>
              </div>
            </div>

            <div className="theme-bg-card backdrop-blur-md rounded-2xl p-8 theme-border-primary">
              <h2 className="text-3xl font-bold mb-4 theme-text-primary">
                Why Choose Speakly?
              </h2>
              <p className="theme-text-primary text-lg leading-relaxed">
                Speakly is a free Text-to-Speech platform with{" "}
                <span className="font-semibold text-primary">
                  unlimited characters
                </span>
                . It supports multiple{" "}
                <span className="font-semibold text-secondary">
                  languages, accents, and voices
                </span>
                , letting you convert text into natural speech instantly.
                Whether you're learning a new language, practicing
                pronunciation, or coverting your favorite novels to audio, Speakly gives you{" "}
                <span className="font-semibold text-accent">full control</span>{" "}
                — at no cost.
              </p>
            </div>
          </div>

          <div className="w-full max-w-6xl mb-8 justify-items-center">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 theme-bg-primary border-2 theme-border-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary theme-text-primary placeholder-opacity-60"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 theme-text-primary">
                  🔍︎
                </div>
              </div>
            </div>

            {/* Category Tabs */}
<div className="flex flex-wrap justify-center gap-2 mb-8 mt-10">
  {categories.map((category) => {
    const isSelected = selectedCategory === category.id

    return (
      <button
      type="button"
        tabIndex={-1}
        key={category.id}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setSelectedCategory(category.id)}
        style={{
          backgroundColor: isSelected
            ? darkMode
              ? "#d1d5db" // blue-600 for dark selected
              : "#1f2937" // blue-500 for light selected
            : darkMode
              ? "#1f2937" // gray-800 card background for dark unselected
              : "#ffffff", // white card background for light unselected
          color: isSelected
      ? darkMode
        ? "#111827" // dark text in dark mode when selected
        : "#ffffff" // white text in light mode when selected
            : darkMode
              ? "#d1d5db" // gray-300 text in dark
              : "#111827", // gray-900 text in light
          border: isSelected ? "none" : `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`, // border for unselected
        }}
        className="px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md"
      >
        <span className="mr-2">{category.icon}</span>
        {category.name}
      </button>
    )
  })}
</div>
</div>
<p className="text-center theme-text-primary text-2xl mb-10">Select voice</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mb-16">
            {filteredVoices.map((voice, index) => {
              const [langCode, countryCode] = voice.lang.split("-");
              const language = languageMap[langCode] || langCode;
              const country = countryMap[countryCode] || countryCode;
              const displayName = `${language} – ${country}`;

              let imageUrl = `/voices/${voice.lang}.png`;
              if (voice.name === "Google UK English Male") {
  imageUrl = "/voices/en-GB-male.png";
}


              return (
                <div
                  key={index}
                  className="theme-bg-card backdrop-blur-lg rounded-3xl border-2 theme-border-secondary shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-105 group relative overflow-hidden"
                  onClick={() => handleSelectVoice(voice)}
                >
                  {/* Gradient border effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                  <div className="p-8 flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                      <img
                        src={imageUrl || "/placeholder.svg"}
                        alt={displayName}
                        className="relative w-32 h-32 object-cover rounded-full border-2 theme-border-primary group-hover:border-primary/50 transition-all duration-500"
                      />
                    </div>

                    <h2 className="text-xl font-semibold theme-text-primary mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text transition-all duration-500">
                      {displayName}
                    </h2>

                    <button
                      onClick={(e) => handleVoicePreview(voice, e)}
                      style={{
                        color: darkMode ? "#ffffff" : "#000000",
                        WebkitTextFillColor: darkMode ? "#ffffff" : "#000000", // Safari fallback
                      }}
                      className={`mb-4 px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                        playingVoice === voice.name
                          ? "bg-destructive"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                    >
                      {playingVoice === voice.name ? "⏹ Stop" : "▶ Preview"}
                    </button>

                    {/* <p className="text-sm theme-text-secondary">{voice.name}</p> */}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full max-w-6xl mb-16">
            <h2 className="text-4xl font-bold text-center mb-12 theme-text-primary">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="theme-bg-card backdrop-blur-md rounded-2xl p-6 border theme-border-primary shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">
                        ⭐
                      </span>
                    ))}
                  </div>
                  <p className="theme-text-primary mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-semibold theme-text-primary">
                      {testimonial.name}
                    </p>
                    <p className="text-sm theme-text-secondary">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-4xl">
            <div className="theme-bg-card backdrop-blur-md rounded-2xl p-8 border theme-border-primary shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold theme-text-primary mb-2">
                    19+
                  </div>
                  <div className="theme-text-primary">AI Voices</div>
                </div>
                <div>
                  <div className="text-4xl font-bold theme-text-primary mb-2">
                    14+
                  </div>
                  <div className="theme-text-primary">Languages</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-accent theme-text-primary mb-2">∞</div>
                  <div className="theme-text-primary">Characters</div>
                </div>
              </div>
            </div>
          </div>
        </div>
                <p className="theme-text-primary text-center text-sm mt-5">This tts works predominantly in google browser</p>
      </div>
    </>
  );
}

export default Home;
