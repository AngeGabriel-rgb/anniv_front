"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "lucide-react"
import { isAuthenticated, logout } from "@/lib/auth"
import {
  fetchParticipants,
  fetchAnniversaires,
  createParticipant,
  createAnniversaire,
  deleteParticipant,
  deleteAnniversaire,
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
    participantId: "",
    adminId: "1", // Default admin ID, should be replaced with actual logged-in admin ID
  })
  const [isCreatingParticipant, setIsCreatingParticipant] = useState(false)
  const [isCreatingAnniversaire, setIsCreatingAnniversaire] = useState(false)
  const [participantDialogOpen, setParticipantDialogOpen] = useState(false)
  const [anniversaireDialogOpen, setAnniversaireDialogOpen] = useState(false)

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
      await getParticipants() // Refresh the list
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
    if (!newAnniversaire.date || !newAnniversaire.participantId) {
      setError("Veuillez remplir tous les champs obligatoires.")
      return
    }

    setIsCreatingAnniversaire(true)
    setError(null)
    try {
      await createAnniversaire(newAnniversaire)
      await getAnniversaires() // Refresh the list
      setNewAnniversaire({
        date: "",
        description: "",
        participantId: "",
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

  // Handle deleting a participant
  const handleDeleteParticipant = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce participant ?")) {
      try {
        await deleteParticipant(id)
        await getParticipants() // Refresh the list
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
        await getAnniversaires() // Refresh the list
      } catch (err: unknown) {
        console.error("Erreur lors de la suppression de l'anniversaire:", err)
        setError(err instanceof Error ? err.message : "Impossible de supprimer l'anniversaire. Veuillez réessayer.")
      }
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard Administrateur</h1>
              <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Gérez les anniversaires et les participants
              </p>
            </div>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              onClick={logout}
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">{error}</div>}

        <Tabs defaultValue="anniversaires" className="space-y-8">
          <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-white/90 dark:bg-gray-800/90 p-1 text-gray-500 dark:text-gray-400 backdrop-blur-sm">
            <TabsTrigger
              value="anniversaires"
              className="inline-flex items-center px-6 py-2.5 rounded-md transition-colors duration-200 hover:text-gray-900 dark:hover:text-white data-[state=active]:bg-rose-500 data-[state=active]:text-white"
            >
              <CalendarDays className="h-5 w-5 mr-2" />
              Anniversaires
            </TabsTrigger>
            <TabsTrigger
              value="participants"
              className="inline-flex items-center px-6 py-2.5 rounded-md transition-colors duration-200 hover:text-gray-900 dark:hover:text-white data-[state=active]:bg-rose-500 data-[state=active]:text-white"
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
                  className="pl-10 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-700"
                  value={searchTermAnniversaire}
                  onChange={(e) => setSearchTermAnniversaire(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  size="lg"
                  className="flex-1 sm:flex-none bg-rose-500 hover:bg-rose-600 text-white"
                  onClick={() => setAnniversaireDialogOpen(true)}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nouvel Anniversaire
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 sm:flex-none"
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
                <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
                <span className="ml-2 text-gray-600 dark:text-gray-400">Chargement des anniversaires...</span>
              </div>
            ) : filteredAnniversaires.length === 0 ? (
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700">
                <CardContent className="flex flex-col items-center justify-center h-64">
                  <CalendarDays className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    {searchTermAnniversaire
                      ? "Aucun anniversaire ne correspond à votre recherche."
                      : "Aucun anniversaire n'a été trouvé."}
                  </p>
                  <Button
                    className="mt-4 bg-rose-500 hover:bg-rose-600"
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
                    className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
                  >
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        {anniversaire.titre || "Anniversaire"}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-rose-500 hover:text-rose-600"
                          onClick={() => handleDeleteAnniversaire(anniversaire.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4 text-rose-500" />
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
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Users className="h-4 w-4 text-rose-500" />
                            <span>{anniversaire.participants.length} participant(s)</span>
                          </div>
                        )}
                        {anniversaire.description && (
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Info className="h-4 w-4 text-rose-500 mt-0.5" />
                            <span>{anniversaire.description}</span>
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
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Créer un nouvel anniversaire</DialogTitle>
                  <DialogDescription>Remplissez les informations pour créer un nouvel anniversaire.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date de l'anniversaire</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newAnniversaire.date}
                      onChange={(e) => setNewAnniversaire({ ...newAnniversaire, date: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="participantId">Participant</Label>
                    <select
                      id="participantId"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newAnniversaire.participantId}
                      onChange={(e) => setNewAnniversaire({ ...newAnniversaire, participantId: e.target.value })}
                    >
                      <option value="">Sélectionner un participant</option>
                      {participants.map((participant) => (
                        <option key={participant.id} value={participant.id}>
                          {participant.prenom} {participant.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description (optionnel)</Label>
                    <Textarea
                      id="description"
                      value={newAnniversaire.description}
                      onChange={(e) => setNewAnniversaire({ ...newAnniversaire, description: e.target.value })}
                      placeholder="Description de l'anniversaire..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setAnniversaireDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button
                    type="button"
                    className="bg-rose-500 hover:bg-rose-600"
                    onClick={handleCreateAnniversaire}
                    disabled={isCreatingAnniversaire}
                  >
                    {isCreatingAnniversaire ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Création...
                      </>
                    ) : (
                      "Créer l{' '}anniversaire"
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
                  className="pl-10 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-700"
                  value={searchTermParticipant}
                  onChange={(e) => setSearchTermParticipant(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  size="lg"
                  className="flex-1 sm:flex-none bg-rose-500 hover:bg-rose-600 text-white"
                  onClick={() => setParticipantDialogOpen(true)}
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Ajouter un Participant
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 sm:flex-none"
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
                <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
                <span className="ml-2 text-gray-600 dark:text-gray-400">{"Chargement des participants..."}</span>
              </div>
            ) : (
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700">
                <CardContent className="p-0">
                  {filteredParticipants.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64">
                      <Users className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 text-center">
                        {searchTermParticipant
                          ? "Aucun participant ne correspond à votre recherche."
                          : "Aucun participant n'a été trouvé."}
                      </p>
                      <Button
                        className="mt-4 bg-rose-500 hover:bg-rose-600"
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
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left p-4 font-medium text-gray-600 dark:text-gray-400">Nom</th>
                            <th className="text-left p-4 font-medium text-gray-600 dark:text-gray-400">Email</th>
                            <th className="text-left p-4 font-medium text-gray-600 dark:text-gray-400">Code</th>
                            <th className="text-left p-4 font-medium text-gray-600 dark:text-gray-400">Statut</th>
                            <th className="text-left p-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredParticipants.map((participant) => (
                            <tr
                              key={participant.id}
                              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                            >
                              <td className="p-4 text-gray-900 dark:text-white">
                                {participant.prenom} {participant.nom}
                              </td>
                              <td className="p-4 text-gray-600 dark:text-gray-400">{participant.email}</td>
                              <td className="p-4 text-gray-600 dark:text-gray-400">{participant.code_unique}</td>
                              <td className="p-4">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                                    ${
                                      participant.est_confirme
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    }`}
                                >
                                  {participant.est_confirme ? "Confirmé" : "En attente"}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-rose-500 hover:text-rose-600"
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
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Ajouter un participant</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations pour ajouter un nouveau participant.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="prenom">Prénom</Label>
                      <Input
                        id="prenom"
                        value={newParticipant.prenom}
                        onChange={(e) => setNewParticipant({ ...newParticipant, prenom: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="nom">Nom</Label>
                      <Input
                        id="nom"
                        value={newParticipant.nom}
                        onChange={(e) => setNewParticipant({ ...newParticipant, nom: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newParticipant.email}
                      onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setParticipantDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button
                    type="button"
                    className="bg-rose-500 hover:bg-rose-600"
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
