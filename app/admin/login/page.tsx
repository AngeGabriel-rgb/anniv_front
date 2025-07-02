"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Mail, Shield, Loader2, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { tokenManager, loginAdmin } from "@/lib/api"
import Link from "next/link"

export default function AdminLogin() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const token = tokenManager.getToken("admin")
    if (token) {
      router.push("/admin/dashboard")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!credentials.email || !credentials.password) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      console.log("Tentative de connexion avec:", credentials.email)

      const response = await loginAdmin(credentials)
      console.log("Réponse de l'API:", response)

      // Stocker le token
      tokenManager.setToken(response.token, "admin")
      console.log("Token stocké:", response.token)

      toast({
        title: "Connexion réussie",
        description: "Redirection vers le tableau de bord...",
      })

      // Attendre un peu avant la redirection pour s'assurer que le token est stocké
      setTimeout(() => {
        router.push("/admin/dashboard")
      }, 1000)
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)
      toast({
        title: "Erreur de connexion",
        description: error instanceof Error ? error.message : "Email ou mot de passe incorrect",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-fit">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Administration
          </CardTitle>
          <p className="text-gray-600">Connectez-vous pour accéder au tableau de bord</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email administrateur</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@event.com"
                  className="pl-10"
                  value={credentials.email}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, email: e.target.value }))}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Votre mot de passe"
                  className="pl-10"
                  value={credentials.password}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          {/* Lien vers l'inscription */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">Pas encore de compte administrateur ?</p>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/admin/register">
                <UserPlus className="w-4 h-4 mr-2" />
                Créer un compte administrateur
              </Link>
            </Button>
          </div>

          {/* Lien de retour */}
          <div className="mt-4 text-center">
            <Button variant="ghost" asChild>
              <Link href="/">Retour au site</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
