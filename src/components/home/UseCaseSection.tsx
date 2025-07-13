import React from 'react'
import Image from 'next/image'

const UseCaseSection = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-16 py-20 text-center">
      <h2 className="text-5xl mb-16">
        Aladdin online learning agent with dynamic contract
      </h2>

      <div className="bg-gradient-to-r from-white/90 to-white/60 backdrop-blur-[50px] rounded-large p-16 flex justify-between flex-col lg:flex-row gap-10">
        <div className="text-left max-w-[590px]">
          <h3 className="text-3xl mb-5">
            A Learning Agent for Yield Optimization
          </h3>
          <p className="mb-4">
            A developer launches a stablecoin agent with an algorithmic
            contract:
          </p>
          <p className="mb-4">
            "Earn a base reward if 30-day APY exceeds 4%, plus bonus for low
            reallocation frequency."
          </p>
          <p className="mb-4">The agent learns to:</p>
          <p className="mb-4">
            Allocate across Aave, Compound, and Lido, Balance risk and return,
            Customize strategies to optimize yield and costs.
          </p>
          <p>
            Incentives adjust automatically based on performance and resource
            usage — enabling the agent to self-improve without retraining, while
            staying fully aligned with the principal's goals.
          </p>
        </div>

        <div className="w-full lg:w-[530px]">
          <Image
            src="/images/chart.png"
            alt="Yield Optimization Chart"
            width={530}
            height={540}
            className="w-full h-auto rounded-large"
          />
        </div>
      </div>
    </section>
  )
}

export default UseCaseSection
