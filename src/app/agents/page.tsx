'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Agent, getAgents, deleteAgent } from '@/services/agentService'
import useNotification from '@/hooks/useNotification'
import Notification from '@/components/ui/Notification'

export default function AgentsListPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  )
  const { notification, showSuccess, showError, hideNotification } =
    useNotification()

  useEffect(() => {
    fetchAgents()
  }, [])

  // 获取代理列表
  async function fetchAgents() {
    try {
      setLoading(true)
      const response = await getAgents()

      if (response.error) {
        throw new Error(response.error.message)
      }

      setAgents(response.data || [])
    } catch (error) {
      console.error('Error fetching agents:', error)
      showError(error instanceof Error ? error.message : '获取代理列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 删除代理
  async function handleDeleteAgent(id: string) {
    try {
      setDeleteLoading(id)
      await deleteAgent(id)
      showSuccess('代理删除成功')

      // 更新代理列表
      setAgents(agents.filter((agent) => agent.id !== id))
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting agent:', error)
      showError(error instanceof Error ? error.message : '删除代理失败')
    } finally {
      setDeleteLoading(null)
    }
  }

  // 筛选和搜索逻辑
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.classification.toLowerCase().includes(searchTerm.toLowerCase())

    if (filter === 'all') return matchesSearch
    if (filter === 'free') return matchesSearch && agent.isFree
    if (filter === 'paid') return matchesSearch && !agent.isFree

    return matchesSearch
  })

  // 渲染删除确认对话框
  const renderDeleteConfirmDialog = () => {
    if (!showDeleteConfirm) return null

    const agent = agents.find((a) => a.id === showDeleteConfirm)
    if (!agent) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-xl font-bold text-gray-800 mb-4">确认删除</h3>
          <p className="text-gray-600 mb-6">
            您确定要删除代理 <span className="font-semibold">{agent.name}</span>{' '}
            吗？此操作无法撤销。
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              disabled={deleteLoading === showDeleteConfirm}
            >
              取消
            </button>
            <button
              onClick={() => handleDeleteAgent(showDeleteConfirm)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              disabled={deleteLoading === showDeleteConfirm}
            >
              {deleteLoading === showDeleteConfirm ? (
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

  // 渲染每个代理卡片
  const renderAgentCard = (agent: Agent) => {
    return (
      <div
        key={agent.id}
        className="grid-card hover:shadow-xl transition-all duration-300 flex flex-col"
      >
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-gray-800">{agent.name}</h3>
          <div
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              agent.isFree
                ? 'bg-green-100 text-green-800'
                : 'bg-purple-100 text-purple-800'
            }`}
          >
            {agent.isFree ? 'Free' : 'Paid'}
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-2 flex-grow">
          {agent.description || 'No description provided'}
        </p>

        <div className="flex flex-wrap gap-2 my-3">
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

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            <span className="font-medium">{agent.classification}</span>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/agents/${agent.id}`}
              className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
            >
              详情
            </Link>
            <button
              onClick={() => agent.id && setShowDeleteConfirm(agent.id)}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              删除
            </button>
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

      {renderDeleteConfirmDialog()}

      <div className="pt-32 pb-16 px-6 max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">探索 AI Agent </h1>
          <Link
            href="/agents/create"
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
            部署Agent
          </Link>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-sm border border-white/50 backdrop-blur-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="搜索代理..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
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
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm ${
                  filter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setFilter('free')}
                className={`px-4 py-2 rounded-md text-sm ${
                  filter === 'free'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                免费
              </button>
              <button
                onClick={() => setFilter('paid')}
                className={`px-4 py-2 rounded-md text-sm ${
                  filter === 'paid'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                付费
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredAgents.length === 0 ? (
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
              没有找到代理
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? '尝试使用不同的搜索关键词'
                : '目前没有可用的代理，请创建一个新的代理'}
            </p>
            <Link
              href="/agents/create"
              className="mt-6 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 text-sm font-medium"
            >
              部署新代理
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map(renderAgentCard)}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
