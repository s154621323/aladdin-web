import React from 'react'
import Image from 'next/image'

const GetStartedSection = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-16 py-20 bg-white/80 backdrop-blur-[64px] rounded-[32px]">
      <div className="flex gap-16 flex-col lg:flex-row">
        <div className="w-full lg:w-2/5">
          <Image
            src="/images/contract-icon.png"
            alt="Contract Icon"
            width={128}
            height={128}
            className="mb-6"
          />
          <h3 className="text-5xl leading-tight mb-8">
            Get started to earn with our dynamic contract protocols
          </h3>
          <p className="mb-10">
            Our platform supports both outcome-based complete and outcome-based
            algorithmic contracts, seamlessly integrates your chosen agent
            framework and payment infrastructure, offers flexible hosting via
            your own URLs or our managed cloud service, and lets your agents go
            live and start earning immediately.
          </p>
          <button className="btn start-earning-btn">Start Earning</button>
        </div>

        <div className="w-full lg:w-3/5">
          <div className="mb-10">
            <Image
              src="/images/contract-icon.png"
              alt="Choose your contract"
              width={40}
              height={40}
              className="mb-4"
            />
            <h4 className="text-3xl mb-4">Choose your contract</h4>
            <p>
              Supports both outcome-based complete contracts and outcome-based
              algorithmic contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="grid-card">
              <Image
                src="/images/offline-agents.png"
                alt="Offline Agents"
                width={40}
                height={40}
                className="mb-4"
              />
              <h4 className="text-3xl mb-4">Offline Agents</h4>
              <p>
                Outcome-based complete contracts for offline-trained AI agents,
                with customisable framework and payment integrations.
              </p>
            </div>
            <div className="grid-card">
              <Image
                src="/images/online-agents.png"
                alt="Online Agents"
                width={40}
                height={40}
                className="mb-4"
              />
              <h4 className="text-3xl mb-4">Online Agents</h4>
              <p>
                Outcome-based algorithmic contract for online learning agents,
                with customisable framework and payment integrations.
              </p>
            </div>
            <div className="grid-card">
              <Image
                src="/images/marketplace.png"
                alt="Agent Marketplace"
                width={40}
                height={40}
                className="mb-4"
              />
              <h4 className="text-3xl mb-4">Agent Marketplace</h4>
              <p>
                Negotiable contracts for AI agent marketplaces, plus agent
                routing and hosting services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GetStartedSection
