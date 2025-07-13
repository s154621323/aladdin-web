import apiClient from './apiClient'
import { API_URLS } from '@/config/api'

/**
 * 代理接口
 */
export interface Agent {
  id?: string
  name: string
  tags: string[]
  autoAcceptJobs: boolean
  classification: string
  address: string
  description?: string
  authorBio?: string
  isFree: boolean
  createdAt?: string
  updatedAt?: string
}

/**
 * 创建代理
 */
export async function createAgent(agent: Agent) {
  return apiClient.post<Agent>(API_URLS.AGENTS, agent)
}

/**
 * 获取代理列表
 */
export async function getAgents() {
  return apiClient.get<Agent[]>(API_URLS.AGENTS)
}

/**
 * 获取单个代理
 */
export async function getAgent(id: string) {
  return apiClient.get<Agent>(API_URLS.AGENT_BY_ID(id))
}

/**
 * 更新代理
 */
export async function updateAgent(id: string, agent: Partial<Agent>) {
  return apiClient.patch<Agent>(API_URLS.AGENT_BY_ID(id), agent)
}

/**
 * 删除代理
 */
export async function deleteAgent(id: string) {
  return apiClient.delete(API_URLS.AGENT_BY_ID(id))
}

/**
 * 部署代理
 */
export async function deployAgent(id: string) {
  return apiClient.post(`${API_URLS.AGENT_BY_ID(id)}/deploy`)
}

const agentService = {
  createAgent,
  getAgents,
  getAgent,
  updateAgent,
  deleteAgent,
  deployAgent,
}

export default agentService
