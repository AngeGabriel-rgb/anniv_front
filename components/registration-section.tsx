"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Users, Clock, Gift } from "lucide-react"
import { RegistrationModal } from "./registration-modal"

export function RegistrationSection() {
  const [showRegistration, setShowRegistration] = useState(false)

  const offers = [
    {
      title: "Inscription Standard",
      price: "Gratuit",
      features: ["Accès à toute la soirée", "Dîner inclus", "Spectacle et animations", "Photos souvenirs"],
      popular: false,
    },
    {
      title: "Inscription VIP",
      price: "25€",
      features: [
        "Tout de l'offre standard",
        "Cocktail de bienvenue",
        "Cadeau surprise",
        "Accès prioritaire",
        "Table réservée",
      ],
      popular: true,
    },
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Réservez Votre Place
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Choisissez votre formule et rejoignez-nous pour cette soirée exceptionnelle
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {offers.map((offer, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                offer.popular
                  ? "border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              {offer.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 text-sm font-semibold">
                  <Star className="inline w-4 h-4 mr-1" />
                  Populaire
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-800 mb-2">{offer.title}</CardTitle>
                <div className="text-3xl font-bold text-purple-600">{offer.price}</div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {offer.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => setShowRegistration(true)}
                  className={`w-full ${
                    offer.popular
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      : "bg-gray-800 hover:bg-gray-900"
                  } text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg`}
                >
                  Choisir cette formule
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

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
