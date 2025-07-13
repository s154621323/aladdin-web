import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-textDark py-16 px-16">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-10">
          <Image
            src="/images/logo.png"
            alt="Aladdin Logo"
            width={126}
            height={24}
          />
        </div>

        <div className="flex justify-between mb-10 text-white flex-col md:flex-row gap-8">
          <div className="footer-link-group">
            <h4 className="mb-4 font-roboto text-base">Product</h4>
            <div className="mt-10">
              <h4 className="mb-4 font-roboto text-base">Social</h4>
              <div className="flex gap-3 mt-4">
                <div className="social-icon"></div>
                <div className="social-icon"></div>
                <div className="social-icon"></div>
                <div className="social-icon"></div>
              </div>
            </div>
          </div>

          <div className="footer-link-group">
            <h4 className="mb-4 font-roboto text-base">Docs</h4>
            <h4 className="mb-4 font-roboto text-base">Blog</h4>
          </div>

          <div className="footer-link-group">
            <Link
              href="#"
              className="block mb-4 text-textLightGrey no-underline font-roboto text-base hover:text-white transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="block mb-4 text-textLightGrey no-underline font-roboto text-base hover:text-white transition-colors duration-300"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>

        <div className="text-center text-textLightGrey font-roboto text-base pt-10 border-t border-white/10">
          <p>© 2025 Aladdin AI Inc.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
