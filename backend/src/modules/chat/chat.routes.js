/**
 * /api/v1/chat
 *
 * POST /ask  — submit a question, receive an AI-generated answer backed by
 *              live DB context (RAG).
 *
 * Security:
 *  - Rate-limited by authLimiter (stricter than default API limiter)
 *  - Zod input validation (chatAskSchema)
 *  - Sanitization inside chat.service.js
 *  - No auth required — it's a public-facing assistant
 *    (add authMiddleware here if you want to restrict to logged-in users)
 */

const { Router }     = require('express');
const chatService    = require('./chat.service');
const { validate }   = require('../../middlewares/validate.middleware');
const { chatAskSchema } = require('./chat.schema');
const { authLimiter } = require('../../middlewares/rateLimit.middleware');
const { success }    = require('../../utils/response');

const router = Router();

// ── POST /ask ─────────────────────────────────────────────────────────────────
router.post(
  '/ask',
  authLimiter,           // 20 req / 15 min per IP (reuses auth limiter)
  validate(chatAskSchema),
  async (req, res, next) => {
    try {
      const { question, history } = req.body;
      const result = await chatService.chat(question, history);
      return success(res, 'Answer generated', result);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
