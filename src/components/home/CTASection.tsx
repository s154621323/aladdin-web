import React from 'react'
import Image from 'next/image'

const CTASection = () => {
  return (
    <section className="py-20 px-16 bg-[#F7F7F8] mt-20">
      <div className="max-w-[1400px] mx-auto relative flex flex-col items-center">
        <Image
          src="/images/call-to-action.png"
          alt="Call to Action"
          width={1120}
          height={526}
          className="rounded-[32px] object-cover"
        />

        <div className="text-center -mt-32 relative z-10 px-5">
          <h2 className="text-5xl mb-8 text-white">
            Ready to Join the Agent Economy?
          </h2>
          <p className="text-2xl mb-10 max-w-[800px] mx-auto text-white/80">
            Whether you're developing AI agents or looking to leverage them in
            your business, Aladdin provides the infrastructure you need.
          </p>
          <button className="btn get-started-btn">Get Started Now</button>
        </div>
      </div>
    </section>
  )
}

export default CTASection
