/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        space: {
          950: "#04070F",
          900: "#070B14",
          800: "#0D1526",
          700: "#111E35",
          600: "#162440",
          500: "#1D2F52",
        },
        slate: {
          750: "#1E2D45",
        },
        accent: {
          blue: "#2563EB",
          cyan: "#06B6D4",
          amber: "#F59E0B",
          emerald: "#10B981",
          rose: "#F43F5E",
          violet: "#7C3AED",
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px)",
        "glow-blue":
          "radial-gradient(circle at center, rgba(37,99,235,0.15) 0%, transparent 70%)",
        "glow-cyan":
          "radial-gradient(circle at center, rgba(6,182,212,0.12) 0%, transparent 70%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      boxShadow: {
        "glow-blue": "0 0 20px rgba(37,99,235,0.3)",
        "glow-cyan": "0 0 20px rgba(6,182,212,0.25)",
        "glow-amber": "0 0 20px rgba(245,158,11,0.3)",
        card: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        "card-hover":
          "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
        "slide-up": "slideUp 0.4s ease forwards",
        "slide-in-left": "slideInLeft 0.4s ease forwards",
        pulse_slow: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
