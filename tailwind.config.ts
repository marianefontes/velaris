import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0e0e10",
        surface: "#0e0e10",
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
      },
      backgroundImage: {
        signature: "linear-gradient(135deg, #deccfd 0%, #c2a0fc 100%)",
        haze: "radial-gradient(circle at top, rgba(222, 204, 253, 0.14), transparent 42%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
