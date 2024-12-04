/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  daisyui: {
    themes: [
      // Original Scaffold-ETH 2 themes (required structure)
      {
        light: {
          primary: "#93BBFB",
          "primary-content": "#212638",
          secondary: "#DAE8FF",
          "secondary-content": "#212638",
          accent: "#93BBFB",
          "accent-content": "#212638",
          neutral: "#212638",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f4f8ff",
          "base-300": "#DAE8FF",
          "base-content": "#212638",
          info: "#93BBFB",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",
          "--rounded-btn": "9999rem",
          ".tooltip": { "--tooltip-tail": "6px" },
          ".link": { textUnderlineOffset: "2px" },
          ".link:hover": { opacity: "80%" },
        },
      },
      {
        dark: {
          primary: "#212638",
          "primary-content": "#F9FBFF",
          secondary: "#323f61",
          "secondary-content": "#F9FBFF",
          accent: "#4969A6",
          "accent-content": "#F9FBFF",
          neutral: "#F9FBFF",
          "neutral-content": "#385183",
          "base-100": "#385183",
          "base-200": "#2A3655",
          "base-300": "#212638",
          "base-content": "#F9FBFF",
          info: "#385183",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",
          "--rounded-btn": "9999rem",
          ".tooltip": { "--tooltip-tail": "6px", "--tooltip-color": "oklch(var(--p))" },
          ".link": { textUnderlineOffset: "2px" },
          ".link:hover": { opacity: "80%" },
        },
      },
      // Our custom theme
      {
        zkonnect: {
          // Base colors
          "primary": "#E81A0B",          // Bright red
          "primary-focus": "#C41508",    // Dark red
          "primary-content": "#F3EDE2",  // Cream
          
          "secondary": "#1DACA9",        // Bright green
          "secondary-focus": "#379593",  // Dark green
          "secondary-content": "#F3EDE2", // Cream
          
          "accent": "#5448C8",           // Purple
          "accent-focus": "#4339A0",     // Dark purple
          "accent-content": "#F3EDE2",   // Cream
          
          "neutral": "#201E1F",          // Dark brown
          "neutral-focus": "#2A2728",    // Light brown
          "neutral-content": "#F3EDE2",  // Cream
          
          // Backgrounds
          "base-100": "#F3EDE2",         // Cream
          "base-200": "#E9E3D8",         // Dark cream
          "base-300": "#DFD9CE",         // Darker cream
          "base-content": "#201E1F",     // Dark brown
          
          // Status colors
          "info": "#1DACA9",             // Bright green
          "info-content": "#F3EDE2",     // Cream
          "success": "#1DACA9",          // Bright green
          "success-content": "#F3EDE2",  // Cream
          "warning": "#FF8863",          // Orange
          "warning-content": "#201E1F",  // Dark brown
          "error": "#E81A0B",            // Bright red
          "error-content": "#F3EDE2",    // Cream

          // Variations
          "--color-purple-light": "#6B60D4",
          "--color-purple-dark": "#4339A0",
          "--color-red-light": "#FF2213",
          "--color-red-dark": "#C41508",
          "--color-green-light": "#20C5C1",
          "--color-green-dark": "#379593",
          "--color-cream-light": "#F3EDE2",
          "--color-cream-dark": "#DFD9CE",
          "--color-dark-light": "#2A2728",
          "--color-dark-dark": "#201E1F",
          
          // Component styles
          "--rounded-btn": "0.5rem",
          "--animation-btn": "0.2s",
          "--btn-focus-scale": "0.98",
          "--border-btn": "2px",
          "--tab-border": "2px",
          "--tab-radius": "0.5rem",
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
        "hover": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "soft": "0 2px 4px rgba(0, 0, 0, 0.05)",
        "medium": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "strong": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      opacity: {
        '85': '.85',
        '95': '.95',
      },
    },
  },
};
