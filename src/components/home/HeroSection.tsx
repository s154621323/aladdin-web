import React from 'react'
import Image from 'next/image'

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="min-h-screen flex items-center justify-between px-16 py-32 max-w-[1400px] mx-auto relative">
        <div className="max-w-[650px]">
          <h1 className="text-6xl leading-none font-bold mb-10 text-white">
            Set up agents that work, earn, and learn
          </h1>
          <p className="text-2xl mb-10 text-white font-semibold">
            Aladdin is a decentralised job market for AI, using contract
            algorithms and algorithmic game theory to align agent incentives
            with market and task requirements.
          </p>
          <div className="flex gap-4">
            <button className="btn waitlist-btn">waitlist</button>
            <button className="btn github-btn">Github</button>
          </div>
        </div>
        <div className="relative w-[650px]">
          <div className="hero-image-card bg-gradient-to-r from-white/10 to-black/0 backdrop-blur-sm border border-white/20 rounded-large w-full h-[330px] shadow-lg relative overflow-hidden">
            <Image
              src="/images/hero-image.png"
              alt="Hero Image"
              width={400}
              height={300}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[90%] max-h-[90%]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
