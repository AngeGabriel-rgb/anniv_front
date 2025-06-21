"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  CalendarDays,
  Search,
  LogOut,
  User,
  Calendar,
  MapPin,
  Clock,
  Users,
  Loader2,
  RefreshCw,
  ChevronRight,
  Bell,
  BellOff,
  PartyPopper,
  Star,
  Gift,
} from "lucide-react"
import { isAuthenticated, logout } from "@/lib/auth"
import { fetchAnniversairesForParticipant } from "@/lib/api"
import type { Anniversaire } from "@/app/types"

export default function ParticipantDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [anniversaires, setAnniversaires] = useState<Anniversaire[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoadingAnniversaires, setIsLoadingAnniversaires] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null)

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push("/")
        return false
      }

      try {
        const participantData = localStorage.getItem("participant")
        if (participantData) {
          const data = JSON.parse(participantData)
          setUserInfo({
            name: data.name || "Participant",
            email: data.email || "",
          })
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des informations utilisateur:", err)
      }

      setLoading(false)
      return true
    }

    if (checkAuth()) {
      getAnniversaires()
    }
  }, [router])

  // Function to get anniversaires
  const getAnniversaires = async () => {
    setIsLoadingAnniversaires(true)
    setError(null)
    try {
      const data = await fetchAnniversairesForParticipant()
      // S'assurer que les données sont bien formatées
      const formattedData = data.map((anniversaire) => ({
        ...anniversaire,
        isParticipating: anniversaire.isParticipating || false,
      }))
      setAnniversaires(formattedData)
    } catch (err) {
      console.error("Erreur lors de la récupération des anniversaires:", err)
      setError("Impossible de charger les anniversaires. Veuillez vérifier votre connexion.")
      setAnniversaires([]) // Vider la liste en cas d'erreur
    } finally {
      setIsLoadingAnniversaires(false)
    }
  }

  // Filter anniversaires based on search term
  const filteredAnniversaires = anniversaires.filter(
    (anniversaire) =>
      anniversaire.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anniversaire.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anniversaire.location?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Function to toggle participation
  const toggleParticipation = (anniversaireId: string, currentStatus: boolean) => {
    setAnniversaires(
      anniversaires.map((anniv) =>
        anniv.id === anniversaireId ? { ...anniv, isParticipating: !currentStatus } : anniv,
      ),
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-white">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                <PartyPopper className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Espace Participant</h1>
                {userInfo && <p className="mt-1 text-sm sm:text-base text-gray-300">Bienvenue, {userInfo.name}</p>}
              </div>
            </div>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-white/10 border border-white/20"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg backdrop-blur-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="backdrop-blur-sm bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-rose-400" />
                  Mon profil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userInfo && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-rose-500/20 to-pink-500/20 flex items-center justify-center border border-rose-500/30">
                        <User className="h-6 w-6 text-rose-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{userInfo.name}</p>
                        <p className="text-sm text-gray-400">{userInfo.email}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent border-white/20 text-white hover:bg-white/10"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Modifier mon profil
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/5 border-white/10 mt-4">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-pink-400" />
                  Mes participations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-sm text-gray-300">Anniversaires confirmés</span>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                      {anniversaires.filter((a) => a.isParticipating).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-sm text-gray-300">Invitations en attente</span>
                    <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0">
                      {anniversaires.filter((a) => !a.isParticipating).length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Rechercher un anniversaire..."
                  className="pl-10 h-12 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-rose-500/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent border-white/20 text-white hover:bg-white/10"
                onClick={getAnniversaires}
                disabled={isLoadingAnniversaires}
              >
                {isLoadingAnniversaires ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-5 w-5 mr-2" />
                )}
                Actualiser
              </Button>
            </div>

            <Tabs defaultValue="upcoming" className="space-y-6">
              <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-white/10 p-1 backdrop-blur-sm border border-white/10">
                <TabsTrigger
                  value="upcoming"
                  className="inline-flex items-center px-4 py-2 rounded-md transition-all duration-200 text-gray-300 hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                >
                  À venir
                </TabsTrigger>
                <TabsTrigger
                  value="participating"
                  className="inline-flex items-center px-4 py-2 rounded-md transition-all duration-200 text-gray-300 hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                >
                  Mes participations
                </TabsTrigger>
                <TabsTrigger
                  value="past"
                  className="inline-flex items-center px-4 py-2 rounded-md transition-all duration-200 text-gray-300 hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                >
                  Passés
                </TabsTrigger>
              </TabsList>

              {isLoadingAnniversaires ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-rose-500 mx-auto mb-4" />
                    <span className="text-gray-300">Chargement des anniversaires...</span>
                  </div>
                </div>
              ) : filteredAnniversaires.length === 0 ? (
                <Card className="backdrop-blur-sm bg-white/5 border-white/10">
                  <CardContent className="flex flex-col items-center justify-center h-64">
                    <CalendarDays className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-300 text-center">
                      {searchTerm
                        ? "Aucun anniversaire ne correspond à votre recherche."
                        : "Aucun anniversaire n'a été trouvé."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <TabsContent value="upcoming" className="space-y-4">
                    {filteredAnniversaires
                      .filter((a) => new Date(a.date) > new Date())
                      .map((anniversaire) => (
                        <AnniversaireCard
                          key={anniversaire.id}
                          anniversaire={anniversaire}
                          onToggleParticipation={toggleParticipation}
                        />
                      ))}
                  </TabsContent>

                  <TabsContent value="participating" className="space-y-4">
                    {filteredAnniversaires
                      .filter((a) => a.isParticipating)
                      .map((anniversaire) => (
                        <AnniversaireCard
                          key={anniversaire.id}
                          anniversaire={anniversaire}
                          onToggleParticipation={toggleParticipation}
                        />
                      ))}
                  </TabsContent>

                  <TabsContent value="past" className="space-y-4">
                    {filteredAnniversaires
                      .filter((a) => new Date(a.date) < new Date())
                      .map((anniversaire) => (
                        <AnniversaireCard
                          key={anniversaire.id}
                          anniversaire={anniversaire}
                          onToggleParticipation={toggleParticipation}
                          isPast
                        />
                      ))}
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

interface AnniversaireCardProps {
  anniversaire: Anniversaire & { isParticipating?: boolean }
  onToggleParticipation: (id: string, currentStatus: boolean) => void
  isPast?: boolean
}

function AnniversaireCard({ anniversaire, onToggleParticipation, isPast = false }: AnniversaireCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="backdrop-blur-sm bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 group">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-rose-400" />
            {anniversaire.titre || "Anniversaire"}
          </CardTitle>
          {!isPast && (
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 transition-colors ${
                anniversaire.isParticipating
                  ? "text-rose-400 hover:text-rose-300 bg-rose-500/20 hover:bg-rose-500/30"
                  : "text-gray-400 hover:text-gray-300 hover:bg-white/10"
              }`}
              onClick={() => onToggleParticipation(anniversaire.id, !!anniversaire.isParticipating)}
              title={anniversaire.isParticipating ? "Ne plus participer" : "Participer"}
            >
              {anniversaire.isParticipating ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Calendar className="h-4 w-4 text-rose-400 flex-shrink-0" />
            <span>{formatDate(anniversaire.date)}</span>
          </div>
          {anniversaire.time && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Clock className="h-4 w-4 text-pink-400 flex-shrink-0" />
              <span>{formatTime(anniversaire.date)}</span>
            </div>
          )}
          {anniversaire.location && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <MapPin className="h-4 w-4 text-violet-400 flex-shrink-0" />
              <span>{anniversaire.location}</span>
            </div>
          )}
          {anniversaire.maxGuests && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Users className="h-4 w-4 text-blue-400 flex-shrink-0" />
              <span>{anniversaire.maxGuests} invités maximum</span>
            </div>
          )}
          {anniversaire.description && (
            <div className="mt-3 text-sm text-gray-300 bg-white/5 p-3 rounded-lg border border-white/10">
              {anniversaire.description}
            </div>
          )}
          {anniversaire.isParticipating && (
            <div className="mt-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-3 rounded-lg border border-green-500/30">
              <p className="text-xs text-green-300 flex items-center">
                <Check className="h-3 w-3 mr-2" />
                Vous participez à cet événement
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 group-hover:border-rose-500/50 transition-colors"
        >
          Voir les détails
          <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  )
}

// Check icon component
function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
