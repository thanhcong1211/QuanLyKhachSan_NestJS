/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        // Use the CSS variable injected by next/font when `variable` option is used
        manrope: ['var(--font-manrope)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
