/**
 * Zod validation schemas for the events module.
 */
const { z } = require('zod');

const STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];

const optionalInt = z.union([z.number().int(), z.string().regex(/^\d+/).transform(Number)])
  .optional()
  .nullable();

const createEventSchema = z.object({
  title:                z.string({ required_error: 'title is required' }).min(1, 'title cannot be empty').max(500),
  description:          z.string().max(5000).optional().nullable(),
  event_date:           z.string()
                          .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?/, 'event_date must be YYYY-MM-DD or YYYY-MM-DDTHH:MM')
                          .optional()
                          .nullable(),
  department_id:        optionalInt,
  cover_image_file_id:  optionalInt,
  status:               z.enum(STATUSES).optional().default('DRAFT'),
});

const updateEventSchema = createEventSchema.partial();

const patchStatusSchema = z.object({
  status: z.enum(STATUSES, { message: `status must be one of: ${STATUSES.join(', ')}` }),
});

module.exports = { createEventSchema, updateEventSchema, patchStatusSchema };
