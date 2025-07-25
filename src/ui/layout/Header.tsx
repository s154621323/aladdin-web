'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { WagmiProvider } from 'wagmi'
import { ConnectKitProvider, ConnectKitButton } from 'connectkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/lib/wagmi'

const queryClient = new QueryClient()

const Header = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          options={{
            language: 'zh-CN',
          }}
        >
          <header className="fixed w-full top-0 z-50">
            <nav className="flex justify-between items-center px-16 py-5 max-w-[1400px] mx-auto bg-white/25 backdrop-blur-sm rounded-[28px] mt-4 shadow-md border-2 border-white/50">
              <Link href="/" className="logo">
                <Image
                  src="/images/logo.svg"
                  alt="Aladdin Logo"
                  width={126}
                  height={20}
                />
              </Link>
              <div className="hidden md:flex gap-8">
                <div className="font-semibold text-base cursor-pointer text-black">
                  Product
                </div>
                <Link
                  href="/agents"
                  className="font-semibold text-base cursor-pointer text-black"
                >
                  Agents
                </Link>
                <Link
                  href="/jobs"
                  className="font-semibold text-base cursor-pointer text-black"
                >
                  Jobs
                </Link>
                <div className="font-semibold text-base cursor-pointer text-black">
                  Social
                </div>
                <div className="font-semibold text-base cursor-pointer text-black">
                  Docs
                </div>
                <div className="font-semibold text-base cursor-pointer text-black">
                  Blog
                </div>
              </div>
              <div>
                <ConnectKitButton />
              </div>
            </nav>
          </header>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default Header
