/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. Definisi Font Custom
      fontFamily: {
        pixel: ['Alagard', 'serif'], 
      },
      // 2. Definisi Warna RPG (PENTING: Ini yang bikin error kamu hilang)
      colors: {
        rpg: {
          bg: '#2a2f4e',       // Background Utama
          card: '#191628',     // Warna Batu/Container
          border: '#0d0b14',   // Warna Outline Tebal
          text: '#e0d8f0',     // Warna Teks
          gold: '#d4b483',     // Warna Emas (Button) <--- INI YANG DICARI ERRORNYA
          danger: '#d95763',   // Merah
          success: '#6dab68',  // Hijau
          muted: '#4a4560'     // Abu-abu pudar
        }
      },
      // 3. Definisi Shadow Pixel
      boxShadow: {
        'pixel': '4px 4px 0px 0px #0d0b14',
        'pixel-sm': '2px 2px 0px 0px #0d0b14',
        'pixel-active': '0px 0px 0px 0px #0d0b14',
      }
    },
  },
  plugins: [],
}