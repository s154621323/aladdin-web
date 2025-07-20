'use client'

import { WagmiProvider as WagmiProviderBase } from 'wagmi'
import { config } from '@/lib/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const queryClient = new QueryClient()

interface WagmiProviderProps {
  children: React.ReactNode
}

export default function WagmiProvider({ children }: WagmiProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProviderBase config={config}>{children}</WagmiProviderBase>
    </QueryClientProvider>
  )
}
