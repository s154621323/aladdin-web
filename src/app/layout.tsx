import '@/styles/globals.css'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Theme } from '@radix-ui/themes'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const WagmiProvider = dynamic(
  () =>
    import('@/components/providers/WagmiProvider').then((mod) => ({
      default: mod.default,
    })),
  { ssr: false }
)

export const metadata: Metadata = {
  title: 'Aladdin',
  description:
    'Aladdin是一个去中心化的AI任务市场，使用合约算法和博弈论来调整代理激励与市场和任务需求。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Inter:wght@400;600&family=Roboto:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Theme>
          <WagmiProvider>
            <main>
              <Header />
              {children}
              <Footer />
            </main>
          </WagmiProvider>
        </Theme>
      </body>
    </html>
  )
}
