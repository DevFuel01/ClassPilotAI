/**
 * commandParser.ts
 *
 * Shared structured command router for ClassPilot AI.
 * Used by both the voice assistant hook (mic input) and the AIPanel chat box
 * (keyboard input) so every teacher interaction routes identically to the
 * correct classroom feature — updating the Smart Board and sidebar in sync.
 *
 * Returns: true  → a known command was matched and dispatched.
 *          false → no match; caller should fall back to sendChatMessage().
 */

export interface CommandParserActions {
  triggerConceptSimplification: (concept: string) => Promise<void>;
  triggerQuizGeneration: (topic: string) => Promise<void>;
  triggerTranslation: (
    text: string,
    targetLang?: 'English' | 'Hindi' | 'Hinglish' | 'Auto'
  ) => Promise<void>;
  triggerActivityGuide: (topic: string, durationMinutes?: number) => Promise<void>;
  triggerLessonSummary: () => void;
  triggerHomeworkGeneration: () => void;
}

export const parseStructuredCommand = async (
  transcript: string,
  actions: CommandParserActions
): Promise<boolean> => {
  const cleanText = transcript.trim().toLowerCase();

  // ── 1. Concept Simplification ─────────────────────────────────────────────
  // e.g. "explain photosynthesis", "what is gravity", "water cycle samjhao"
  const conceptRegexEnglish =
    /^(?:explain|teach|what is|tell me about|tell about)\s+([\w\s\-]+)$/i;
  const conceptRegexHindi =
    /^([\w\s\-]+)\s+(?:samjhao|kya hota hai|samjhaen|kya hai)$/i;

  // ── 2. Quiz Generation ────────────────────────────────────────────────────
  // e.g. "create a quiz", "generate quiz on gravity", "physics par quiz karein"
  const quizRegexEnglish =
    /^(?:create|generate|start)\s+(?:a\s+)?(?:five-question\s+)?quiz(?:\s+on\s+([\w\s\-]+))?$/i;
  const quizRegexHindi =
    /^(?:([\w\s\-]+)\s+)?(?:par\s+)?(?:quiz|test)\s+(?:shuru karo|generate karo|karein)$/i;

  // ── 3. Translation ────────────────────────────────────────────────────────
  // e.g. "translate welcome to class", "translate hello into hindi"
  const translateRegexEnglish =
    /^translate\s+(.+?)(?:\s+into\s+(hindi|english|hinglish))?$/i;
  const translateRegexHindi =
    /^(.+?)\s+(?:ko\s+)?(hindi|english|hinglish)\s+(?:mein\s+)?translate\s+(?:karo|karein)$/i;

  // ── 4. Activity Guide ─────────────────────────────────────────────────────
  // e.g. "start a 5 minute activity on friction"
  const activityRegexEnglish =
    /^start\s+(?:a\s+)?(\d+)\s*minute\s+(?:group\s+)?activity(?:\s+on\s+([\w\s\-]+))?$/i;
  const activityRegexHindi =
    /^(?:([\w\s\-]+)\s+)?(?:par\s+)?(\d+)\s*minute\s+ki\s+activity\s+shuru\s+karo$/i;

  // ── 5. Homework ───────────────────────────────────────────────────────────
  const homeworkRegex = /^(?:generate|create|give|show)\s+homework$/i;
  const homeworkRegexHindi =
    /^(?:homework|home assignment)\s+(?:de do|karo|banao|generate karo)$/i;

  // ── 6. Lesson Summary ─────────────────────────────────────────────────────
  const summaryRegex = /^(?:summarize|summary|lesson summary|summarize lesson)$/i;
  const summaryRegexHindi =
    /^(?:summary|lesson summary)\s+(?:batao|karo|banao|dikhayein)$/i;

  // ── Command Routing ───────────────────────────────────────────────────────

  let match: RegExpMatchArray | null;

  // Concept — English
  match = cleanText.match(conceptRegexEnglish);
  if (match) {
    await actions.triggerConceptSimplification(match[1].trim());
    return true;
  }

  // Concept — Hindi
  match = cleanText.match(conceptRegexHindi);
  if (match) {
    await actions.triggerConceptSimplification(match[1].trim());
    return true;
  }

  // Quiz — English
  match = cleanText.match(quizRegexEnglish);
  if (match) {
    await actions.triggerQuizGeneration(match[1] ? match[1].trim() : 'science');
    return true;
  }

  // Quiz — Hindi
  match = cleanText.match(quizRegexHindi);
  if (match) {
    await actions.triggerQuizGeneration(match[1] ? match[1].trim() : 'science');
    return true;
  }

  // Translation — English
  match = cleanText.match(translateRegexEnglish);
  if (match) {
    const lang = match[2]
      ? ((match[2].charAt(0).toUpperCase() +
          match[2].slice(1).toLowerCase()) as 'English' | 'Hindi' | 'Hinglish')
      : 'Hinglish';
    await actions.triggerTranslation(match[1].trim(), lang);
    return true;
  }

  // Translation — Hindi
  match = cleanText.match(translateRegexHindi);
  if (match) {
    const lang = match[2]
      ? ((match[2].charAt(0).toUpperCase() +
          match[2].slice(1).toLowerCase()) as 'English' | 'Hindi' | 'Hinglish')
      : 'Hinglish';
    await actions.triggerTranslation(match[1].trim(), lang);
    return true;
  }

  // Activity — English
  match = cleanText.match(activityRegexEnglish);
  if (match) {
    const duration = parseInt(match[1]) || 5;
    const topic = match[2] ? match[2].trim() : 'group discussion';
    await actions.triggerActivityGuide(topic, duration);
    return true;
  }

  // Activity — Hindi
  match = cleanText.match(activityRegexHindi);
  if (match) {
    const topic = match[1] ? match[1].trim() : 'group discussion';
    const duration = parseInt(match[2]) || 5;
    await actions.triggerActivityGuide(topic, duration);
    return true;
  }

  // Homework
  if (homeworkRegex.test(cleanText) || homeworkRegexHindi.test(cleanText)) {
    actions.triggerHomeworkGeneration();
    return true;
  }

  // Summary
  if (summaryRegex.test(cleanText) || summaryRegexHindi.test(cleanText)) {
    actions.triggerLessonSummary();
    return true;
  }

  // No structured command matched — caller should use sendChatMessage() fallback
  return false;
};
