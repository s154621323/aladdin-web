// API基础URL配置
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'

// API端点路径
export const API_ENDPOINTS = {
  AGENTS: '/agents',
  JOBS: '/jobs',
}

// 完整API URL
export const API_URLS = {
  AGENTS: `${API_BASE_URL}${API_ENDPOINTS.AGENTS}`,
  AGENT_BY_ID: (id: string) => `${API_BASE_URL}${API_ENDPOINTS.AGENTS}/${id}`,
  JOBS: `${API_BASE_URL}${API_ENDPOINTS.JOBS}`,
  JOB_BY_ID: (id: string) => `${API_BASE_URL}${API_ENDPOINTS.JOBS}/${id}`,
}
