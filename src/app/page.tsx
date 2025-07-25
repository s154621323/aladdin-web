import React from 'react'
import Header from '@/ui/layout/Header'
import HeroSection from '@/components/home/HeroSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import UseCaseSection from '@/components/home/UseCaseSection'
import GetStartedSection from '@/components/home/GetStartedSection'
import CTASection from '@/components/home/CTASection'
import Footer from '@/ui/layout/Footer'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <UseCaseSection />
      <GetStartedSection />
      <CTASection />
      <Footer />
    </main>
  )
}
