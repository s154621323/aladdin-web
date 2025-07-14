import { API_BASE_URL } from '@/config/api'

/**
 * 请求选项接口
 */
interface RequestOptions extends RequestInit {
  params?: Record<string, string>
  token?: string
}

/**
 * API响应接口
 */
export interface ApiResponse<T = any> {
  data?: T
  error?: {
    message: string
    code?: string
    details?: any
  }
  status: number
}

/**
 * HTTP请求方法
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

/**
 * 处理API错误
 */
const handleApiError = (error: any, endpoint: string): ApiResponse => {
  console.error(`API请求失败: ${endpoint}`, error)

  return {
    error: {
      message: error instanceof Error ? error.message : '请求失败，请稍后再试',
      details: error,
    },
    status: 500,
  }
}

/**
 * 创建URL查询参数
 */
const createQueryString = (params?: Record<string, string>): string => {
  if (!params) return ''
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value)
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

/**
 * 发送API请求
 */
export async function apiRequest<T = any>(
  endpoint: string,
  method: HttpMethod = HttpMethod.GET,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const { params, token, ...fetchOptions } = options

    // 确保endpoint以/开头但不以/api开头
    const normalizedEndpoint = endpoint.startsWith('/')
      ? endpoint
      : `/${endpoint}`

    // 构建完整URL
    const url = `${API_BASE_URL}${normalizedEndpoint}${createQueryString(
      params
    )}`

    const headers = new Headers(fetchOptions.headers)

    // 设置Content-Type (如果未设置)
    if (method !== HttpMethod.GET && !headers.has('Content-Type')) {
      headers.append('Content-Type', 'application/json')
    }

    // 添加认证头（如果有token）
    if (token) {
      headers.append('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(url, {
      method,
      ...fetchOptions,
      headers,
    })

    // 解析响应数据
    let data
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    // 根据状态码处理响应
    if (!response.ok) {
      return {
        error: {
          message: data.message || '请求失败',
          code: data.code,
          details: data,
        },
        status: response.status,
      }
    }

    return {
      data,
      status: response.status,
    }
  } catch (error) {
    return handleApiError(error, endpoint)
  }
}

/**
 * API客户端
 */
const apiClient = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, HttpMethod.GET, options),

  post: <T = any>(endpoint: string, data?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, HttpMethod.POST, {
      ...options,
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = any>(endpoint: string, data?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, HttpMethod.PUT, {
      ...options,
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = any>(endpoint: string, data?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, HttpMethod.PATCH, {
      ...options,
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, HttpMethod.DELETE, options),
}

export default apiClient
