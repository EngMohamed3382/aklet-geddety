/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#fdfaf2',
        'card': '#ffffff',
        'primary': '#5d8a2a',
        'text-dark': '#3f332d',
        'text-light': '#6e6b5b',
      },
    },
  },
  plugins: [],
}