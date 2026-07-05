/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        lime:   '#ADFF2F',
        yellow: '#FFD700',
        orange: '#FF6B35',
        pink:   '#FF6EC7',
        cyan:   '#7DF9FF',
        cream:  '#FFFDF7',
        ink:    '#0D0D0D',
      },
      fontFamily: {
        grotesk: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        brutal:       '6px 6px 0px #0D0D0D',
        'brutal-sm':  '4px 4px 0px #0D0D0D',
        'brutal-lg':  '10px 10px 0px #0D0D0D',
        'brutal-xl':  '14px 14px 0px #0D0D0D',
        'brutal-inv': '6px 6px 0px #ADFF2F',
        'brutal-none':'0px 0px 0px #0D0D0D',
      },
      keyframes: {
        wobble: {
          '0%,100%': { transform: 'rotate(-1deg) scale(1)' },
          '25%':     { transform: 'rotate(1.5deg) scale(1.02)' },
          '50%':     { transform: 'rotate(-0.5deg) scale(1.01)' },
          '75%':     { transform: 'rotate(1deg) scale(1.02)' },
        },
        bounceIn: {
          '0%':   { transform: 'scale(0.8) translateY(20px)', opacity: '0' },
          '60%':  { transform: 'scale(1.05) translateY(-5px)', opacity: '1' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        slidePanel: {
          '0%':   { transform: 'translateX(-60px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
        stampIn: {
          '0%':   { transform: 'scale(4) rotate(-20deg)', opacity: '0' },
          '70%':  { transform: 'scale(0.9) rotate(3deg)',  opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)',   opacity: '1' },
        },
        floatBob: {
          '0%,100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%':     { transform: 'translateY(-16px) rotate(2deg)' },
        },
        jelly: {
          '0%,100%': { transform: 'scaleX(1) scaleY(1)' },
          '30%':     { transform: 'scaleX(1.12) scaleY(0.92)' },
          '60%':     { transform: 'scaleX(0.94) scaleY(1.08)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        wobble:      'wobble 0.6s ease-in-out',
        bounceIn:    'bounceIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        slidePanel:  'slidePanel 0.6s ease-out forwards',
        stampIn:     'stampIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        floatBob:    'floatBob 3s ease-in-out infinite',
        jelly:       'jelly 0.5s ease-in-out',
        marquee:     'marquee 25s linear infinite',
      },
    },
  },
  plugins: [],
};
