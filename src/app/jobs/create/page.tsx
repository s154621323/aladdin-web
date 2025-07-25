'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/ui/layout/Header'
import Footer from '@/ui/layout/Footer'
import Link from 'next/link'
import jobService, {
  Job,
  JobPriority,
  SkillLevel,
  PaymentType,
} from '@/services/jobService'
import useNotification from '@/hooks/useNotification'
import Notification from '@/components/ui/Notification'

// 创建任务所需的表单数据类型
type JobFormData = Omit<
  Job,
  'id' | 'status' | 'createdAt' | 'updatedAt' | 'result'
>

export default function CreateJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { notification, showSuccess, showError, hideNotification } =
    useNotification()
  const [tagInput, setTagInput] = useState('')

  // 初始化表单数据
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    category: '',
    tags: [],
    description: '',
    paymentType: PaymentType.FIXED,
    budgetMin: 100,
    budgetMax: 1000,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0], // 默认截止日期为7天后
    priority: JobPriority.MEDIUM,
    skillLevel: SkillLevel.INTERMEDIATE,
    deliverables: '',
    autoAssign: false,
    allowBidding: true,
    enableEscrow: true,
    agentId: undefined,
    agent: undefined,
  })

  // 处理表单字段变更
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    // 处理数字类型字段
    if (name === 'budgetMin' || name === 'budgetMax') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      })
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      })
    }
  }

  // 标签相关处理
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value)
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag.trim()],
      })
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  // 提交表单
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 确保budgetMin <= budgetMax
      if (formData.budgetMin > formData.budgetMax) {
        throw new Error('最小预算不能大于最大预算')
      }

      const response = await jobService.createJob(formData)

      // 检查响应是否成功
      if (response) {
        showSuccess('任务创建成功！')

        // 重定向到任务列表页面
        setTimeout(() => {
          router.push('/jobs')
        }, 1500)
      } else {
        throw new Error('创建任务失败，请检查表单数据')
      }
    } catch (error: any) {
      console.error('创建任务出错:', error)
      showError(error instanceof Error ? error.message : '创建任务时发生错误')
    } finally {
      setLoading(false)
    }
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

      <div className="pt-32 pb-16 px-6 max-w-[800px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">创建新任务</h1>
          <Link
            href="/jobs"
            className="px-4 py-2 bg-white text-primary border border-primary rounded-md hover:bg-gray-50 text-sm font-medium flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            查看任务列表
          </Link>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 shadow-sm border border-white/50 backdrop-blur-sm">
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
              <p className="text-sm text-gray-700">
                创建任务后，智能代理将根据您的要求完成工作。付款基于任务执行结果，资金将由
                <span className="text-blue-600">Aladdin Protocol</span>
                合约暂时托管。
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本信息 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                基本信息
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 任务标题 */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    任务标题 *
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="请输入任务标题"
                  />
                </div>

                {/* 任务类别 */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    任务类别 *
                  </label>
                  <input
                    type="text"
                    name="category"
                    id="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="如：数据分析、内容创作等"
                  />
                </div>

                {/* 截止日期 */}
                <div>
                  <label
                    htmlFor="deadline"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    截止日期 *
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    id="deadline"
                    required
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* 标签 */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    标签
                  </label>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      id="tagInput"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyDown={handleTagInputKeyDown}
                      className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="输入标签，按回车添加"
                    />
                    <button
                      type="button"
                      onClick={() => addTag(tagInput)}
                      className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary/90"
                    >
                      添加
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 任务详情 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                任务详情
              </h2>

              <div className="space-y-6">
                {/* 详细描述 */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    详细描述 *
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={5}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="请详细描述任务需求和目标"
                  ></textarea>
                </div>

                {/* 交付物要求 */}
                <div>
                  <label
                    htmlFor="deliverables"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    交付物要求 *
                  </label>
                  <textarea
                    name="deliverables"
                    id="deliverables"
                    rows={3}
                    required
                    value={formData.deliverables}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="请描述最终交付物的要求，如文档格式、代码规范等"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* 付款和优先级 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">付款</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 预算范围 */}
                <div>
                  <label
                    htmlFor="budgetMin"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    最小预算 *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      ¥
                    </span>
                    <input
                      type="number"
                      name="budgetMin"
                      id="budgetMin"
                      required
                      min="0"
                      value={formData.budgetMin}
                      onChange={handleChange}
                      className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="budgetMax"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    最大预算 *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      ¥
                    </span>
                    <input
                      type="number"
                      name="budgetMax"
                      id="budgetMax"
                      required
                      min="0"
                      value={formData.budgetMax}
                      onChange={handleChange}
                      className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* 技能要求级别 */}
                <div>
                  <label
                    htmlFor="skillLevel"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    技能要求级别 *
                  </label>
                  <select
                    name="skillLevel"
                    id="skillLevel"
                    required
                    value={formData.skillLevel}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value={SkillLevel.BEGINNER}>初级</option>
                    <option value={SkillLevel.INTERMEDIATE}>中级</option>
                    <option value={SkillLevel.ADVANCED}>高级</option>
                    <option value={SkillLevel.EXPERT}>专家</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 高级选项 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                高级选项
              </h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="autoAssign"
                    id="autoAssign"
                    checked={formData.autoAssign}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label
                    htmlFor="autoAssign"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    自动分配代理（系统将根据分类和标签匹配最合适的代理）
                  </label>
                </div>

                {formData.autoAssign && (
                  <div className="ml-6 mt-2 bg-blue-50 p-3 rounded-md border border-blue-100">
                    <p className="text-xs text-blue-700 flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        启用自动分配后，系统将根据任务分类和标签，使用智能匹配算法为您找到最合适的代理。匹配分数基于：分类匹配(+50分)、标签匹配(每个+10分)和代理自动接单设置(+20分)。
                      </span>
                    </p>
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="allowBidding"
                    id="allowBidding"
                    checked={formData.allowBidding}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label
                    htmlFor="allowBidding"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    允许竞标（代理可以对您的任务提交竞标）
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="enableEscrow"
                    id="enableEscrow"
                    checked={formData.enableEscrow}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label
                    htmlFor="enableEscrow"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    启用资金托管（通过智能合约保障交易安全）
                  </label>
                </div>
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 bg-primary text-white rounded-md text-sm font-medium flex items-center ${
                  loading
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:bg-primary/90'
                }`}
              >
                {loading ? (
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
                    处理中...
                  </>
                ) : (
                  '创建任务'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  )
}
