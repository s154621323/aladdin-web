import apiClient from './apiClient'

export interface JobMatchResult {
  message: string
}

/**
 * 作业匹配服务
 */
export const jobMatchingService = {
  /**
   * 手动触发作业匹配过程
   * @returns 匹配结果消息
   */
  triggerJobMatching: async (): Promise<JobMatchResult> => {
    const response = await apiClient.post('/agents/match-jobs')
    return response.data
  },
}
