import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0e0e10",
        surface: "#0e0e10",
        // Immersive editorial canvas — slightly deeper than background, used in hero/manifesto sections
        "surface-immersive": "#09090d",
        "surface-container-lowest": "#000000",
        "surface-container-low": "#131315",
        "surface-container": "#19191c",
        "surface-container-high": "#1f1f22",
        "surface-container-highest": "#262528",
        "surface-bright": "#2c2c2f",
        "surface-variant": "#262528",
        outline: "#767577",
        "outline-variant": "#48474a",
        primary: "#deccfd",
        "primary-dim": "#d0bfee",
        "primary-container": "#a999c6",
        secondary: "#c2a0fc",
        "secondary-dim": "#b493ed",
        "secondary-container": "#543589",
        tertiary: "#c29fff",
        error: "#ff6e84",
        "error-dim": "#d73357",
        // Caution/tradeoff color — used in pattern borders and decision cards
        warning: "#ffa657",
        "on-surface": "#f9f5f8",
        "on-surface-variant": "#adaaad",
        "on-primary": "#50426a",
        "on-primary-container": "#281c41",
        "on-secondary-container": "#dcc7ff",
        "on-error": "#490013",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        headline: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 64px rgba(179,157,219,0.12)",
        panel: "0 0 40px rgba(222,204,253,0.08)",
        // Cognitive atmosphere tokens
        oracle: "0 0 80px rgba(179,157,219,0.22), 0 0 160px rgba(179,157,219,0.07)",
        "cognitive-sm": "0 0 20px rgba(222,204,253,0.12)",
        "cognitive-md": "0 0 40px rgba(222,204,253,0.16)",
        "cognitive-lg": "0 0 72px rgba(222,204,253,0.20)",
        "chip-active": "0 0 14px rgba(222,204,253,0.28), 0 0 0 0px rgba(222,204,253,0)",
      },
      backgroundImage: {
        signature: "linear-gradient(135deg, #deccfd 0%, #c2a0fc 100%)",
        haze: "radial-gradient(circle at top, rgba(222, 204, 253, 0.14), transparent 42%)",
        // Oracle ambient layer — radial atmospheric glow for identity moments
        "oracle-ambient": "radial-gradient(ellipse at 50% 0%, rgba(222,204,253,0.09) 0%, transparent 65%)",
        // Subtle cognitive depth for section headers
        "cognitive-fade": "linear-gradient(180deg, rgba(222,204,253,0.04) 0%, transparent 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
