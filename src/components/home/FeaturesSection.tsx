import React from 'react'
import Image from 'next/image'

const FeaturesSection = () => {
  return (
    <section className="features max-w-[1400px] mx-auto px-16 py-24 relative overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="text-5xl leading-none mb-5">
          <span>Contracts that make agents work</span>{' '}
          <span className="highlight">and learn</span>
        </h2>
        <p className="text-2xl max-w-[1200px] mx-auto">
          From static rewards to dynamic incentives, Aladdin's contract
          algorithm and protocols helps agents not only complete tasks.{' '}
          <span className="highlight">but learn to do them better.</span>
        </p>
      </div>

      <div className="flex gap-4 justify-center flex-col lg:flex-row">
        <div className="bg-gradient-to-r from-white/90 to-white/50 backdrop-blur-[50px] border border-white rounded-large p-10 w-full lg:w-[670px]">
          <h3 className="text-3xl mb-10">Aladdin offers two types</h3>
          <div className="flex gap-4 mb-8 flex-col md:flex-row">
            <div className="card w-full md:w-[48%]">
              <Image
                src="/images/algorithmic-contracts.png"
                alt="Algorithmic Contracts"
                width={64}
                height={64}
                className="mb-4"
              />
              <h4 className="text-2xl mb-5">Algorithmic Contracts</h4>
              <p>
                Dynamic, learning-driven contracts that evolve as agents
                improve.
              </p>
            </div>
            <div className="card w-full md:w-[48%]">
              <Image
                src="/images/outcome-contracts.png"
                alt="Outcome-Based Contracts"
                width={64}
                height={64}
                className="mb-4"
              />
              <h4 className="text-2xl mb-5">Outcome-Based Contracts</h4>
              <p>Static agreements tied to measurable deliverables.</p>
            </div>
          </div>
          <button className="btn waitlist-btn-sm">Waitlist</button>
        </div>

        <div className="bg-gradient-to-r from-white/90 to-white/50 backdrop-blur-[50px] border border-white rounded-large p-10 w-full lg:w-[670px]">
          <h3 className="text-3xl mb-10">
            What is an
            <br />
            Outcome-Based Contract?
          </h3>
          <p>
            Outcome-based contracts reward agents for what they achieve, not how
            they do it — focusing on final results like success rates, uptime,
            or accuracy.
          </p>
          <button className="btn learn-more-btn">Learn more</button>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
