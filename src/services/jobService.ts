import apiClient from './apiClient'

// Job状态枚举
export enum JobStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// 任务优先级枚举
export enum JobPriority {
  LOW = 'Low Priority',
  MEDIUM = 'Medium Priority',
  HIGH = 'High Priority',
  URGENT = 'Urgent',
}

// 技能要求级别枚举
export enum SkillLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert',
}

// 支付类型枚举
export enum PaymentType {
  FIXED = 'Fixed',
  HOURLY = 'Hourly',
  MILESTONE = 'Milestone',
}

// Job类型定义
export interface Job {
  id: string
  title: string
  category: string
  tags: string[]
  description: string
  paymentType: PaymentType
  budgetMin: number
  budgetMax: number
  deadline: string
  priority: JobPriority
  skillLevel: SkillLevel
  deliverables: string
  autoAssign: boolean
  allowBidding: boolean
  enableEscrow: boolean
  agentId?: string
  agent?: any
  status: JobStatus
  result?: any
  createdAt: string
  updatedAt: string
}

// 分页结果类型
export interface PaginatedJobs {
  data: Job[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 筛选器参数
export interface JobFilters {
  status?: JobStatus
  category?: string
  priority?: JobPriority
  skillLevel?: SkillLevel
  search?: string
}

// Job服务
const jobService = {
  // 获取分页任务列表
  getJobs: async (
    page = 1,
    pageSize = 10,
    filters?: JobFilters
  ): Promise<PaginatedJobs> => {
    const queryParams = new URLSearchParams()
    queryParams.append('page', page.toString())
    queryParams.append('pageSize', pageSize.toString())

    // 添加过滤条件
    if (filters) {
      if (filters.status) queryParams.append('status', filters.status)
      if (filters.category) queryParams.append('category', filters.category)
      if (filters.priority) queryParams.append('priority', filters.priority)
      if (filters.skillLevel)
        queryParams.append('skillLevel', filters.skillLevel)
      if (filters.search) queryParams.append('search', filters.search)
    }

    try {
      const response = await apiClient.get(
        `/jobs/paginated?${queryParams.toString()}`
      )
      return response.data
    } catch (error) {
      console.error('获取任务列表失败:', error)
      throw error
    }
  },

  // 获取所有任务
  getAllJobs: async (): Promise<Job[]> => {
    try {
      const response = await apiClient.get('/jobs')
      return response.data
    } catch (error) {
      console.error('获取全部任务失败:', error)
      throw error
    }
  },

  // 获取任务详情
  getJobById: async (id: string): Promise<Job> => {
    try {
      const response = await apiClient.get(`/jobs/${id}`)
      return response.data
    } catch (error) {
      console.error(`获取任务 ${id} 详情失败:`, error)
      throw error
    }
  },

  // 创建任务
  createJob: async (
    jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'result'>
  ): Promise<Job> => {
    try {
      const response = await apiClient.post('/jobs', jobData)
      return response.data
    } catch (error: any) {
      console.error('创建任务失败:', error)

      // 提取详细错误信息
      if (error.response && error.response.data) {
        const errorData = error.response.data
        if (Array.isArray(errorData.message)) {
          throw new Error(errorData.message.join(', '))
        } else if (typeof errorData.message === 'string') {
          throw new Error(errorData.message)
        }
      }

      // 如果没有详细错误信息，则抛出原始错误
      throw error
    }
  },

  // 更新任务
  updateJob: async (id: string, jobData: Partial<Job>): Promise<Job> => {
    try {
      const response = await apiClient.patch(`/jobs/${id}`, jobData)
      return response.data
    } catch (error) {
      console.error(`更新任务 ${id} 失败:`, error)
      throw error
    }
  },

  // 删除任务
  deleteJob: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/jobs/${id}`)
    } catch (error) {
      console.error(`删除任务 ${id} 失败:`, error)
      throw error
    }
  },

  // 更新任务状态
  updateJobStatus: async (id: string, status: JobStatus): Promise<Job> => {
    try {
      const response = await apiClient.patch(`/jobs/${id}/status/${status}`)
      return response.data
    } catch (error) {
      console.error(`更新任务 ${id} 状态失败:`, error)
      throw error
    }
  },
}

export default jobService
