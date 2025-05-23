"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Gift, PartyPopper, Users, Check } from "lucide-react"
import { registerParticipant, loginParticipant } from "@/lib/auth"
import type { RegisterFormData, LoginFormData } from "../types"

export default function Home() {
  const router = useRouter()
  const [showSpecialOffer, setShowSpecialOffer] = useState<boolean>(true)
  const [registerError, setRegisterError] = useState<string>("")
  const [loginError, setLoginError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  // Ajouter un état pour contrôler l'affichage du popup de confirmation
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
  const [registeredParticipant, setRegisteredParticipant] = useState<RegisterFormData | null>(null)

  // Modifier la fonction handleRegister pour afficher le popup après inscription réussie
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
      // Ne pas rediriger immédiatement pour montrer le popup
      // router.push("/participant/dashboard")
    } catch (err) {
      setRegisterError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  // Ajouter cette fonction pour gérer la redirection après confirmation
  const handleConfirmationClose = () => {
    setShowConfirmation(false)
    router.push("/participant/dashboard")
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

  return (
    <main className="min-h-screen relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=3540')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.3)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Special Offer Popup */}
        <Dialog open={showSpecialOffer} onOpenChange={setShowSpecialOffer}>
          <DialogContent className="mx-4 max-w-[calc(100%-2rem)] sm:mx-0 sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-rose-500" />
                Rejoignez-moi pour célébrer !
              </DialogTitle>
            </DialogHeader>
            <div className="p-4 sm:p-6 text-center text-white bg-black/10 backdrop-blur-lg rounded-lg shadow-lg">
              <p className="text-base sm:text-lg text-white">
                Une année de plus de rires, d{"'"}aventures et de souvenirs !
              </p>
              <p className="mt-2 text-xs sm:text-sm text-white">Confirmez votre présence avant le 20 avril 2024</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Confirmation Popup */}
        {/* <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="mx-4 max-w-[calc(100%-2rem)] sm:mx-0 sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <PartyPopper className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                Inscription réussie !
              </DialogTitle>
            </DialogHeader>
            <div className="p-4 sm:p-6 text-center text-white bg-black/10 backdrop-blur-lg rounded-lg shadow-lg">
              <p className="text-base sm:text-lg text-white">
                Merci {registeredParticipant?.name}, votre participation a bien été enregistrée.
              </p>
              <p className="mt-2 text-xs sm:text-sm text-white">
                Vous allez être redirigé vers votre tableau de bord.
              </p>
            </div>
            <Button onClick={handleConfirmationClose} className="w-full bg-green-500 hover:bg-green-600">
              Accéder au tableau de bord
            </Button>
          </DialogContent>
        </Dialog> */}

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 sm:py-32 text-center">
          <div className="flex justify-center">
            <PartyPopper className="h-12 w-12 sm:h-16 sm:w-16 text-rose-400" />
          </div>
          <h1 className="mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl font-bold text-white">HappyBurst</h1>
          <p className="mt-3 sm:mt-4 text-lg sm:text-xl text-gray-200 px-4">Partageons ensemble ce moment spécial</p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600">
                  Je participe !
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 max-w-[calc(100%-2rem)] sm:mx-0 sm:max-w-md">
                <Tabs defaultValue="register" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="register">Inscription</TabsTrigger>
                    <TabsTrigger value="login">Connexion</TabsTrigger>
                  </TabsList>
                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nom complet</Label>
                        <Input id="name" name="name" type="text" className="mt-1.5" required />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" className="mt-1.5" required />
                      </div>
                      <div>
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input id="password" name="password" type="password" className="mt-1.5" required />
                      </div>
                      <div>
                        <Label htmlFor="guests">Nombre d{"'"}invités</Label>
                        <Input id="guests" name="guests" type="number" defaultValue="0" min="0" className="mt-1.5" />
                      </div>
                      {registerError && <div className="text-sm text-red-500 text-center">{registerError}</div>}
                      <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600" disabled={loading}>
                        {loading ? "Traitement en cours..." : "Confirmer ma présence"}
                      </Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="login-email">Email</Label>
                        <Input id="login-email" name="email" type="email" className="mt-1.5" required />
                      </div>
                      <div>
                        <Label htmlFor="login-password">Mot de passe</Label>
                        <Input id="login-password" name="password" type="password" className="mt-1.5" required />
                      </div>
                      {loginError && <div className="text-sm text-red-500 text-center">{loginError}</div>}
                      <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600" disabled={loading}>
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
              className="w-full sm:w-auto bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              Plus d{"'"}informations
            </Button>
          </div>
          <div className="mt-4 text-sm text-gray-300">
            <Link href="/auths/admin/login" className="hover:underline">
              Accès administrateur
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-12 sm:py-20">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white/10 backdrop-blur-lg p-5 sm:p-6 shadow-lg text-center sm:text-left border border-white/10">
              <div className="flex justify-center sm:justify-start">
                <CalendarDays className="h-10 w-10 sm:h-12 sm:w-12 text-rose-400" />
              </div>
              <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold text-white">Quand & Où</h3>
              <p className="mt-2 text-sm sm:text-base text-gray-200">
                vendredi 04 avril 2024 à 19h
                <br />
                Restaurant {'"'}ble doré{'"'}
              </p>
            </div>
            <div className="rounded-lg bg-white/10 backdrop-blur-lg p-5 sm:p-6 shadow-lg text-center sm:text-left border border-white/10">
              <div className="flex justify-center sm:justify-start">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-rose-400" />
              </div>
              <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold text-white">Ambiance</h3>
              <p className="mt-2 text-sm sm:text-base text-gray-200">
                Soirée décontractée
                <br />
                Entre amis et famille
              </p>
            </div>
            <div className="rounded-lg bg-white/10 backdrop-blur-lg p-5 sm:p-6 shadow-lg text-center sm:text-left border border-white/10">
              <div className="flex justify-center sm:justify-start">
                <Gift className="h-10 w-10 sm:h-12 sm:w-12 text-rose-400" />
              </div>
              <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold text-white">Au Programme</h3>
              <p className="mt-2 text-sm sm:text-base text-gray-200">
                Dîner, Musique & Danse
                <br />
                Moments de partage
              </p>
            </div>
          </div>
        </section>
      </div>
      {/* Popup de confirmation après inscription */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="mx-4 max-w-[calc(100%-2rem)] sm:mx-0 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
              <PartyPopper className="h-5 w-5 sm:h-6 sm:w-6 text-rose-500" />
              Inscription réussie !
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>

            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Merci {registeredParticipant?.name} !</h3>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Votre inscription a été enregistrée avec succès. Nous sommes ravis de vous compter parmi nos invités !
            </p>

            {registeredParticipant?.guests && registeredParticipant.guests > 0 && (
              <div className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded-md">
                <p className="text-sm text-rose-700 dark:text-rose-300">
                  Vous avez indiqué venir avec {registeredParticipant.guests}{" "}
                  {registeredParticipant.guests > 1 ? "invités" : "invité"}.
                </p>
              </div>
            )}

            <div className="text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <p>
                Un email de confirmation a été envoyé à{" "}
                <span className="font-medium">{registeredParticipant?.email}</span>
              </p>
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button onClick={handleConfirmationClose} className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600">
              Accéder à mon espace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
