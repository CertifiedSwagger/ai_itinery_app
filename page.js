"use client"; // Required because we are using React hooks (useState, useEffect)

import { useState, useEffect } from "react";
import Flag from "react-flagpack"; // Changed from named to default import
import { getCountryCode } from "@/app/utils/countryToFlag"; // Updated import

export default function Home() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [randomCity, setRandomCity] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchRandomCity() {
      const res = await fetch('/api/cities?q=');
      const data = await res.json();
      if (data.length > 0) {
        const random = data[Math.floor(Math.random() * data.length)];
        setRandomCity(random.city_ascii);
      }
    }
    fetchRandomCity();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.length > 0 && document.hasFocus() && document.activeElement?.classList.contains('city-search-input')) {
        const res = await fetch(`/api/cities?q=${input}`);
        const data = await res.json();
        setSuggestions(data);
        setShowDropdown(data.length > 0);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    };

    // Debounce the fetch
    const timerId = setTimeout(() => {
      fetchSuggestions();
    }, 300); // Add timeout value that was missing

    return () => clearTimeout(timerId);
  }, [input]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-200 via-blue-100 to-white p-4">
      <h1 className="text-4xl font-bold mb-8 flex items-center">
        <span role="img" aria-label="luggage" className="mr-2">🧳</span>
        Plan your next trip within seconds
      </h1>

      <div className="flex flex-col items-center space-y-2">
        <label className="text-lg font-medium text-gray-700">
          🌍 Where are you going?
        </label>

        <div className="flex flex-col items-center space-y-2 relative">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (e.target.value.length === 0) {
                  setShowDropdown(false); // Hide dropdown if input is cleared
                }
              }}
              placeholder={isClient && randomCity ? `${randomCity}?` : "Type your destination..."}
              className="w-72 px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 city-search-input"
              onFocus={() => {
                if (input.length > 0 && suggestions.length > 0) {
                  setShowDropdown(true); // Re-show if there are relevant suggestions for current input
                }
              }}
            />
            {/* Fancy glowing button */}
            <div className="relative inline-flex group">
              <div className="absolute transition-all duration-1000 opacity-90 -inset-1 bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-2xl blur-3xl filter group-hover:opacity-100 group-hover:-inset-1.5 group-hover:duration-200"></div>
              <button
                type="button"
                className="relative inline-flex items-center justify-center w-full h-full px-6 py-3 text-lg font-bold text-white transition-all duration-200 bg-gray-900 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-700 rounded-xl"
              >
                Next →
              </button>
            </div>
          </div>

          {/* Autocomplete dropdown */}         
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-md z-10 max-h-60 overflow-y-auto">
              {suggestions.map((city, idx) => {
                const countryCode = getCountryCode(city.country);
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setInput(city.city_ascii);
                      setShowDropdown(false);
                    }}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer flex items-center gap-2"
                  >
                    {countryCode ? (
                      <Flag code={countryCode} className="w-5 h-auto" />
                    ) : (
                      <span>🌍</span> // Fallback emoji if no code found
                    )}
                    <span>{city.city_ascii}</span>
                    <span className="text-gray-400 text-sm ml-auto">{city.country}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}