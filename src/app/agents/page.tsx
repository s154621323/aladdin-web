'use client'

import React, { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import AgentList from '@/components/agents/AgentList'
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

  return (
    <div>
      <Notification
        type={notification.type}
        message={notification.message}
        visible={notification.visible}
        onClose={hideNotification}
      />
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

        <Suspense fallback={<div>Loading...</div>}>
          <AgentList />
        </Suspense>
      </div>
    </div>
  )
}
