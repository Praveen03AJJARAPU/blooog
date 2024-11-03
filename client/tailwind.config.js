/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lico: "Licorice, cursive",
        lime: "Limelight, sans-serif",
        anto : "Antonio, sans-serif"
      },
      colors: {
        primary: '#1E201E',
        secondary: '#3C3D37',
        third: '#697565',
        fourth: '#ECDFCC' 
      }
    },
  },
  plugins: [],
}