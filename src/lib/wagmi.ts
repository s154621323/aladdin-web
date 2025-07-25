import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit'
import { injected, metaMask } from 'wagmi/connectors'

export const config = createConfig(
  getDefaultConfig({
    appName: '数据上链 DApp',
    walletConnectProjectId: process.env.WALLETCONNECT_PROJECT_ID!,
    chains: [sepolia],
    connectors: [injected(), metaMask()],
    transports: {
      [sepolia.id]: http(),
    },
  })
)
