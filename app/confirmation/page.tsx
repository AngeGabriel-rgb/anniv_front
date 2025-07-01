"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, MapPin, Mail, Home } from "lucide-react"
import Link from "next/link"

export default function ConfirmationPage() {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              🎉
            </div>
          ))}
        </div>
      )}

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6 p-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-full w-fit">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Inscription Confirmée !
          </CardTitle>
          <p className="text-xl text-gray-700">
            Félicitations ! Votre inscription à l'événement a été enregistrée avec succès.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-4 text-purple-800">Détails de votre inscription :</h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="font-medium">15 Décembre 2024 à 18h00</span>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-pink-600" />
                <span className="font-medium">Salle des Fêtes, Centre-ville</span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-600" />
                <span className="font-medium">Email de confirmation envoyé</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Prochaines étapes :</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Vérifiez votre boîte email pour la confirmation</li>
              <li>• Ajoutez l'événement à votre calendrier</li>
              <li>• Préparez-vous pour une soirée inoubliable !</li>
            </ul>
          </div>

          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Vous recevrez un rappel par email 48h avant l'événement avec tous les détails pratiques.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </Link>
              </Button>

              <Button variant="outline" asChild>
                <a href="mailto:contact@event.com">
                  <Mail className="w-4 h-4 mr-2" />
                  Nous contacter
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
