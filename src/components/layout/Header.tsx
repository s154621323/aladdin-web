import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  return (
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
        <div className="waitlist-btn">
          <span>waitlist</span>
        </div>
      </nav>
    </header>
  )
}

export default Header
