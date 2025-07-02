"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Mail, Settings, LogOut, Eye, UserCheck, Clock, Loader2 } from "lucide-react"
import Link from "next/link"
import { tokenManager, fetchParticipants } from "@/lib/api"
import type { Participant } from "@/lib/types"

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalParticipants: 0,
    confirmedParticipants: 0,
    pendingParticipants: 0,
    rejectedParticipants: 0,
    totalEvents: 0,
  })
  const [recentRegistrations, setRecentRegistrations] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = tokenManager.getToken("admin")

    if (!token) {
      router.push("/admin/login")
      return
    }

    loadDashboardData()
  }, [router])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      console.log("Chargement des données du dashboard...")

      // Récupérer tous les participants
      const participants = await fetchParticipants()
      console.log("Participants récupérés:", participants)

      // Calculer les statistiques
      const totalParticipants = participants.length
      const confirmedParticipants = participants.filter((p) => p.est_confirme).length
      const pendingParticipants = participants.filter((p) => !p.est_confirme).length

      setStats({
        totalParticipants,
        confirmedParticipants,
        pendingParticipants,
        rejectedParticipants: 0,
        totalEvents: 0,
      })

      // Prendre les 4 inscriptions les plus récentes
      const recent = participants
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4)

      setRecentRegistrations(recent)
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    console.log("Déconnexion...")
    tokenManager.logout("admin")
  }

  const getStatusBadge = (participant: Participant) => {
    if (participant.est_confirme) {
      return <Badge className="bg-green-100 text-green-800">Confirmée</Badge>
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Chargement du dashboard...</p>
        </div>
      </div>
    )
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
              <p className="text-xs text-muted-foreground">Inscriptions totales</p>
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
                {stats.totalParticipants > 0
                  ? Math.round((stats.confirmedParticipants / stats.totalParticipants) * 100)
                  : 0}
                % du total
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
              <CardTitle className="text-sm font-medium">Événements</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">Événements créés</p>
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
              {recentRegistrations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune inscription pour le moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentRegistrations.map((registration) => (
                    <div key={registration.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">
                          {registration.prenom} {registration.nom}
                        </p>
                        <p className="text-sm text-gray-600">{registration.email}</p>
                        <p className="text-xs text-gray-500">{new Date(registration.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">{getStatusBadge(registration)}</div>
                    </div>
                  ))}
                </div>
              )}
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
                <Button variant="outline" asChild className="justify-start h-auto p-4 bg-transparent">
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
