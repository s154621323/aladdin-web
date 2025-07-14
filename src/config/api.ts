// API基础URL配置
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'

// API端点路径
export const API_ENDPOINTS = {
  AGENTS: '/agents',
  JOBS: '/jobs',
}

// API端点路径（不包含基础URL）
export const API_URLS = {
  AGENTS: API_ENDPOINTS.AGENTS,
  AGENT_BY_ID: (id: string) => `${API_ENDPOINTS.AGENTS}/${id}`,
  JOBS: API_ENDPOINTS.JOBS,
  JOB_BY_ID: (id: string) => `${API_ENDPOINTS.JOBS}/${id}`,
}
