/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        heritage: 'hsl(var(--heritage-orange))',
        royal: 'hsl(var(--royal-brown))',
        cream: 'hsl(var(--warm-cream))',
        golden: 'hsl(var(--golden))',
        inkbrown: 'hsl(var(--dark-brown))',
        nightbrown: 'hsl(var(--near-black-brown))'
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)']
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        'float-up': {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
          '20%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-120px) translateX(20px)', opacity: '0' }
        },
        'kenburns': {
          '0%': { transform: 'scale(1) translate(0,0)' },
          '100%': { transform: 'scale(1.15) translate(-2%, -2%)' }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 30px 4px rgba(212,175,55,0.35)' },
          '50%': { boxShadow: '0 0 60px 10px rgba(212,175,55,0.6)' }
        },
        'spin-slow': { to: { transform: 'rotate(360deg)' } }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'kenburns': 'kenburns 8s ease-out forwards',
        'shimmer': 'shimmer 3s linear infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 14s linear infinite'
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
