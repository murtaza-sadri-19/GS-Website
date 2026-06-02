/**
 * Contact Service — Institute contact details and form submission
 *
 * getContactData()     — reads from CMS section (backend: GET /v1/settings/cms/contact.info)
 * submitContactForm()  — posts to backend (POST /v1/contact), rate-limited
 */

import apiClient from '../api/client'
import { getCmsSection } from './settingsService'

export interface ContactOffice {
  name: string
  address?: string
  phone?: string
  email?: string
  hours?: string
}

export interface ContactData {
  address?: string
  phone?: string
  email?: string
  fax?: string
  website?: string
  mapEmbedUrl?: string
  offices?: ContactOffice[]
  [key: string]: any
}

// ─── Institute contact info (from CMS) ────────────────────────────────────────

export const getContactData = async (): Promise<ContactData> => {
  return (await getCmsSection<ContactData>('contact.info')) ?? {} as ContactData
}

export const saveContactData = async (data: ContactData): Promise<void> => {
  const { saveCmsSection } = await import('./settingsService')
  await saveCmsSection('contact.info', data)
}

// ─── Contact form submission ──────────────────────────────────────────────────

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export const submitContactForm = async (data: ContactFormData): Promise<void> => {
  await apiClient.post('/v1/contact', {
    name:    data.name.trim(),
    email:   data.email.trim().toLowerCase(),
    phone:   data.phone?.trim() || undefined,
    subject: data.subject?.trim() || undefined,
    message: data.message.trim(),
  })
}

// ─── Default ──────────────────────────────────────────────────────────────────

export const contactDefault: ContactData = {}

export const contactService = {
  getContactData,
  saveContactData,
  submitContactForm,
}

export default contactService
