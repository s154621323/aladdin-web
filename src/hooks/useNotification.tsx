import { useState, useCallback } from 'react'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationState {
  type: NotificationType
  message: string
  visible: boolean
}

const initialState: NotificationState = {
  type: 'info',
  message: '',
  visible: false,
}

/**
 * 通知钩子，用于处理消息通知
 */
export default function useNotification() {
  const [notification, setNotification] =
    useState<NotificationState>(initialState)

  /**
   * 显示通知
   */
  const showNotification = useCallback(
    (type: NotificationType, message: string) => {
      setNotification({
        type,
        message,
        visible: true,
      })
    },
    []
  )

  /**
   * 隐藏通知
   */
  const hideNotification = useCallback(() => {
    setNotification((prev) => ({
      ...prev,
      visible: false,
    }))
  }, [])

  /**
   * 清除通知
   */
  const clearNotification = useCallback(() => {
    setNotification(initialState)
  }, [])

  /**
   * 显示成功通知
   */
  const showSuccess = useCallback(
    (message: string) => {
      showNotification('success', message)
    },
    [showNotification]
  )

  /**
   * 显示错误通知
   */
  const showError = useCallback(
    (message: string) => {
      showNotification('error', message)
    },
    [showNotification]
  )

  /**
   * 显示警告通知
   */
  const showWarning = useCallback(
    (message: string) => {
      showNotification('warning', message)
    },
    [showNotification]
  )

  /**
   * 显示信息通知
   */
  const showInfo = useCallback(
    (message: string) => {
      showNotification('info', message)
    },
    [showNotification]
  )

  /**
   * 自动隐藏通知（延迟）
   */
  const autoHideNotification = useCallback(
    (duration: number = 5000) => {
      if (notification.visible) {
        setTimeout(() => {
          hideNotification()
        }, duration)
      }
    },
    [notification.visible, hideNotification]
  )

  return {
    notification,
    showNotification,
    hideNotification,
    clearNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    autoHideNotification,
  }
}
