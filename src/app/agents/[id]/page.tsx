'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Agent, getAgent, deleteAgent } from '@/services/agentService'
import useNotification from '@/hooks/useNotification'
import Notification from '@/components/ui/Notification'

export default function AgentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { notification, showSuccess, showError, hideNotification } =
    useNotification()

  useEffect(() => {
    if (id) {
      fetchAgentDetails()
    }
  }, [id])

  // 获取代理详情
  async function fetchAgentDetails() {
    try {
      setLoading(true)
      const response = await getAgent(id)

      if (response.error) {
        throw new Error(response.error.message)
      }

      setAgent(response.data || null)
    } catch (error) {
      console.error('Error fetching agent details:', error)
      showError(error instanceof Error ? error.message : '获取代理详情失败')
    } finally {
      setLoading(false)
    }
  }

  // 删除代理
  async function handleDeleteAgent() {
    try {
      setDeleteLoading(true)
      await deleteAgent(id)
      showSuccess('代理删除成功')

      // 删除成功后返回代理列表页
      setTimeout(() => {
        router.push('/agents')
      }, 1500)
    } catch (error) {
      console.error('Error deleting agent:', error)
      showError(error instanceof Error ? error.message : '删除代理失败')
      setDeleteLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  // 渲染删除确认对话框
  const renderDeleteConfirmDialog = () => {
    if (!showDeleteConfirm) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-xl font-bold text-gray-800 mb-4">确认删除</h3>
          <p className="text-gray-600 mb-6">
            您确定要删除代理{' '}
            <span className="font-semibold">{agent?.name}</span>{' '}
            吗？此操作无法撤销。
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              disabled={deleteLoading}
            >
              取消
            </button>
            <button
              onClick={handleDeleteAgent}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <span className="flex items-center">
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
                  删除中...
                </span>
              ) : (
                '确认删除'
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f0f4f9]">
        <Header />
        <div className="pt-32 pb-16 px-6 max-w-[1000px] mx-auto">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!agent) {
    return (
      <main className="min-h-screen bg-[#f0f4f9]">
        <Header />
        <div className="pt-32 pb-16 px-6 max-w-[1000px] mx-auto">
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
            <h3 className="text-xl font-bold text-gray-700 mb-1">代理不存在</h3>
            <p className="text-gray-500 mb-6">找不到该代理或已被删除</p>
            <Link
              href="/agents"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 text-sm font-medium"
            >
              返回代理列表
            </Link>
          </div>
        </div>
        <Footer />
      </main>
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

      {renderDeleteConfirmDialog()}

      <div className="pt-32 pb-16 px-6 max-w-[1000px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Link href="/agents" className="text-gray-500 hover:text-gray-700">
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
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">代理详情</h1>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/agents/${id}/edit`}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              编辑
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              删除
            </button>
            <Link
              href={`/agents/${id}/deploy`}
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
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              部署
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 shadow-sm border border-white/50 backdrop-blur-sm mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-2/3">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {agent.name}
                </h2>
                <div
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    agent.isFree
                      ? 'bg-green-100 text-green-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {agent.isFree ? '免费' : '付费'}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {agent.tags &&
                  agent.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 px-2 py-1 rounded-md text-xs text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
              </div>

              <div className="bg-white rounded-lg p-5 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  描述
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {agent.description || '暂无描述'}
                </p>
              </div>

              <div className="bg-white rounded-lg p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  作者简介
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {agent.authorBio || '暂无作者信息'}
                </p>
              </div>
            </div>

            <div className="w-full md:w-1/3">
              <div className="bg-white rounded-lg p-5 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  基本信息
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">分类</p>
                    <p className="text-gray-800 font-medium">
                      {agent.classification}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">地址</p>
                    <p className="text-gray-800 font-medium break-all">
                      {agent.address}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">自动接受任务</p>
                    <p className="text-gray-800 font-medium">
                      {agent.autoAcceptJobs ? '是' : '否'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">创建时间</p>
                    <p className="text-gray-800 font-medium">
                      {agent.createdAt
                        ? new Date(agent.createdAt).toLocaleString('zh-CN')
                        : '未知'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">更新时间</p>
                    <p className="text-gray-800 font-medium">
                      {agent.updatedAt
                        ? new Date(agent.updatedAt).toLocaleString('zh-CN')
                        : '未知'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  操作
                </h3>
                <div className="space-y-3">
                  <Link
                    href={`/jobs/create?agentId=${agent.id}`}
                    className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 text-sm font-medium flex items-center justify-center gap-1"
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
                  <Link
                    href={`/agents/${id}/jobs`}
                    className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center justify-center gap-1"
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
                    查看相关任务
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
