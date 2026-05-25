/**
 * Zod validation schemas for the notices module.
 */
const { z } = require('zod');

const NOTICE_TYPES = ['GENERAL', 'DEPARTMENT', 'EXAM', 'PLACEMENT'];
const STATUSES     = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];

// Shared optional integer transform (accepts both numeric and string ints)
const optionalInt = z.union([z.number().int(), z.string().regex(/^\d+/).transform(Number)])
  .optional()
  .nullable();

const createNoticeSchema = z.object({
  title:         z.string({ required_error: 'title is required' }).min(1, 'title cannot be empty').max(500),
  description:   z.string().max(5000).optional().nullable(),
  notice_type:   z.enum(NOTICE_TYPES, { message: `notice_type must be one of: ${NOTICE_TYPES.join(', ')}` })
                   .optional()
                   .default('GENERAL'),
  department_id: optionalInt,
  file_id:       optionalInt,
  publish_date:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'publish_date must be YYYY-MM-DD').optional().nullable(),
  status:        z.enum(STATUSES).optional().default('DRAFT'),
});

const updateNoticeSchema = createNoticeSchema.partial();

const patchStatusSchema = z.object({
  status: z.enum(STATUSES, { message: `status must be one of: ${STATUSES.join(', ')}` }),
});

module.exports = { createNoticeSchema, updateNoticeSchema, patchStatusSchema };
