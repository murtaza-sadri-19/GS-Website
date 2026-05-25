/**
 * Zod validation schemas for the news module.
 */
const { z } = require('zod');

const CATEGORIES = ['GENERAL', 'ACADEMIC', 'PLACEMENT', 'RESEARCH', 'SPORTS', 'CULTURAL'];
const STATUSES   = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];

const createNewsSchema = z.object({
  title:         z.string({ required_error: 'title is required' }).min(1, 'title cannot be empty').max(500),
  excerpt:       z.string().max(1000).optional().nullable(),
  content:       z.string().optional().nullable(),
  cover_img_url: z.string().url('cover_img_url must be a valid URL').optional().nullable(),
  category:      z.enum(CATEGORIES, { message: `category must be one of: ${CATEGORIES.join(', ')}` })
                   .optional()
                   .default('GENERAL'),
  published_at:  z.string()
                   .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?/, 'published_at must be a valid date or datetime')
                   .optional()
                   .nullable(),
  status:        z.enum(STATUSES).optional().default('DRAFT'),
});

const updateNewsSchema = createNewsSchema.partial();

const patchStatusSchema = z.object({
  status: z.enum(STATUSES, { message: `status must be one of: ${STATUSES.join(', ')}` }),
});

module.exports = { createNewsSchema, updateNewsSchema, patchStatusSchema };
