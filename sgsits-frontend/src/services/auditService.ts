import apiClient from '../api/client'

export type AuditSeverity = 'low' | 'medium' | 'high' | 'critical'
export type AuditStatus   = 'success' | 'failure'

export interface AuditLog {
  id:             number
  user_id:        number
  user_name:      string
  user_email:     string
  user_role:      string
  action:         string
  module_name:    string
  entity_name:    string | null
  record_id:      number | null
  description:    string
  old_value:      Record<string, unknown> | null
  new_value:      Record<string, unknown> | null
  changed_fields: string[] | null
  severity:       AuditSeverity
  ip_address:     string | null
  user_agent:     string | null
  browser:        string | null
  os:             string | null
  device:         string | null
  request_url:    string | null
  request_method: string | null
  session_id:     string | null
  status:         AuditStatus
  created_at:     string
}

export interface AuditPage {
  logs:       AuditLog[]
  pagination: { total: number; page: number; pageSize: number; totalPages: number }
}

export interface AuditFilters {
  page?:        number
  pageSize?:    number
  search?:      string
  user_id?:     number | string
  action?:      string
  module_name?: string
  severity?:    AuditSeverity
  status?:      AuditStatus
  ip_address?:  string
  role?:        string
  date_from?:   string
  date_to?:     string
}

export interface AuditStats {
  total:        number
  last24h:      number
  critical:     number
  failedLogins: number
  topUsers:     { id: number; name: string; cnt: number }[]
  topModules:   { module_name: string; cnt: number }[]
}

export interface AuditFilterOptions {
  actions:    string[]
  modules:    string[]
  severities: string[]
  statuses:   string[]
  roles:      string[]
}

const base = '/v1/audit-logs'

export const auditService = {
  async getLogs(filters: AuditFilters = {}): Promise<AuditPage> {
    const res = await apiClient.get(base, { params: filters })
    return res.data.data
  },

  async getLog(id: number): Promise<AuditLog> {
    const res = await apiClient.get(`${base}/${id}`)
    return res.data.data
  },

  async getUserLogs(userId: number, page = 1, pageSize = 50): Promise<AuditPage & { user: { id: number; name: string; email: string } }> {
    const res = await apiClient.get(`${base}/user/${userId}`, { params: { page, pageSize } })
    return res.data.data
  },

  async getFilterOptions(): Promise<AuditFilterOptions> {
    const res = await apiClient.get(`${base}/filter-options`)
    return res.data.data
  },

  async getStats(): Promise<AuditStats> {
    const res = await apiClient.get(`${base}/stats`)
    return res.data.data
  },

  async getRecentActivity(limit = 15): Promise<AuditLog[]> {
    const res = await apiClient.get(`${base}/recent`, { params: { limit }, skipAuthRedirect: true } as any)
    return res.data.data
  },

  exportCsv(filters: AuditFilters = {}): void {
    const params = new URLSearchParams({ ...filters as any, pageSize: '1000' } as any).toString()
    const a = document.createElement('a')
    a.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}${base}?${params}&export=csv`
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  },
}

export default auditService
