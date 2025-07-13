import React from 'react'
import Header from '@/components/layout/Header'
import HeroSection from '@/components/home/HeroSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import UseCaseSection from '@/components/home/UseCaseSection'
import GetStartedSection from '@/components/home/GetStartedSection'
import CTASection from '@/components/home/CTASection'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <main>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <UseCaseSection />
      <GetStartedSection />
      <CTASection />
      <Footer />
    </main>
  )
}
