import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      "ayr-logo-blue": "#003464",
      "ayr-logo-gray": "#848482",
      "ayr-red": "#DD4443",
      "white": "#FFFFFF",
      "green": "#00FF00",
      "black": "#000000",
    }
  },
  plugins: [],
};
export default config;
