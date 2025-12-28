/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Jika slate-950 masih error, kita daftarkan manual di sini
        slate: {
          950: '#020617',
        }
      }
    },
  },
  plugins: [],
}