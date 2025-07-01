"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Sparkles } from "lucide-react"
import { RegistrationModal } from "./registration-modal"

export function HeroSection() {
  const [showRegistration, setShowRegistration] = useState(false)

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://i.pinimg.com/736x/19/65/cc/1965ccb8e54fa6d673cf23108c02eb9f.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-orange-400 to-yellow-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-10 animate-spin-slow"></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <Sparkles className="w-16 h-16 mx-auto mb-6 text-white animate-bounce" />
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up drop-shadow-lg">
            Célébrons Ensemble
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 animate-slide-up delay-200 drop-shadow-md">
            Un anniversaire inoubliable vous attend
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-slide-up delay-400">
          <div className="flex items-center justify-center space-x-3 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Calendar className="w-6 h-6 text-purple-600" />
            <span className="font-semibold text-gray-800">15 Décembre 2024</span>
          </div>
          <div className="flex items-center justify-center space-x-3 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <MapPin className="w-6 h-6 text-pink-600" />
            <span className="font-semibold text-gray-800">Salle des Fêtes</span>
          </div>
          <div className="flex items-center justify-center space-x-3 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Users className="w-6 h-6 text-orange-600" />
            <span className="font-semibold text-gray-800">150 Invités</span>
          </div>
        </div>

        <Button
          onClick={() => setShowRegistration(true)}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse-gentle"
        >
          S'inscrire maintenant
          <Sparkles className="ml-2 w-5 h-5" />
        </Button>

        {/* Mobile floating button */}
        <div className="fixed bottom-6 right-6 md:hidden z-50">
          <Button
            onClick={() => setShowRegistration(true)}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-bounce"
          >
            <Sparkles className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <RegistrationModal open={showRegistration} onOpenChange={setShowRegistration} />
    </section>
  )
}
