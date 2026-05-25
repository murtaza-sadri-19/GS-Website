/**
 * Contact Service — Institute contact details and form submission
 *
 * getContactData()     — reads from CMS section (backend: GET /v1/settings/cms/contact.info)
 * submitContactForm()  — posts to backend (POST /v1/contact), rate-limited
 *
 * Falls back to mock data when backend unreachable.
 */

import apiClient from '../api/client'
import { getCmsSection } from './settingsService'
import { mockContactData, type ContactData, type ContactOffice } from '../mock/contact/contactData'

export type { ContactData, ContactOffice }

// ─── Institute contact info (from CMS) ────────────────────────────────────────

export const getContactData = async (): Promise<ContactData> => {
  const data = await getCmsSection<ContactData>('contact.info', mockContactData)
  return (data && typeof data === 'object' && !Array.isArray(data))
    ? (data as ContactData)
    : { ...mockContactData }
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

export const contactDefault: ContactData = mockContactData

export const contactService = {
  getContactData,
  saveContactData,
  submitContactForm,
}

export default contactService
