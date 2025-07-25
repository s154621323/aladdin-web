'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/ui/layout/Header'
import Footer from '@/ui/layout/Footer'
import jobService, {
  JobStatus,
  JobPriority,
  SkillLevel,
  Job,
  JobFilters,
} from '@/services/jobService'
import { jobMatchingService } from '@/services/jobMatchingService'
import useNotification from '@/hooks/useNotification'
import Notification from '@/components/ui/Notification'

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState<JobFilters>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [matchingInProgress, setMatchingInProgress] = useState(false)
  const { notification, showError, showSuccess, hideNotification } =
    useNotification()

  const pageSize = 10

  useEffect(() => {
    fetchJobs()
  }, [currentPage, filters])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const result = await jobService.getJobs(currentPage, pageSize, filters)
      setJobs(result.data)
      setTotalPages(result.totalPages)
      setLoading(false)
    } catch (err) {
      showError('获取任务列表失败')
      setLoading(false)
      console.error('获取任务列表出错:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除此任务吗？此操作无法撤销。')) {
      return
    }

    try {
      await jobService.deleteJob(id)
      // 刷新列表
      fetchJobs()
    } catch (err) {
      showError('删除任务失败')
      console.error('删除任务出错:', err)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // 搜索时重置页码
    setFilters({
      ...filters,
      search: searchTerm,
    })
  }

  const handleFilterChange = (filter: Partial<JobFilters>) => {
    setCurrentPage(1) // 筛选变更时重置页码
    setFilters({
      ...filters,
      ...filter,
    })
  }

  // 触发作业匹配
  const handleTriggerMatching = async () => {
    try {
      setMatchingInProgress(true)
      await jobMatchingService.triggerJobMatching()
      showSuccess('作业匹配已触发，正在为待处理的作业匹配合适的代理')
      // 短暂延迟后刷新作业列表，以便看到匹配结果
      setTimeout(() => {
        fetchJobs()
        setMatchingInProgress(false)
      }, 1000)
    } catch (err) {
      showError('触发作业匹配失败')
      setMatchingInProgress(false)
      console.error('触发作业匹配出错:', err)
    }
  }

  const renderStatusBadge = (status: JobStatus) => {
    let color = ''
    switch (status) {
      case JobStatus.PENDING:
        color = 'bg-yellow-100 text-yellow-800'
        break
      case JobStatus.RUNNING:
        color = 'bg-blue-100 text-blue-800'
        break
      case JobStatus.COMPLETED:
        color = 'bg-green-100 text-green-800'
        break
      case JobStatus.FAILED:
        color = 'bg-red-100 text-red-800'
        break
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>
        {status === JobStatus.PENDING
          ? '待处理'
          : status === JobStatus.RUNNING
          ? '执行中'
          : status === JobStatus.COMPLETED
          ? '已完成'
          : '失败'}
      </span>
    )
  }

  const renderPriorityBadge = (priority: JobPriority) => {
    let color = ''
    switch (priority) {
      case JobPriority.LOW:
        color = 'bg-gray-100 text-gray-800'
        break
      case JobPriority.MEDIUM:
        color = 'bg-blue-100 text-blue-800'
        break
      case JobPriority.HIGH:
        color = 'bg-orange-100 text-orange-800'
        break
      case JobPriority.URGENT:
        color = 'bg-red-100 text-red-800'
        break
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>
        {priority === JobPriority.LOW
          ? '低'
          : priority === JobPriority.MEDIUM
          ? '中'
          : priority === JobPriority.HIGH
          ? '高'
          : '紧急'}
      </span>
    )
  }

  return (
    <main className="min-h-screen bg-[#f0f4f9]">
      <Header />

      <Notification
        type={notification.type}
        message={notification.message}
        visible={notification.visible}
        onClose={hideNotification}
      />

      <div className="pt-32 pb-16 px-6 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">任务管理</h1>
          <div className="flex gap-3">
            <button
              onClick={handleTriggerMatching}
              disabled={matchingInProgress}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium flex items-center gap-1 ${
                matchingInProgress ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {matchingInProgress ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  匹配中...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  匹配作业
                </>
              )}
            </button>
            <Link
              href="/jobs/create"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 text-sm font-medium flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              创建任务
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-sm border border-white/50 backdrop-blur-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-grow">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="搜索任务..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-2.5 text-gray-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </form>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={filters.status || ''}
                onChange={(e) =>
                  handleFilterChange({
                    status: e.target.value
                      ? (e.target.value as JobStatus)
                      : undefined,
                  })
                }
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="">全部状态</option>
                <option value={JobStatus.PENDING}>待处理</option>
                <option value={JobStatus.RUNNING}>执行中</option>
                <option value={JobStatus.COMPLETED}>已完成</option>
                <option value={JobStatus.FAILED}>失败</option>
              </select>

              <select
                value={filters.priority || ''}
                onChange={(e) =>
                  handleFilterChange({
                    priority: e.target.value
                      ? (e.target.value as JobPriority)
                      : undefined,
                  })
                }
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="">全部优先级</option>
                <option value={JobPriority.LOW}>低</option>
                <option value={JobPriority.MEDIUM}>中</option>
                <option value={JobPriority.HIGH}>高</option>
                <option value={JobPriority.URGENT}>紧急</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <div className="text-gray-400 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-1">
              没有找到任务
            </h3>
            <p className="text-gray-500">
              {searchTerm || filters.status || filters.priority
                ? '尝试使用不同的搜索条件'
                : '目前没有可用的任务，请创建一个新的任务'}
            </p>
            <Link
              href="/jobs/create"
              className="mt-6 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 text-sm font-medium"
            >
              创建新任务
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      任务信息
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      状态
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      优先级
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      截止日期
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {job.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {job.category}
                            </div>
                            {job.tags && job.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {job.tags.slice(0, 3).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-blue-50 text-blue-700 text-xs px-1.5 py-0.5 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {job.tags.length > 3 && (
                                  <span className="text-xs text-gray-500">
                                    +{job.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStatusBadge(job.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderPriorityBadge(job.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(job.deadline).toLocaleDateString('zh-CN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <Link
                            href={`/jobs/${job.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            查看
                          </Link>
                          <Link
                            href={`/jobs/edit/${job.id}`}
                            className="text-green-600 hover:text-green-800"
                          >
                            编辑
                          </Link>
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 分页控件 */}
        {!loading && jobs.length > 0 && totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex space-x-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-blue-600 hover:bg-gray-50'
                }`}
              >
                上一页
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-blue-600 hover:bg-gray-50'
                }`}
              >
                下一页
              </button>
            </nav>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="flex justify-center mt-4">
            <div className="bg-white px-4 py-2 rounded-md shadow-sm text-sm text-gray-500">
              显示 {jobs.length} 个任务
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
