import { Playfair_Display, Inter, DM_Mono } from 'next/font/google';

export const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  variable: '--font-playfair',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

// DM Mono has no cyrillic subset on Google Fonts at all. next/font's
// default adjustFontFallback would otherwise swap Ukrainian text to its
// own metric-matched substitute font instead of falling through to plain
// `monospace` like it did before this migration — adjustFontFallback:
// false restores that original fallback behavior.
export const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-dm-mono',
  display: 'swap',
  fallback: ['monospace'],
  adjustFontFallback: false,
});
