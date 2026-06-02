/**
 * UI Labels Service — Global static text labels
 *
 * Backend: GET/PUT /api/v1/settings/cms/ui_labels
 */

import { getCmsSection, saveCmsSection } from './settingsService'

export interface UiLabelsConfig {
  topBarQuickLinks?: Array<{ label: string; url: string }>
  [key: string]: any
}

const KEY = 'ui_labels'

export const getUiLabels = async (): Promise<UiLabelsConfig> => {
  const data = await getCmsSection<UiLabelsConfig>(KEY)
  return { ...uiLabelsDefaults, ...data }
}

export const saveUiLabels = async (data: UiLabelsConfig): Promise<void> => {
  await saveCmsSection(KEY, data)
}

export const uiLabelsDefaults: UiLabelsConfig = {
  header: {},
  homepage: {},
  breadcrumbs: {},
  accessibility: {},
  sidebar: {},
  footer: {},
  topBar: {},
}

export const uiLabelsService = {
  getUiLabels,
  saveUiLabels,
}

export default uiLabelsService
