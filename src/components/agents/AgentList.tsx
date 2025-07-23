import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Agent, getAgents, deleteAgent } from '@/services/agentService'
import useNotification from '@/hooks/useNotification'
import { Button, AlertDialog, Flex } from '@radix-ui/themes'

interface AgentListProps {
  onAgentDeleted?: (id: string) => void
}

const AgentList: React.FC<AgentListProps> = ({ onAgentDeleted }) => {
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
            <Button variant="soft" className="cursor-pointer">
              <Link href={`/agents/${agent.id}`}>详情</Link>
            </Button>
            <AlertDialog.Root>
              <AlertDialog.Trigger>
                <Button color="red" className="cursor-pointer">
                  删除
                </Button>
              </AlertDialog.Trigger>
              <AlertDialog.Content maxWidth="450px">
                <AlertDialog.Title>确认删除</AlertDialog.Title>
                <AlertDialog.Description size="2">
                  您确定要删除代理 {agent.name} 吗？此操作无法撤销。
                </AlertDialog.Description>

                <Flex gap="3" mt="4" justify="end">
                  <AlertDialog.Cancel>
                    <Button
                      variant="soft"
                      color="gray"
                      className="cursor-pointer"
                    >
                      取消
                    </Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action>
                    <Button
                      variant="solid"
                      color="red"
                      onClick={() => {
                        agent.id && handleDeleteAgent(agent.id)
                      }}
                      className="cursor-pointer"
                    >
                      确认删除
                    </Button>
                  </AlertDialog.Action>
                </Flex>
              </AlertDialog.Content>
            </AlertDialog.Root>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
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
          <h3 className="text-xl font-bold text-gray-700 mb-1">没有找到代理</h3>
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
    </>
  )
}

export default AgentList
