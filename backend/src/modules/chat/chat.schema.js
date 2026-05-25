/**
 * Zod validation schemas for the /v1/chat endpoints.
 *
 * Security design:
 *  - question: min 2 chars, max 500 chars — prevents empty + excessively long prompts
 *  - history:  max 10 turns, each content max 2000 chars — bounded memory window
 *  - Both are sanitized further in chat.service.js (HTML / delimiter stripping)
 */

const { z } = require('zod');

const historyTurnSchema = z.object({
  role:    z.enum(['user', 'assistant'], { message: 'history[].role must be "user" or "assistant"' }),
  content: z.string().max(2000, 'history message too long').min(1),
});

const chatAskSchema = z.object({
  question: z
    .string({ required_error: 'question is required' })
    .min(2,   'Question is too short (min 2 characters)')
    .max(500, 'Question is too long (max 500 characters)')
    .transform(s => s.trim()),

  history: z
    .array(historyTurnSchema)
    .max(10, 'History too long (max 10 turns)')
    .optional()
    .default([]),
});

module.exports = { chatAskSchema };
