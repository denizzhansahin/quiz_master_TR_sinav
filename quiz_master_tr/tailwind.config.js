/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",      // Dosyaları buraya taşıdıysan bunu ekle
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "tertiary": "#b61722",
        "secondary-container": "#6cf8bb",
        "inverse-on-surface": "#eff0fa",
        "on-error-container": "#93000a",
        "surface": "#f9f9ff",
        "on-tertiary-fixed": "#410004",
        "primary-fixed-dim": "#adc6ff",
        "surface-container": "#ecedf7",
        "surface-container-lowest": "#ffffff",
        "on-tertiary": "#ffffff",
        "primary-container": "#2170e4",
        "surface-dim": "#d8d9e3",
        "tertiary-container": "#da3437",
        "error": "#ba1a1a",
        "surface-container-low": "#f2f3fd",
        "primary": "#0058be",
        "surface-tint": "#005ac2",
        "surface-container-high": "#e6e7f2",
        "secondary-fixed-dim": "#4edea3",
        "surface-bright": "#f9f9ff",
        "surface-variant": "#e1e2ec",
        "on-tertiary-fixed-variant": "#930013",
        "error-container": "#ffdad6",
        "on-surface": "#191b23",
        "on-background": "#191b23",
        "on-secondary-fixed-variant": "#005236",
        "outline": "#727785",
        "tertiary-fixed": "#ffdad7",
        "on-primary-container": "#fefcff",
        "inverse-primary": "#adc6ff",
        "inverse-surface": "#2e3038",
        "primary-fixed": "#d8e2ff",
        "on-error": "#ffffff",
        "secondary-fixed": "#6ffbbe",
        "on-primary-fixed-variant": "#004395",
        "on-surface-variant": "#424754",
        "background": "#f9f9ff",
        "on-secondary-fixed": "#002113",
        "on-primary-fixed": "#001a42",
        "on-secondary-container": "#00714d",
        "secondary": "#006c49",
        "outline-variant": "#c2c6d6",
        "on-tertiary-container": "#fffbff",
        "on-primary": "#ffffff",
        "tertiary-fixed-dim": "#ffb3ad",
        "on-secondary": "#ffffff",
        "surface-container-highest": "#e1e2ec"
      },
      fontFamily: {
        "headline": ["Manrope"],
        "body": ["Inter"],
        "label": ["Inter"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      }
    }
  },
  plugins: [],
}
