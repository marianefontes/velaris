import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          500: "#9aa7b8",
          600: "#8795a8",
          700: "#8290a3",
        },
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
        success: "#7ee787",
        technical: {
          foreground: "#e8e1f5",
          keyword: "#c4a7e7",
          type: "#9ccfd8",
          entity: "#9ccfd8",
          string: "#31748f",
          property: "#e8e1f5",
          number: "#eb6f92",
          command: "#f6c177",
          operator: "#b0a8bc",
          comment: "#6e6a78",
          accent: "#9d7fe6",
        },
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
        // Quiet-luxury elevation: restrained glow, calmer atmosphere.
        glow: "0 0 48px rgba(179,157,219,0.08)",
        panel: "0 0 32px rgba(222,204,253,0.05)",
        // Cognitive atmosphere tokens — softened for a calm, premium feel
        oracle: "0 0 60px rgba(179,157,219,0.14), 0 0 140px rgba(179,157,219,0.045)",
        "cognitive-sm": "0 0 16px rgba(222,204,253,0.08)",
        "cognitive-md": "0 0 30px rgba(222,204,253,0.10)",
        "cognitive-lg": "0 0 56px rgba(222,204,253,0.13)",
        "chip-active": "0 0 12px rgba(222,204,253,0.18)",
        // Soft contact shadow for grounded elevation (cards, bubbles)
        "soft": "0 1px 2px rgba(0,0,0,0.20), 0 8px 24px rgba(0,0,0,0.18)",
      },
      transitionTimingFunction: {
        // Refined ease-out — the single house curve for all UI motion
        luxe: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "message-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "dot-breathe": {
          "0%, 100%": { opacity: "0.25", transform: "translateY(0)" },
          "50%": { opacity: "1", transform: "translateY(-1px)" },
        },
      },
      animation: {
        "message-in": "message-in 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
        "fade-in": "fade-in 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        "fade-up": "fade-up 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
        "dot-breathe": "dot-breathe 1.2s ease-in-out infinite",
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
