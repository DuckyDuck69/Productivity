/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#34D399",   // Mint Green
          accent: "#22D3EE",    // Light Teal
          support: "#FCD34D",   // Warm Yellow
          background: "#ECFDF5",// Pale Mint
          fontcolor: "#1F2937", // Slate Dark Gray
        },
      },
    },
    plugins: [],
  }
  