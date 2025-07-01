"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Utensils, Gift, Camera, Heart } from "lucide-react"

export function EventInfo() {
  const programItems = [
    { time: "18h00", activity: "Accueil et cocktail", icon: Utensils },
    { time: "19h30", activity: "Dîner festif", icon: Utensils },
    { time: "21h00", activity: "Spectacle surprise", icon: Music },
    { time: "22h00", activity: "Piste de danse", icon: Music },
    { time: "23h00", activity: "Remise des cadeaux", icon: Gift },
  ]

  return (
    <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Programme de la Soirée
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Une soirée mémorable vous attend avec des surprises à chaque moment
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {programItems.map((item, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-purple-50 border-purple-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-purple-800">{item.time}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 font-medium">{item.activity}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-purple-800">
                <Camera className="w-6 h-6" />
                <span>Souvenirs Immortalisés</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Photographe professionnel présent toute la soirée pour capturer vos plus beaux moments. Photos
                disponibles en ligne dès le lendemain.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-100 to-yellow-100 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-800">
                <Heart className="w-6 h-6" />
                <span>Ambiance Chaleureuse</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Décoration soignée, éclairage tamisé et musique d'ambiance pour créer une atmosphère magique et
                conviviale.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
