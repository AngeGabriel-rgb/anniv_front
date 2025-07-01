import { HeroSection } from "@/components/hero-section"
import { EventInfo } from "@/components/event-info"
import { RegistrationSection } from "@/components/registration-section"
import { InteractiveElements } from "@/components/interactive-elements"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <HeroSection />
      <EventInfo />
      <RegistrationSection />
      <InteractiveElements />
    </main>
  )
}
