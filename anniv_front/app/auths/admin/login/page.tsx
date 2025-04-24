"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { LogIn } from "lucide-react"
import { loginAdmin } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await loginAdmin(email, password)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            <LogIn className="h-8 w-8 mx-auto mb-4 text-rose-500" />
            Connexion Administrateur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" name="password" type="password" required className="h-12" />
            </div>
            {error && <div className="text-sm text-red-500 text-center">{error}</div>}
            <Button type="submit" className="w-full h-12 bg-rose-500 hover:bg-rose-600" disabled={loading}>
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
            <div className="text-center text-sm">
              <Link href="/auths/admin/register" className="text-rose-500 hover:underline">
                Pas encore de compte ? S'inscrire
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
