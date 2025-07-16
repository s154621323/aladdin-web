'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import jobService, {
  Job,
  JobStatus,
  JobPriority,
  SkillLevel,
  PaymentType,
} from '@/services/jobService'
import { jobMatchingService } from '@/services/jobMatchingService'
import useNotification from '@/hooks/useNotification'
import Notification from '@/components/ui/Notification'

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const { id } = params

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [matchingInProgress, setMatchingInProgress] = useState(false)
  const { notification, showError, showSuccess, hideNotification } =
    useNotification()

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setLoading(true)
        const data = await jobService.getJobById(id)
        setJob(data)
        setLoading(false)
      } catch (err) {
        showError('获取任务详情失败')
        setLoading(false)
        console.error('获取任务详情出错:', err)
      }
    }

    fetchJobDetail()
  }, [id, showError])

  const handleDelete = async () => {
    if (!window.confirm('确定要删除此任务吗？此操作无法撤销。')) {
      return
    }

    try {
      await jobService.deleteJob(id)
      window.location.href = '/jobs'
    } catch (err) {
      showError('删除任务失败')
      console.error('删除任务出错:', err)
    }
  }

  const handleStatusChange = async (status: JobStatus) => {
    try {
      const updatedJob = await jobService.updateJobStatus(id, status)
      setJob(updatedJob)
    } catch (err) {
      showError('更新任务状态失败')
      console.error('更新任务状态出错:', err)
    }
  }

  // 触发作业匹配
  const handleTriggerMatching = async () => {
    try {
      setMatchingInProgress(true)
      await jobMatchingService.triggerJobMatching()
      showSuccess('作业匹配已触发，正在为待处理的作业匹配合适的代理')
      // 短暂延迟后刷新作业详情，以便看到匹配结果
      setTimeout(async () => {
        try {
          const updatedJob = await jobService.getJobById(id)
          setJob(updatedJob)
          setMatchingInProgress(false)
        } catch (err) {
          console.error('刷新任务详情出错:', err)
          setMatchingInProgress(false)
        }
      }, 1000)
    } catch (err) {
      showError('触发作业匹配失败')
      setMatchingInProgress(false)
      console.error('触发作业匹配出错:', err)
    }
  }

  const getStatusName = (status: JobStatus) => {
    switch (status) {
      case JobStatus.PENDING:
        return '待处理'
      case JobStatus.RUNNING:
        return '执行中'
      case JobStatus.COMPLETED:
        return '已完成'
      case JobStatus.FAILED:
        return '失败'
    }
  }

  const getPriorityName = (priority: JobPriority) => {
    switch (priority) {
      case JobPriority.LOW:
        return '低'
      case JobPriority.MEDIUM:
        return '中'
      case JobPriority.HIGH:
        return '高'
      case JobPriority.URGENT:
        return '紧急'
    }
  }

  const getSkillLevelName = (level: SkillLevel) => {
    switch (level) {
      case SkillLevel.BEGINNER:
        return '初级'
      case SkillLevel.INTERMEDIATE:
        return '中级'
      case SkillLevel.ADVANCED:
        return '高级'
      case SkillLevel.EXPERT:
        return '专家'
    }
  }

  const getPaymentTypeName = (type: PaymentType) => {
    switch (type) {
      case PaymentType.FIXED:
        return '固定金额'
      case PaymentType.HOURLY:
        return '按小时计费'
      case PaymentType.MILESTONE:
        return '按里程碑付款'
    }
  }

  // 渲染匹配状态
  const renderMatchingStatus = () => {
    if (!job) return null

    // 如果已经分配了代理
    if (job.agentId) {
      return (
        <div className="bg-green-50 border border-green-100 rounded-md p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">已匹配代理</h3>
              <div className="mt-1 text-sm text-green-700">
                <p>
                  该任务已成功匹配到代理{' '}
                  <Link
                    href={`/agents/${job.agentId}`}
                    className="font-medium underline"
                  >
                    {job.agent?.name || job.agentId}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // 如果开启了自动分配但尚未匹配到代理
    if (job.autoAssign) {
      return (
        <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                等待匹配代理
              </h3>
              <div className="mt-1 text-sm text-yellow-700">
                <p>
                  该任务已开启自动分配，系统将自动为其匹配合适的代理。您也可以手动触发匹配流程。
                </p>
              </div>
              <div className="mt-3">
                <button
                  onClick={handleTriggerMatching}
                  disabled={matchingInProgress}
                  className={`px-3 py-1.5 bg-yellow-600 text-white rounded-md text-xs font-medium flex items-center ${
                    matchingInProgress
                      ? 'opacity-70 cursor-not-allowed'
                      : 'hover:bg-yellow-700'
                  }`}
                >
                  {matchingInProgress ? (
                    <>
                      <svg
                        className="animate-spin -ml-0.5 mr-2 h-3 w-3 text-white"
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
                    '立即匹配代理'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // 如果未开启自动分配
    return (
      <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              未启用自动匹配
            </h3>
            <div className="mt-1 text-sm text-blue-700">
              <p>
                该任务未启用自动分配功能。您可以手动为任务分配代理，或者编辑任务开启自动分配功能。
              </p>
            </div>
            <div className="mt-3 flex space-x-3">
              <Link
                href={`/jobs/edit/${job.id}`}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700"
              >
                编辑任务
              </Link>
              <Link
                href="/agents"
                className="px-3 py-1.5 bg-white border border-blue-600 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-50"
              >
                浏览代理
              </Link>
            </div>
          </div>
        </div>
      </div>
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

      <div className="pt-32 pb-16 px-6 max-w-[1000px] mx-auto">
        <div className="mb-6">
          <Link
            href="/jobs"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            返回任务列表
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : !job ? (
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
            <h3 className="text-xl font-bold text-gray-700 mb-1">未找到任务</h3>
            <p className="text-gray-500">该任务可能已被删除或不存在</p>
            <Link
              href="/jobs"
              className="mt-6 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 text-sm font-medium"
            >
              返回任务列表
            </Link>
          </div>
        ) : (
          <>
            {/* 任务标题和操作按钮 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
                {job.title}
              </h1>
              <div className="flex space-x-3">
                <Link
                  href={`/jobs/edit/${job.id}`}
                  className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 text-sm"
                >
                  编辑任务
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                >
                  删除任务
                </button>
              </div>
            </div>

            {/* 匹配状态信息 */}
            {renderMatchingStatus()}

            {/* 任务详情卡片 */}
            <div className="bg-white shadow-sm rounded-xl overflow-hidden">
              {/* 任务状态栏 */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="flex items-center mb-4 md:mb-0">
                    <span className="text-gray-700 font-medium mr-2">
                      状态:
                    </span>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        job.status === JobStatus.PENDING
                          ? 'bg-yellow-100 text-yellow-800'
                          : job.status === JobStatus.RUNNING
                          ? 'bg-blue-100 text-blue-800'
                          : job.status === JobStatus.COMPLETED
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {getStatusName(job.status)}
                    </div>
                  </div>

                  {/* 状态更新下拉菜单 */}
                  <div className="flex items-center">
                    <span className="text-gray-700 font-medium mr-2">
                      更新状态:
                    </span>
                    <select
                      value={job.status}
                      onChange={(e) =>
                        handleStatusChange(e.target.value as JobStatus)
                      }
                      className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value={JobStatus.PENDING}>待处理</option>
                      <option value={JobStatus.RUNNING}>执行中</option>
                      <option value={JobStatus.COMPLETED}>已完成</option>
                      <option value={JobStatus.FAILED}>失败</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 基本信息 */}
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold mb-4">基本信息</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">类别</p>
                    <p className="mt-1">{job.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">优先级</p>
                    <p className="mt-1">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          job.priority === JobPriority.LOW
                            ? 'bg-gray-100 text-gray-800'
                            : job.priority === JobPriority.MEDIUM
                            ? 'bg-blue-100 text-blue-800'
                            : job.priority === JobPriority.HIGH
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {getPriorityName(job.priority)}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      截止日期
                    </p>
                    <p className="mt-1">
                      {new Date(job.deadline).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      技能要求级别
                    </p>
                    <p className="mt-1">{getSkillLevelName(job.skillLevel)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      支付类型
                    </p>
                    <p className="mt-1">
                      {getPaymentTypeName(job.paymentType)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      预算范围
                    </p>
                    <p className="mt-1">
                      ¥{job.budgetMin} - ¥{job.budgetMax}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">标签</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {job.tags && job.tags.length > 0 ? (
                        job.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">无标签</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 任务描述 */}
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold mb-4">任务描述</h2>
                <p className="whitespace-pre-wrap text-gray-700">
                  {job.description}
                </p>
              </div>

              {/* 交付物要求 */}
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold mb-4">交付物要求</h2>
                <p className="whitespace-pre-wrap text-gray-700">
                  {job.deliverables}
                </p>
              </div>

              {/* 代理信息 */}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">代理信息</h2>
                {job.agent ? (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p>
                      <span className="font-medium">代理名称:</span>{' '}
                      {job.agent.name}
                    </p>
                    <p>
                      <span className="font-medium">代理地址:</span>{' '}
                      {job.agent.address}
                    </p>
                    {job.agent.description && (
                      <p>
                        <span className="font-medium">代理描述:</span>{' '}
                        {job.agent.description}
                      </p>
                    )}
                    <div className="mt-3">
                      <Link
                        href={`/agents/${job.agent.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        查看代理详情
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-500">未分配代理</p>
                    <div className="mt-3">
                      <Link
                        href="/agents"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        浏览可用代理
                      </Link>
                    </div>
                  </div>
                )}

                {/* 其他选项 */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center p-3 rounded-lg bg-gray-50">
                    <span
                      className={`w-3 h-3 mr-2 rounded-full ${
                        job.autoAssign ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    ></span>
                    <span className="text-sm">
                      自动分配代理:{' '}
                      <span className="font-medium">
                        {job.autoAssign ? '是' : '否'}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center p-3 rounded-lg bg-gray-50">
                    <span
                      className={`w-3 h-3 mr-2 rounded-full ${
                        job.allowBidding ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    ></span>
                    <span className="text-sm">
                      允许竞标:{' '}
                      <span className="font-medium">
                        {job.allowBidding ? '是' : '否'}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center p-3 rounded-lg bg-gray-50">
                    <span
                      className={`w-3 h-3 mr-2 rounded-full ${
                        job.enableEscrow ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    ></span>
                    <span className="text-sm">
                      启用资金托管:{' '}
                      <span className="font-medium">
                        {job.enableEscrow ? '是' : '否'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </main>
  )
}
