"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Gift, PartyPopper, Users, Check, Star, ArrowRight, MapPin, Music, Utensils } from "lucide-react"
import { registerParticipant, loginParticipant } from "@/lib/auth"
import type { RegisterFormData, LoginFormData } from "../types"

export default function Home() {
  const router = useRouter()
  const [registerError, setRegisterError] = useState<string>("")
  const [loginError, setLoginError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
  const [registeredParticipant, setRegisteredParticipant] = useState<RegisterFormData | null>(null)

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setRegisterError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data: RegisterFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      guests: Number(formData.get("guests") || 0),
    }

    try {
      await registerParticipant(data)
      setRegisteredParticipant(data)
      setShowConfirmation(true)
    } catch (err) {
      setRegisterError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoginError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data: LoginFormData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    try {
      await loginParticipant(data)
      router.push("/participant/dashboard")
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmationClose = () => {
    setShowConfirmation(false)
    router.push("/participant/dashboard")
  }

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
              <span className="text-xl font-bold text-white">IDEA</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#details" className="text-gray-300 hover:text-white transition-colors">
                Détails
              </Link>
              <Link href="#programme" className="text-gray-300 hover:text-white transition-colors">
                Programme
              </Link>
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
              Événement Spécial 2025
            </Badge>
            <div className="flex justify-center mb-6">
              <PartyPopper className="h-16 w-16 text-rose-400" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              IDEA
              <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent block text-4xl md:text-5xl mt-2">
                Partageons ensemble ce moment spécial
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Rejoignez-nous pour une soirée inoubliable remplie de joie, de partage et de moments magiques entre amis
              et famille.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0 px-8 py-6 text-lg font-semibold group w-full sm:w-auto"
                  >
                    Je participe !
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="mx-4 max-w-[calc(100%-2rem)] sm:mx-0 sm:max-w-md bg-gradient-to-br from-slate-900 to-purple-900 border-white/20 text-white">
                  <Tabs defaultValue="register" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white/10">
                      <TabsTrigger
                        value="register"
                        className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
                      >
                        Inscription
                      </TabsTrigger>
                      <TabsTrigger
                        value="login"
                        className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
                      >
                        Connexion
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="register">
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                          <Label htmlFor="name" className="text-gray-200">
                            Nom complet
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            className="mt-1.5 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-gray-200">
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            className="mt-1.5 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="password" className="text-gray-200">
                            Mot de passe
                          </Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            className="mt-1.5 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="guests" className="text-gray-200">
                            Nombre d'invités
                          </Label>
                          <Input
                            id="guests"
                            name="guests"
                            type="number"
                            defaultValue="0"
                            min="0"
                            className="mt-1.5 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </div>
                        {registerError && (
                          <div className="text-sm text-red-400 text-center bg-red-500/10 p-2 rounded">
                            {registerError}
                          </div>
                        )}
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                          disabled={loading}
                        >
                          {loading ? "Traitement en cours..." : "Confirmer ma présence"}
                        </Button>
                      </form>
                    </TabsContent>
                    <TabsContent value="login">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <Label htmlFor="login-email" className="text-gray-200">
                            Email
                          </Label>
                          <Input
                            id="login-email"
                            name="email"
                            type="email"
                            className="mt-1.5 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="login-password" className="text-gray-200">
                            Mot de passe
                          </Label>
                          <Input
                            id="login-password"
                            name="password"
                            type="password"
                            className="mt-1.5 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            required
                          />
                        </div>
                        {loginError && (
                          <div className="text-sm text-red-400 text-center bg-red-500/10 p-2 rounded">{loginError}</div>
                        )}
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                          disabled={loading}
                        >
                          {loading ? "Connexion en cours..." : "Se connecter"}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg w-full sm:w-auto"
              >
                Plus d'informations
              </Button>
            </div>

            {/* Event Info Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <CalendarDays className="w-8 h-8 text-rose-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Date & Heure</h3>
                  <p className="text-gray-300">Vendredi 01 juillet 2025</p>
                  <p className="text-gray-400 text-sm">19h00</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <MapPin className="w-8 h-8 text-pink-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Lieu</h3>
                  <p className="text-gray-300">Restaurant</p>
                  <p className="text-gray-400 text-sm">"La sabliere"</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-violet-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Ambiance</h3>
                  <p className="text-gray-300">Soirée décontractée</p>
                  <p className="text-gray-400 text-sm">Entre amis et famille</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20" id="programme">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Au Programme</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">Une soirée riche en émotions et en partage</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Utensils className="w-8 h-8" />,
                title: "Dîner Gastronomique",
                description: "Un menu raffiné préparé avec soin pour régaler tous les palais",
                color: "text-rose-400",
              },
              {
                icon: <Music className="w-8 h-8" />,
                title: "Musique & Danse",
                description: "Ambiance musicale variée pour danser et s'amuser toute la soirée",
                color: "text-pink-400",
              },
              {
                icon: <Gift className="w-8 h-8" />,
                title: "Moments de Partage",
                description: "Des instants privilégiés pour se retrouver et créer de beaux souvenirs",
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
      <footer className="border-t border-white/10 bg-black/40">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 IDEA. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Popup de confirmation après inscription */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="mx-4 max-w-[calc(100%-2rem)] sm:mx-0 sm:max-w-md bg-gradient-to-br from-slate-900 to-purple-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
              <PartyPopper className="h-5 w-5 sm:h-6 sm:w-6 text-rose-500" />
              Inscription réussie !
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-400" />
            </div>

            <h3 className="text-lg font-medium text-white">Merci {registeredParticipant?.name} !</h3>

            <p className="text-sm text-gray-300">
              Votre inscription a été enregistrée avec succès. Nous sommes ravis de vous compter parmi nos invités !
            </p>

            {registeredParticipant?.guests && registeredParticipant.guests > 0 && (
              <div className="bg-rose-500/20 p-3 rounded-md border border-rose-500/30">
                <p className="text-sm text-rose-300">
                  Vous avez indiqué venir avec {registeredParticipant.guests}{" "}
                  {registeredParticipant.guests > 1 ? "invités" : "invité"}.
                </p>
              </div>
            )}

            <div className="text-sm text-gray-400 border-t border-white/10 pt-4 mt-4">
              <p>
                Un email de confirmation a été envoyé à{" "}
                <span className="font-medium text-white">{registeredParticipant?.email}</span>
              </p>
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={handleConfirmationClose}
              className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
            >
              Accéder à mon espace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
