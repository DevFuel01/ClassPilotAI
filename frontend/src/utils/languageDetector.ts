/**
 * Detects whether a given text is in English, Hindi, or Hinglish.
 */
export const detectLanguage = (text: string): 'English' | 'Hindi' | 'Hinglish' => {
  const trimmed = text.trim();
  if (!trimmed) return 'Hinglish'; // default fallback

  // 1. Check for Devanagari characters (Hindi script)
  // Range: U+0900 to U+097F
  if (/[\u0900-\u097F]/.test(trimmed)) {
    return 'Hindi';
  }

  // 2. Vocabulary checklist for common Hinglish vocabulary / Hindi written in Latin script
  const hinglishWords = new Set([
    'hai', 'hain', 'aur', 'ka', 'ki', 'ke', 'me', 'mein', 'ko', 'se', 
    'kya', 'kab', 'kaise', 'kyun', 'ye', 'yeh', 'wo', 'woh', 'hum', 
    'tum', 'aap', 'mera', 'meri', 'mere', 'par', 'samjhao', 'batao', 
    'karo', 'karein', 'dikhayein', 'banao', 'karne', 'gaya', 'sunte', 
    'shuru', 'aaiye', 'bachon', 'namaste', 'aaj', 'baare', 'seekhenge',
    'kya', 'hota', 'hai', 'karke', 'dein', 'bataen', 'kar', 'chalo', 
    'dhyan', 'sunye', 'suniye', 'likhein', 'likho', 'padhein', 'padho'
  ]);

  // Tokenize and clean punctuation
  const words = trimmed
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
    .split(/\s+/);

  let hinglishCount = 0;
  for (const word of words) {
    if (hinglishWords.has(word)) {
      hinglishCount++;
    }
  }

  // If we find Hinglish vocabulary (especially in short sentences or representing >= 15% of the words),
  // classify as Hinglish. Otherwise, default to English.
  const isShortInput = words.length <= 3;
  const hinglishRatio = hinglishCount / words.length;

  if (hinglishCount > 0 && (hinglishRatio >= 0.15 || isShortInput)) {
    return 'Hinglish';
  }

  return 'English';
};
