"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  CalendarDays,
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  Calendar,
  UserPlus,
  Info,
  LogOut,
  Crown,
  PartyPopper,
  TrendingUp,
  Activity,
} from "lucide-react"
import { isAuthenticated, logout } from "@/lib/auth"
import {
  fetchParticipants,
  fetchAnniversaires,
  createParticipant,
  createAnniversaire,
  deleteParticipant,
  deleteAnniversaire,
  updateParticipant,
  updateAnniversaire,
} from "@/lib/api"
import type { Participant, Anniversaire } from "@/app/types"

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [anniversaires, setAnniversaires] = useState<Anniversaire[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])
  const [searchTermAnniversaire, setSearchTermAnniversaire] = useState("")
  const [searchTermParticipant, setSearchTermParticipant] = useState("")
  const [isLoadingAnniversaires, setIsLoadingAnniversaires] = useState(true)
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newParticipant, setNewParticipant] = useState({
    nom: "",
    prenom: "",
    email: "",
  })
  const [newAnniversaire, setNewAnniversaire] = useState({
    date: "",
    description: "",
    participantIds: [] as string[], // Changé de participantId à participantIds
    adminId: "1",
  })
  const [isCreatingParticipant, setIsCreatingParticipant] = useState(false)
  const [isCreatingAnniversaire, setIsCreatingAnniversaire] = useState(false)
  const [participantDialogOpen, setParticipantDialogOpen] = useState(false)
  const [anniversaireDialogOpen, setAnniversaireDialogOpen] = useState(false)
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [editingAnniversaire, setEditingAnniversaire] = useState<Anniversaire | null>(null)
  const [editAnniversaireDialogOpen, setEditAnniversaireDialogOpen] = useState(false)
  const [isUpdatingAnniversaire, setIsUpdatingAnniversaire] = useState(false)

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auths/admin/login")
    } else {
      setLoading(false)
    }
  }, [router])

  // Function to get anniversaires
  const getAnniversaires = async () => {
    setIsLoadingAnniversaires(true)
    setError(null)
    try {
      const data = await fetchAnniversaires()
      setAnniversaires(data)
    } catch (err) {
      console.error("Erreur lors de la récupération des anniversaires:", err)
      setError("Impossible de charger les anniversaires. Veuillez réessayer.")
    } finally {
      setIsLoadingAnniversaires(false)
    }
  }

  // Function to get participants
  const getParticipants = async () => {
    setIsLoadingParticipants(true)
    setError(null)
    try {
      const data = await fetchParticipants()
      setParticipants(data)
    } catch (err) {
      console.error("Erreur lors de la récupération des participants:", err)
      setError("Impossible de charger les participants. Veuillez réessayer.")
    } finally {
      setIsLoadingParticipants(false)
    }
  }

  // Handle creating a new participant
  const handleCreateParticipant = async () => {
    if (!newParticipant.nom || !newParticipant.prenom || !newParticipant.email) {
      setError("Veuillez remplir tous les champs obligatoires.")
      return
    }

    setIsCreatingParticipant(true)
    setError(null)
    try {
      await createParticipant(newParticipant)
      await getParticipants()
      setNewParticipant({ nom: "", prenom: "", email: "" })
      setParticipantDialogOpen(false)
    } catch (err: unknown) {
      console.error("Erreur lors de la création du participant:", err)
      setError(err instanceof Error ? err.message : "Impossible de créer le participant. Veuillez réessayer.")
    } finally {
      setIsCreatingParticipant(false)
    }
  }

  // Handle creating a new anniversaire
  const handleCreateAnniversaire = async () => {
    if (!newAnniversaire.date || newAnniversaire.participantIds.length === 0) {
      setError("Veuillez remplir tous les champs obligatoires et sélectionner au moins un participant.")
      return
    }

    setIsCreatingAnniversaire(true)
    setError(null)
    try {
      await createAnniversaire({
        date: newAnniversaire.date,
        description: newAnniversaire.description,
        participantId: newAnniversaire.participantIds[0], // Utilise le premier participant sélectionné
        adminId: newAnniversaire.adminId,
      })
      await getAnniversaires()
      setNewAnniversaire({
        date: "",
        description: "",
        participantIds: [],
        adminId: "1",
      })
      setAnniversaireDialogOpen(false)
    } catch (err: unknown) {
      console.error("Erreur lors de la création de l'anniversaire:", err)
      setError(err instanceof Error ? err.message : "Impossible de créer l'anniversaire. Veuillez réessayer.")
    } finally {
      setIsCreatingAnniversaire(false)
    }
  }

  // Handle editing an anniversaire
  const handleEditAnniversaire = (anniversaire: Anniversaire) => {
    setEditingAnniversaire({
      ...anniversaire,
      participantIds: anniversaire.participants?.map((p) => p.id) || [],
    })
    setEditAnniversaireDialogOpen(true)
  }

  // Handle updating an anniversaire
  const handleUpdateAnniversaire = async () => {
    if (!editingAnniversaire || !editingAnniversaire.date || editingAnniversaire.participantIds.length === 0) {
      setError("Veuillez remplir tous les champs obligatoires et sélectionner au moins un participant.")
      return
    }

    setIsUpdatingAnniversaire(true)
    setError(null)
    try {
      await updateAnniversaire(editingAnniversaire.id, {
        date: editingAnniversaire.date,
        description: editingAnniversaire.description,
        participantIds: editingAnniversaire.participantIds,
      })
      await getAnniversaires()
      setEditingAnniversaire(null)
      setEditAnniversaireDialogOpen(false)
    } catch (err: unknown) {
      console.error("Erreur lors de la modification de l'anniversaire:", err)
      setError(err instanceof Error ? err.message : "Impossible de modifier l'anniversaire. Veuillez réessayer.")
    } finally {
      setIsUpdatingAnniversaire(false)
    }
  }

  // Handle deleting a participant
  const handleDeleteParticipant = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce participant ?")) {
      try {
        await deleteParticipant(id)
        await getParticipants()
      } catch (err: unknown) {
        console.error("Erreur lors de la suppression du participant:", err)
        setError(err instanceof Error ? err.message : "Impossible de supprimer le participant. Veuillez réessayer.")
      }
    }
  }

  // Handle deleting an anniversaire
  const handleDeleteAnniversaire = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet anniversaire ?")) {
      try {
        await deleteAnniversaire(id)
        await getAnniversaires()
      } catch (err: unknown) {
        console.error("Erreur lors de la suppression de l'anniversaire:", err)
        setError(err instanceof Error ? err.message : "Impossible de supprimer l'anniversaire. Veuillez réessayer.")
      }
    }
  }

  const handleToggleParticipantStatus = async (participantId: string, currentStatus: boolean) => {
    try {
      await updateParticipant(participantId, !currentStatus)
      await getParticipants() // Refresh the list
    } catch (err: unknown) {
      console.error("Erreur lors de la modification du statut:", err)
      setError(err instanceof Error ? err.message : "Impossible de modifier le statut. Veuillez réessayer.")
    }
  }

  // Filter anniversaires based on search term
  const filteredAnniversaires = anniversaires.filter(
    (anniversaire) =>
      anniversaire.titre?.toLowerCase().includes(searchTermAnniversaire.toLowerCase()) ||
      anniversaire.description?.toLowerCase().includes(searchTermAnniversaire.toLowerCase()),
  )

  // Filter participants based on search term
  const filteredParticipants = participants.filter(
    (participant) =>
      `${participant.prenom} ${participant.nom}`.toLowerCase().includes(searchTermParticipant.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTermParticipant.toLowerCase()),
  )

  // Load data on component mount
  useEffect(() => {
    if (!loading) {
      getAnniversaires()
      getParticipants()
    }
  }, [loading])

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
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard Administrateur</h1>
                <p className="mt-1 text-sm sm:text-base text-gray-300">Gérez les anniversaires et les participants</p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="backdrop-blur-sm bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Anniversaires</p>
                  <p className="text-2xl font-bold text-white">{anniversaires.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 text-rose-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Participants</p>
                  <p className="text-2xl font-bold text-white">{participants.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Confirmés</p>
                  <p className="text-2xl font-bold text-white">{participants.filter((p) => p.est_confirme).length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">En Attente</p>
                  <p className="text-2xl font-bold text-white">{participants.filter((p) => !p.est_confirme).length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="anniversaires" className="space-y-8">
          <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-white/10 p-1 backdrop-blur-sm border border-white/10">
            <TabsTrigger
              value="anniversaires"
              className="inline-flex items-center px-6 py-2.5 rounded-md transition-all duration-200 text-gray-300 hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              <CalendarDays className="h-5 w-5 mr-2" />
              Anniversaires
            </TabsTrigger>
            <TabsTrigger
              value="participants"
              className="inline-flex items-center px-6 py-2.5 rounded-md transition-all duration-200 text-gray-300 hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              <Users className="h-5 w-5 mr-2" />
              Participants
            </TabsTrigger>
          </TabsList>

          {/* Anniversaires Tab */}
          <TabsContent value="anniversaires" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Rechercher un anniversaire..."
                  className="pl-10 h-12 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-rose-500/50"
                  value={searchTermAnniversaire}
                  onChange={(e) => setSearchTermAnniversaire(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  size="lg"
                  className="flex-1 sm:flex-none bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
                  onClick={() => setAnniversaireDialogOpen(true)}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nouvel Anniversaire
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 sm:flex-none bg-transparent border-white/20 text-white hover:bg-white/10"
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
            </div>

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
                  <p className="text-gray-300 text-center mb-4">
                    {searchTermAnniversaire
                      ? "Aucun anniversaire ne correspond à votre recherche."
                      : "Aucun anniversaire n'a été trouvé."}
                  </p>
                  <Button
                    className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                    onClick={() => setAnniversaireDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un anniversaire
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAnniversaires.map((anniversaire) => (
                  <Card
                    key={anniversaire.id}
                    className="backdrop-blur-sm bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                      <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                        <PartyPopper className="w-5 h-5 text-rose-400" />
                        {anniversaire.titre || "Anniversaire"}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                          onClick={() => handleEditAnniversaire(anniversaire)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20"
                          onClick={() => handleDeleteAnniversaire(anniversaire.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Calendar className="h-4 w-4 text-rose-400" />
                          <span>
                            {new Date(anniversaire.date).toLocaleDateString("fr-FR", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        {anniversaire.participants && anniversaire.participants.length > 0 && (
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Users className="h-4 w-4 text-blue-400" />
                            <span>{anniversaire.participants.length} participant(s)</span>
                          </div>
                        )}
                        {anniversaire.description && (
                          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                            <div className="flex items-start gap-2 text-sm text-gray-300">
                              <Info className="h-4 w-4 text-violet-400 mt-0.5 flex-shrink-0" />
                              <span>{anniversaire.description}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Create Anniversaire Dialog */}
            <Dialog open={anniversaireDialogOpen} onOpenChange={setAnniversaireDialogOpen}>
              <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-slate-900 to-purple-900 border-white/20 text-white">
                <DialogHeader>
                  <DialogTitle className="text-xl text-white">Créer un nouvel anniversaire</DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Remplissez les informations pour créer un nouvel anniversaire.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date" className="text-gray-200">
                      Date de l'anniversaire
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      className="bg-white/10 border-white/20 text-white"
                      value={newAnniversaire.date}
                      onChange={(e) => setNewAnniversaire({ ...newAnniversaire, date: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="participants" className="text-gray-200">
                      Participants
                    </Label>
                    <div className="max-h-40 overflow-y-auto border border-white/20 rounded-md bg-white/10 p-2">
                      {participants.map((participant) => (
                        <label
                          key={participant.id}
                          className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="rounded border-white/20 bg-white/10 text-rose-500 focus:ring-rose-500"
                            checked={newAnniversaire.participantIds.includes(participant.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewAnniversaire({
                                  ...newAnniversaire,
                                  participantIds: [...newAnniversaire.participantIds, participant.id],
                                })
                              } else {
                                setNewAnniversaire({
                                  ...newAnniversaire,
                                  participantIds: newAnniversaire.participantIds.filter((id) => id !== participant.id),
                                })
                              }
                            }}
                          />
                          <span className="text-white text-sm">
                            {participant.prenom} {participant.nom}
                          </span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      {newAnniversaire.participantIds.length} participant(s) sélectionné(s)
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description" className="text-gray-200">
                      Description (optionnel)
                    </Label>
                    <Textarea
                      id="description"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      value={newAnniversaire.description}
                      onChange={(e) => setNewAnniversaire({ ...newAnniversaire, description: e.target.value })}
                      placeholder="Description de l'anniversaire..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-transparent border-white/20 text-white hover:bg-white/10"
                    onClick={() => setAnniversaireDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="button"
                    className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                    onClick={handleCreateAnniversaire}
                    disabled={isCreatingAnniversaire}
                  >
                    {isCreatingAnniversaire ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Création...
                      </>
                    ) : (
                      "Créer l'anniversaire"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Anniversaire Dialog */}
            <Dialog open={editAnniversaireDialogOpen} onOpenChange={setEditAnniversaireDialogOpen}>
              <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-slate-900 to-purple-900 border-white/20 text-white">
                <DialogHeader>
                  <DialogTitle className="text-xl text-white">Modifier l'anniversaire</DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Modifiez les informations de l'anniversaire.
                  </DialogDescription>
                </DialogHeader>
                {editingAnniversaire && (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-date" className="text-gray-200">
                        Date de l'anniversaire
                      </Label>
                      <Input
                        id="edit-date"
                        type="date"
                        className="bg-white/10 border-white/20 text-white"
                        value={editingAnniversaire.date.split("T")[0]}
                        onChange={(e) =>
                          setEditingAnniversaire({
                            ...editingAnniversaire,
                            date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-participants" className="text-gray-200">
                        Participants
                      </Label>
                      <div className="max-h-40 overflow-y-auto border border-white/20 rounded-md bg-white/10 p-2">
                        {participants.map((participant) => (
                          <label
                            key={participant.id}
                            className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="rounded border-white/20 bg-white/10 text-rose-500 focus:ring-rose-500"
                              checked={editingAnniversaire.participantIds?.includes(participant.id) || false}
                              onChange={(e) => {
                                const currentIds = editingAnniversaire.participantIds || []
                                if (e.target.checked) {
                                  setEditingAnniversaire({
                                    ...editingAnniversaire,
                                    participantIds: [...currentIds, participant.id],
                                  })
                                } else {
                                  setEditingAnniversaire({
                                    ...editingAnniversaire,
                                    participantIds: currentIds.filter((id: string) => id !== participant.id),
                                  })
                                }
                              }}
                            />
                            <span className="text-white text-sm">
                              {participant.prenom} {participant.nom}
                            </span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400">
                        {editingAnniversaire.participantIds?.length || 0} participant(s) sélectionné(s)
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-description" className="text-gray-200">
                        Description (optionnel)
                      </Label>
                      <Textarea
                        id="edit-description"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        value={editingAnniversaire.description || ""}
                        onChange={(e) =>
                          setEditingAnniversaire({
                            ...editingAnniversaire,
                            description: e.target.value,
                          })
                        }
                        placeholder="Description de l'anniversaire..."
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-transparent border-white/20 text-white hover:bg-white/10"
                    onClick={() => {
                      setEditAnniversaireDialogOpen(false)
                      setEditingAnniversaire(null)
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="button"
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    onClick={handleUpdateAnniversaire}
                    disabled={isUpdatingAnniversaire}
                  >
                    {isUpdatingAnniversaire ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Modification...
                      </>
                    ) : (
                      "Modifier l'anniversaire"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Rechercher un participant..."
                  className="pl-10 h-12 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-rose-500/50"
                  value={searchTermParticipant}
                  onChange={(e) => setSearchTermParticipant(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  size="lg"
                  className="flex-1 sm:flex-none bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
                  onClick={() => setParticipantDialogOpen(true)}
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Ajouter un Participant
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 sm:flex-none bg-transparent border-white/20 text-white hover:bg-white/10"
                  onClick={getParticipants}
                  disabled={isLoadingParticipants}
                >
                  {isLoadingParticipants ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-5 w-5 mr-2" />
                  )}
                  Actualiser
                </Button>
              </div>
            </div>

            {isLoadingParticipants ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-rose-500 mx-auto mb-4" />
                  <span className="text-gray-300">Chargement des participants...</span>
                </div>
              </div>
            ) : (
              <Card className="backdrop-blur-sm bg-white/5 border-white/10">
                <CardContent className="p-0">
                  {filteredParticipants.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64">
                      <Users className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-300 text-center mb-4">
                        {searchTermParticipant
                          ? "Aucun participant ne correspond à votre recherche."
                          : "Aucun participant n'a été trouvé."}
                      </p>
                      <Button
                        className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                        onClick={() => setParticipantDialogOpen(true)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Ajouter un participant
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left p-4 font-medium text-gray-300">Nom</th>
                            <th className="text-left p-4 font-medium text-gray-300">Email</th>
                            <th className="text-left p-4 font-medium text-gray-300">Code</th>
                            <th className="text-left p-4 font-medium text-gray-300">Statut</th>
                            <th className="text-left p-4 font-medium text-gray-300">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredParticipants.map((participant) => (
                            <tr
                              key={participant.id}
                              className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200"
                            >
                              <td className="p-4 text-white">
                                {participant.prenom} {participant.nom}
                              </td>
                              <td className="p-4 text-gray-300">{participant.email}</td>
                              <td className="p-4 text-gray-300">{participant.code_unique}</td>
                              <td className="p-4">
                                <Badge
                                  className={`${
                                    participant.est_confirme
                                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0"
                                      : "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0"
                                  }`}
                                >
                                  {participant.est_confirme ? "Confirmé" : "En attente"}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 px-3 text-xs ${
                                      participant.est_confirme
                                        ? "text-orange-400 hover:text-orange-300 hover:bg-orange-500/20"
                                        : "text-green-400 hover:text-green-300 hover:bg-green-500/20"
                                    }`}
                                    onClick={() =>
                                      handleToggleParticipantStatus(participant.id, participant.est_confirme)
                                    }
                                  >
                                    {participant.est_confirme ? "Désactiver" : "Confirmer"}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20"
                                    onClick={() => handleDeleteParticipant(participant.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Create Participant Dialog */}
            <Dialog open={participantDialogOpen} onOpenChange={setParticipantDialogOpen}>
              <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-slate-900 to-purple-900 border-white/20 text-white">
                <DialogHeader>
                  <DialogTitle className="text-xl text-white">Ajouter un participant</DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Remplissez les informations pour ajouter un nouveau participant.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="prenom" className="text-gray-200">
                        Prénom
                      </Label>
                      <Input
                        id="prenom"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        value={newParticipant.prenom}
                        onChange={(e) => setNewParticipant({ ...newParticipant, prenom: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="nom" className="text-gray-200">
                        Nom
                      </Label>
                      <Input
                        id="nom"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        value={newParticipant.nom}
                        onChange={(e) => setNewParticipant({ ...newParticipant, nom: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-gray-200">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      value={newParticipant.email}
                      onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-transparent border-white/20 text-white hover:bg-white/10"
                    onClick={() => setParticipantDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="button"
                    className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                    onClick={handleCreateParticipant}
                    disabled={isCreatingParticipant}
                  >
                    {isCreatingParticipant ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Création...
                      </>
                    ) : (
                      "Ajouter"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
