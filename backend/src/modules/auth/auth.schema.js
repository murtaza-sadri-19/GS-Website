/**
 * Zod validation schemas for auth endpoints.
 *
 * Rules deliberately kept strict:
 *  - email: valid format, lowercased by transform
 *  - password: non-empty (login), min-8 + complexity (new passwords)
 */

const { z } = require('zod');

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('A valid email address is required')
    .transform((v) => v.toLowerCase().trim()),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

const changePasswordSchema = z.object({
  oldPassword: z
    .string({ required_error: 'Current password is required' })
    .min(1, 'Current password is required'),
  newPassword: z
    .string({ required_error: 'New password is required' })
    .min(8, 'New password must be at least 8 characters')
    .regex(/[A-Z]/, 'New password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'New password must contain at least one number'),
});

const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('A valid email address is required')
    .transform((v) => v.toLowerCase().trim()),
});

const resetPasswordSchema = z.object({
  token: z
    .string({ required_error: 'Reset token is required' })
    .min(1, 'Reset token is required'),
  newPassword: z
    .string({ required_error: 'New password is required' })
    .min(8, 'New password must be at least 8 characters')
    .regex(/[A-Z]/, 'New password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'New password must contain at least one number'),
});

module.exports = {
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
