"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, Users, Plus, Edit, Trash2, MoreHorizontal, ArrowLeft, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { tokenManager } from "@/lib/api"
import { adminAuth } from "@/lib/auth"
import {
  fetchAnniversaires,
  fetchParticipants,
  createAnniversaire,
  updateAnniversaire,
  deleteAnniversaire,
} from "@/lib/api"
import type { Anniversaire, Participant } from "@/lib/types"

export default function AnniversairesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [events, setEvents] = useState<Anniversaire[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Anniversaire | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [participantsLoading, setParticipantsLoading] = useState(false)
  const [currentAdminId, setCurrentAdminId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    participantId: "",
  })

  useEffect(() => {
    const token = tokenManager.getToken("admin")

    if (!token) {
      router.push("/admin/login")
      return
    }

    // Récupérer l'ID de l'admin connecté
    const decodedToken = adminAuth.decodeToken(token)
    if (decodedToken && decodedToken.adminId) {
      setCurrentAdminId(decodedToken.adminId)
    }

    loadEvents()
    loadParticipants()
  }, [router])

  const loadEvents = async () => {
    try {
      setLoading(true)
      console.log("Chargement des événements...")

      const data = await fetchAnniversaires()
      console.log("Événements récupérés:", data)
      setEvents(data)
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de charger les événements",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadParticipants = async () => {
    try {
      setParticipantsLoading(true)
      const data = await fetchParticipants()

      // Filtrer seulement les participants confirmés
      const confirmedParticipants = data.filter((p) => p.est_confirme)
      setParticipants(confirmedParticipants)
    } catch (error) {
      console.error("Erreur lors du chargement des participants:", error)
    } finally {
      setParticipantsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      date: "",
      description: "",
      participantId: "",
    })
    setEditingEvent(null)
  }

  const validateForm = () => {
    if (!formData.date) {
      toast({
        title: "Erreur de validation",
        description: "La date est requise",
        variant: "destructive",
      })
      return false
    }

    if (!formData.participantId) {
      toast({
        title: "Erreur de validation",
        description: "Vous devez sélectionner un participant",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleCreateEvent = async () => {
    if (!validateForm() || !currentAdminId) return

    try {
      setActionLoading(true)
      console.log("Création d'un événement avec les données:", formData)

      // Préparer les données selon la structure exacte de la DB
      const eventData = {
        date: new Date(formData.date).toISOString(), // Convertir en timestamp
        description: formData.description.trim() || undefined,
        participantId: Number.parseInt(formData.participantId),
        adminId: currentAdminId,
      }

      console.log("Données envoyées à l'API:", eventData)

      const newEvent = await createAnniversaire(eventData)
      console.log("Événement créé:", newEvent)

      setEvents((prev) => [...prev, newEvent])
      setShowCreateModal(false)
      resetForm()

      toast({
        title: "Événement créé",
        description: "L'événement a été créé avec succès",
      })
    } catch (error) {
      console.error("Erreur lors de la création:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de créer l'événement",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditEvent = (event: Anniversaire) => {
    console.log("Édition de l'événement:", event)
    setEditingEvent(event)
    setFormData({
      date: new Date(event.date).toISOString().split("T")[0],
      description: event.description || "",
      participantId: event.participantId?.toString() || "",
    })
    setShowCreateModal(true)
  }

  const handleUpdateEvent = async () => {
    if (!validateForm() || !editingEvent) return

    try {
      setActionLoading(true)

      const eventData = {
        date: new Date(formData.date).toISOString(),
        description: formData.description.trim() || undefined,
        participantId: Number.parseInt(formData.participantId),
      }

      console.log("Données de mise à jour:", eventData)

      const updatedEvent = await updateAnniversaire(editingEvent.id.toString(), eventData)

      setEvents((prev) => prev.map((event) => (event.id === editingEvent.id ? updatedEvent : event)))
      setShowCreateModal(false)
      resetForm()

      toast({
        title: "Événement modifié",
        description: "L'événement a été mis à jour avec succès",
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de modifier l'événement",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteEvent = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      return
    }

    try {
      console.log("Suppression de l'événement:", id)

      await deleteAnniversaire(id.toString())

      setEvents((prev) => prev.filter((event) => event.id !== id))
      toast({
        title: "Événement supprimé",
        description: "L'événement a été supprimé avec succès",
      })
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de supprimer l'événement",
        variant: "destructive",
      })
    }
  }

  const getParticipantName = (participantId: number) => {
    const participant = participants.find((p) => p.id === participantId)
    return participant ? `${participant.prenom} ${participant.nom}` : "Participant inconnu"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Chargement des événements...</p>
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
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Link>
              </Button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Gestion des Anniversaires
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={loadEvents} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
              <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvel Événement
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingEvent ? "Modifier l'Événement" : "Créer un Nouvel Événement"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="date">Date de l'événement *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                        disabled={actionLoading}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Description de l'événement..."
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        disabled={actionLoading}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="participantId">Participant *</Label>
                      <Select
                        value={formData.participantId}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, participantId: value }))}
                        disabled={actionLoading || participantsLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un participant" />
                        </SelectTrigger>
                        <SelectContent>
                          {participantsLoading ? (
                            <SelectItem value="" disabled>
                              Chargement...
                            </SelectItem>
                          ) : participants.length === 0 ? (
                            <SelectItem value="" disabled>
                              Aucun participant disponible
                            </SelectItem>
                          ) : (
                            participants.map((participant) => (
                              <SelectItem key={participant.id} value={participant.id.toString()}>
                                {participant.prenom} {participant.nom} - {participant.email}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCreateModal(false)
                          resetForm()
                        }}
                        className="flex-1"
                        disabled={actionLoading}
                      >
                        Annuler
                      </Button>
                      <Button
                        onClick={editingEvent ? handleUpdateEvent : handleCreateEvent}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {editingEvent ? "Modification..." : "Création..."}
                          </>
                        ) : editingEvent ? (
                          "Modifier"
                        ) : (
                          "Créer"
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Events Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Événements ({events.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Aucun événement</h3>
                <p>Créez votre premier événement pour commencer.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Participant</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">#{event.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {event.description ? (
                            <div className="max-w-xs truncate">{event.description}</div>
                          ) : (
                            <span className="text-gray-400 text-sm">Aucune description</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>{getParticipantName(event.participantId)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteEvent(event.id)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
