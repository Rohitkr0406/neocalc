/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      boxShadow: {
        'custom-dark': '10px 10px 16px 0.5px rgba(0,0,0,0.528), -10px -10px 16px 2px rgba(255,255,255,0.100)',
        'custom-light': '15px 10px 16px 2px rgba(0,0,0,0.128), -15px -10px 16px 2px rgba(255,255,255,0.938)'
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        // Calculator main container
        '.calc-container': {
          '@apply w-full md:w-[450px] flex flex-col justify-between p-5  md:rounded-3xl select-none': {},
        },
        // Round Icon Button
        '.btn-circle': {
          '@apply w-12 h-12 flex items-center justify-center rounded-full dark:shadow-custom-dark shadow-custom-light': {},
        },
        // Toggle container (dark/light switch)
        '.toggle-container': {
          '@apply flex h-12 w-24 items-center justify-between rounded-full px-2 dark:shadow-custom-dark shadow-custom-light': {},
        },
        // Active toggle
        '.toggle-active': {
          '@apply w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white': {},
        },
        // Inactive toggle
        '.toggle-inactive': {
          '@apply w-8 h-8 flex items-center justify-center rounded-full text-gray-400': {},
        },
        // Number button
        '.btn-num': {
          '@apply flex justify-center items-center py-3 rounded-2xl dark:shadow-custom-dark shadow-custom-light transition-all duration-300 ease-in-out': {},
        },
        //Number button hover
        '.btn-num:hover': {
          '@apply bg-orange-500 opacity-90 text-white': {},
        },
        // Number button active
        '.btn-num:active': {
          '@apply scale-90 scale-y-90': {},
        },
        // Operator button
        '.btn-op': {
          '@apply text-orange-500 font-bold text-2xl transition-all duration-300 ease-in-out': {},
        },
        // Operator button hover
        '.btn-op:hover': {
          '@apply text-orange-400': {},
        },
        // Operator button active
        '.btn-op:active': {
          '@apply scale-125': {},
        },
        // Equal button
        '.btn-equal': {
          '@apply rounded-2xl py-3 bg-orange-500 text-white font-bold dark:shadow-custom-dark shadow-custom-light': {},
        },
        //light mode theme
        '.light-theme': {
          '@apply bg-[#dcdcdc] text-black': {},
        },
        '.dark-theme': {
          '@apply bg-[#262634] text-white': {},
        }
      })
    }
  ]
}
