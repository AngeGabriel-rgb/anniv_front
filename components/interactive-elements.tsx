"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Gift, Star, Music, Heart, Sparkles } from "lucide-react"

export function InteractiveElements() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const specialOffers = [
    {
      title: "Offre Spéciale Couple",
      description: "Inscription à deux avec 20% de réduction sur l'offre VIP",
      icon: Heart,
      color: "from-pink-500 to-red-500",
      badge: "Limitée",
    },
    {
      title: "Cadeau Surprise",
      description: "Chaque invité repartira avec un souvenir personnalisé",
      icon: Gift,
      color: "from-purple-500 to-indigo-500",
      badge: "Inclus",
    },
    {
      title: "Playlist Collaborative",
      description: "Proposez vos musiques préférées pour la soirée",
      icon: Music,
      color: "from-green-500 to-teal-500",
      badge: "Nouveau",
    },
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Offres Spéciales
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Découvrez nos offres exclusives pour rendre cette soirée encore plus mémorable
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {specialOffers.map((offer, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                hoveredCard === index ? "transform rotate-1" : ""
              }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${offer.color} opacity-10`}></div>

              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-r ${offer.color} rounded-lg`}>
                    <offer.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="bg-white/80">
                    {offer.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">{offer.title}</CardTitle>
              </CardHeader>

              <CardContent className="relative">
                <p className="text-gray-600 mb-4">{offer.description}</p>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 bg-transparent"
                    >
                      En savoir plus
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <offer.icon className="w-6 h-6 text-purple-600" />
                        <span>{offer.title}</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-gray-700">{offer.description}</p>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">
                          Cette offre est valable jusqu'au 10 décembre 2024. Conditions générales applicables.
                        </p>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        Profiter de l'offre
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>

              {hoveredCard === index && (
                <div className="absolute top-2 right-2">
                  <Sparkles className="w-6 h-6 text-yellow-500 animate-spin" />
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="inline-block bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-800 mb-1">Inscription avant le 10 décembre</h3>
                  <p className="text-sm text-gray-600">Bénéficiez d'un cadeau de bienvenue supplémentaire</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
