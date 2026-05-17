/**
 * Remove server-only keys from questions before sending to the client.
 */
export function stripAnswerKeys(
  questionsJson: Record<string, unknown> | null,
): Record<string, unknown> | null {
  if (!questionsJson || typeof questionsJson !== 'object') return questionsJson;
  const raw = questionsJson as { questions?: unknown[] };
  if (!Array.isArray(raw.questions)) {
    return { ...raw };
  }
  const questions = raw.questions.map((q) => {
    if (!q || typeof q !== 'object') return q;
    const o = { ...(q as Record<string, unknown>) };
    delete o.correctIndex;
    delete o.rubricHints;
    return o;
  });
  return { ...raw, questions };
}
