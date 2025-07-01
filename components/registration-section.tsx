"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Users, Clock, Gift, Sparkles } from "lucide-react"
import { RegistrationModal } from "./registration-modal"

export function RegistrationSection() {
  const [showRegistration, setShowRegistration] = useState(false)

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Rejoignez-nous !
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
            Inscription 100% gratuite pour cette soirée exceptionnelle
          </p>

          {/* Bouton d'inscription principal */}
          <Button
            onClick={() => setShowRegistration(true)}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 text-xl font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-4"
          >
            S'inscrire Gratuitement
            <Sparkles className="ml-3 w-6 h-6" />
          </Button>

          <p className="text-lg text-gray-600">Accès complet à l'événement • Dîner inclus • Spectacle et animations</p>
        </div>

        {/* Section informative */}
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">Places Limitées</h3>
            <p className="text-sm text-gray-600">Seulement 150 places disponibles</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">Inscription Rapide</h3>
            <p className="text-sm text-gray-600">Moins de 2 minutes</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-full">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">Cadeaux Inclus</h3>
            <p className="text-sm text-gray-600">Surprises pour tous</p>
          </div>
        </div>
      </div>

      <RegistrationModal open={showRegistration} onOpenChange={setShowRegistration} />
    </section>
  )
}
