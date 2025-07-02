"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Mail, Shield, User, Loader2, ArrowLeft, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { registerAdmin } from "@/lib/api"
import Link from "next/link"

export default function AdminRegister() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.prenom.trim()) newErrors.prenom = "Prénom requis"
    if (!formData.nom.trim()) newErrors.nom = "Nom requis"
    if (!formData.email.trim()) {
      newErrors.email = "Email requis"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide"
    }
    if (!formData.password) {
      newErrors.password = "Mot de passe requis"
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 caractères"
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mots de passe différents"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const userData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
      }

      const response = await registerAdmin(userData)

      toast({
        title: "Inscription réussie !",
        description: response.message || "Votre compte administrateur a été créé avec succès.",
      })

      // Rediriger vers la page de connexion après un délai
      setTimeout(() => {
        router.push("/admin/login")
      }, 2000)
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      toast({
        title: "Erreur d'inscription",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
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
            Créer un compte Admin
          </CardTitle>
          <p className="text-gray-600">Inscrivez-vous pour accéder à l'administration</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prenom">Prénom *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="prenom"
                    placeholder="Votre prénom"
                    className="pl-10"
                    value={formData.prenom}
                    onChange={(e) => updateFormData("prenom", e.target.value)}
                    disabled={loading}
                  />
                </div>
                {errors.prenom && (
                  <p className="text-sm text-red-600 mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.prenom}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="nom">Nom *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="nom"
                    placeholder="Votre nom"
                    className="pl-10"
                    value={formData.nom}
                    onChange={(e) => updateFormData("nom", e.target.value)}
                    disabled={loading}
                  />
                </div>
                {errors.nom && (
                  <p className="text-sm text-red-600 mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.nom}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@event.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Mot de passe *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 caractères"
                  className="pl-10"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  disabled={loading}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Répétez votre mot de passe"
                  className="pl-10"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  disabled={loading}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Inscription...
                </>
              ) : (
                "Créer le compte"
              )}
            </Button>
          </form>

          {/* Informations importantes */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Information importante</h4>
            <p className="text-sm text-blue-700">
              Un email de confirmation sera envoyé à votre adresse. Vous devrez confirmer votre email avant de pouvoir
              vous connecter.
            </p>
          </div>

          {/* Lien vers la connexion */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">Déjà un compte administrateur ?</p>
            <Button variant="outline" asChild>
              <Link href="/admin/login">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Se connecter
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
