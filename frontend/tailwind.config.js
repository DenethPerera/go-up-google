/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
    
  ],

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        background: "var(--background)",

        foreground: "var(--foreground)",

        card: "var(--card)",
        formCard: "var(--form-card)",

        "card-foreground": "var(--card-foreground)",

        primary: "var(--primary)",

        "primary-foreground": "var(--primary-foreground)",

        secondary: "var(--secondary)",

        "secondary-foreground": "var(--secondary-foreground)",

        thirdinary: "var(--thirdinary)",

        "thirdinary-foreground": "var(--thirdinary-foreground)",

        muted: "var(--muted)",

        "muted-foreground": "var(--muted-foreground)",

        accent: "var(--accent)",

        "accent-foreground": "var(--accent-foreground)",

        destructive: "var(--destructive)",

        "destructive-foreground": "#FFFFFF",

        border: "#6EA2B3",

        input: "#FFFFFF",

        "input-background": "rgba(255,255,255,0.7)",

        ring: "#7BBDE8",

        surface: "#FFFFFF",

        success: "#34A853",

        neutral: "#7A8797",

        "light-gray": "#F2F6F9",

        error: "#EF4444",

        "text-primary": "#001D39",

        "text-secondary": "#49769F",

        "text-inverse": "#FFFFFF",
      },

      borderRadius: {
        sm: "0.25rem",

        md: "0.5rem",

        lg: "1rem",

        full: "9999px",
      },
    },
  },

  plugins: [],
};
