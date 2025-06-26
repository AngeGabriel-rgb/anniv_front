"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PartyPopper, ArrowRight, Star, Gift, Users, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                <PartyPopper className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Idea</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                À propos
              </a>
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Fonctionnalités
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-pink-500/20 blur-3xl"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0">
              <Star className="w-4 h-4 mr-2" />
              Plateforme d'Événements 2025
            </Badge>
            <div className="flex justify-center mb-6">
              <PartyPopper className="h-16 w-16 text-rose-400" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Bienvenue !
              <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent block text-4xl md:text-5xl mt-2">
                Célébrons ensemble
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Rejoignez notre plateforme d'événements d'anniversaire et participez à des moments magiques de partage et
              de joie.
            </p>

            {/* CTA Section */}
            <div className="flex flex-col items-center space-y-8">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-8 max-w-md w-full hover:bg-white/10 transition-all duration-300">
                <CardContent className="text-center space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto border border-rose-500/30">
                    <PartyPopper className="w-8 h-8 text-rose-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-3">Espace Participant</h2>
                    <p className="text-gray-300 mb-6">
                      Accédez à vos invitations, confirmez votre présence et découvrez les événements à venir
                    </p>
                  </div>
                  <Link href="/participant" className="block">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0 py-6 text-lg font-semibold group"
                    >
                      Accéder à mon espace
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Fonctionnalités</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Découvrez tout ce que notre plateforme peut vous offrir
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Calendar className="w-8 h-8" />,
                title: "Gestion d'Événements",
                description: "Organisez et suivez tous vos événements d'anniversaire en un seul endroit",
                color: "text-rose-400",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Invitations Simplifiées",
                description: "Envoyez et gérez les invitations facilement avec un système de confirmation",
                color: "text-pink-400",
              },
              {
                icon: <Gift className="w-8 h-8" />,
                title: "Expérience Personnalisée",
                description: "Chaque participant dispose d'un espace personnel pour gérer ses participations",
                color: "text-violet-400",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                <CardContent className="p-8">
                  <div className={`${feature.color} mb-4`}>{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
