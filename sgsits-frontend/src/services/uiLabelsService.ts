/**
 * UI Labels Service — Global static text labels
 *
 * Backend: GET/PUT /api/v1/settings/cms/ui_labels
 * Falls back to mock defaults when backend unreachable.
 */

import { getCmsSection, saveCmsSection } from './settingsService'
import { mockUiLabels, type UiLabelsConfig } from '../mock/uilabels/uiLabelsData'

const KEY = 'ui_labels'

export const getUiLabels = async (): Promise<UiLabelsConfig> => {
  const data = await getCmsSection<UiLabelsConfig>(KEY, mockUiLabels)
  return { ...mockUiLabels, ...data }
}

export const saveUiLabels = async (data: UiLabelsConfig): Promise<void> => {
  await saveCmsSection(KEY, data)
}

/** Synchronous default — no-flash initial render */
export const uiLabelsDefaults: UiLabelsConfig = mockUiLabels

export type { UiLabelsConfig }

export const uiLabelsService = {
  getUiLabels,
  saveUiLabels,
}

export default uiLabelsService
