"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, TrendingUp, Mail, Settings, LogOut, Eye, UserCheck, Clock } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalParticipants: 87,
    confirmedParticipants: 65,
    pendingParticipants: 15,
    rejectedParticipants: 7,
    totalEvents: 1,
    vipRegistrations: 23,
  })

  useEffect(() => {
    // Vérifier l'authentification
    const isAuth = localStorage.getItem("adminAuth")
    if (!isAuth) {
      router.push("/admin/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/admin/login")
  }

  const recentRegistrations = [
    { id: 1, name: "Marie Dubois", email: "marie@email.com", status: "confirmed", type: "VIP", date: "2024-12-01" },
    {
      id: 2,
      name: "Pierre Martin",
      email: "pierre@email.com",
      status: "pending",
      type: "Standard",
      date: "2024-12-01",
    },
    {
      id: 3,
      name: "Sophie Laurent",
      email: "sophie@email.com",
      status: "confirmed",
      type: "Standard",
      date: "2024-11-30",
    },
    { id: 4, name: "Jean Dupont", email: "jean@email.com", status: "confirmed", type: "VIP", date: "2024-11-30" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmée</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Refusée</Badge>
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Dashboard Admin
            </h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <Eye className="w-4 h-4 mr-2" />
                  Voir le site
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalParticipants}</div>
              <p className="text-xs text-muted-foreground">+12% par rapport au mois dernier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmés</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.confirmedParticipants}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.confirmedParticipants / stats.totalParticipants) * 100)}% du total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingParticipants}</div>
              <p className="text-xs text-muted-foreground">Nécessitent une validation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inscriptions VIP</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.vipRegistrations}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.vipRegistrations / stats.totalParticipants) * 100)}% du total
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Registrations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Inscriptions Récentes
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/participants">Voir tout</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRegistrations.map((registration) => (
                  <div key={registration.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{registration.name}</p>
                      <p className="text-sm text-gray-600">{registration.email}</p>
                      <p className="text-xs text-gray-500">{registration.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={registration.type === "VIP" ? "default" : "secondary"}>{registration.type}</Badge>
                      {getStatusBadge(registration.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <Button asChild className="justify-start h-auto p-4">
                  <Link href="/admin/participants">
                    <Users className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Gérer les Participants</div>
                      <div className="text-sm opacity-70">Valider, modifier ou supprimer</div>
                    </div>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="justify-start h-auto p-4 bg-transparent">
                  <Link href="/admin/anniversaires">
                    <Calendar className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Gérer les Événements</div>
                      <div className="text-sm opacity-70">Créer ou modifier des événements</div>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
                  <Mail className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Envoyer des Emails</div>
                    <div className="text-sm opacity-70">Notifications et rappels</div>
                  </div>
                </Button>

                <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
                  <Settings className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Paramètres</div>
                    <div className="text-sm opacity-70">Configuration générale</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
