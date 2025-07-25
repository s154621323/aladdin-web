import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Theme } from '@radix-ui/themes'
import Header from '@/ui/layout/Header'
import Footer from '@/ui/layout/Footer'
import { inter, openSans, roboto } from '@/ui/fonts'

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
    <html lang="en">
      <body
        className={`${inter.className} ${openSans.className} ${roboto.className}`}
      >
        <Theme>
          <Header />
          {children}
          <Footer />
        </Theme>
      </body>
    </html>
  )
}
