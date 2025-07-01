"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  ArrowLeft,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"
import { anniversaireApi } from "@/lib/api"
import type { Anniversaire } from "@/lib/types"

export default function AnniversairesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, token } = useAuth("admin")
  const [events, setEvents] = useState<Anniversaire[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Anniversaire | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    date: "",
    time: "",
    location: "",
    maxParticipants: 100,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }

    loadEvents()
  }, [isAuthenticated, router, token])

  const loadEvents = async () => {
    if (!token) return

    try {
      setLoading(true)
      const response = await anniversaireApi.getAll(token)

      if (response.success && response.data) {
        setEvents(response.data)
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Impossible de charger les événements",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      titre: "",
      description: "",
      date: "",
      time: "",
      location: "",
      maxParticipants: 100,
    })
    setEditingEvent(null)
  }

  const handleCreateEvent = async () => {
    if (!token) return

    try {
      setActionLoading(true)

      const eventData = {
        titre: formData.titre,
        description: formData.description,
        date: new Date(formData.date),
        time: formData.time,
        location: formData.location,
        maxParticipants: formData.maxParticipants,
        status: "draft" as const,
        adminId: 1, // À récupérer depuis le token décodé
      }

      const response = await anniversaireApi.create(token, eventData)

      if (response.success && response.data) {
        if (response.data) {
          setEvents((prev) => [...prev, response.data as Anniversaire])
        }
        setShowCreateModal(false)
        resetForm()
        toast({
          title: "Événement créé",
          description: "Le nouvel événement a été créé avec succès",
        })
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Impossible de créer l'événement",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditEvent = (event: Anniversaire) => {
    setEditingEvent(event)
    setFormData({
      titre: event.titre,
      description: event.description || "",
      date: new Date(event.date).toISOString().split("T")[0],
      time: event.time || "",
      location: event.location || "",
      maxParticipants: event.maxParticipants,
    })
    setShowCreateModal(true)
  }

  const handleUpdateEvent = async () => {
    if (!editingEvent || !token) return

    try {
      setActionLoading(true)

      const eventData = {
        titre: formData.titre,
        description: formData.description,
        date: new Date(formData.date),
        time: formData.time,
        location: formData.location,
        maxParticipants: formData.maxParticipants,
      }

      const response = await anniversaireApi.update(token, editingEvent.id, eventData)

      if (response.success && response.data) {
        setEvents((prev) => prev.map((event) => event.id === editingEvent.id ? response.data as Anniversaire : event))
        setShowCreateModal(false)
        resetForm()
        toast({
          title: "Événement modifié",
          description: "L'événement a été mis à jour avec succès",
        })
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Impossible de modifier l'événement",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteEvent = async (id: number) => {
    if (!token) return

    try {
      const response = await anniversaireApi.delete(token, id)

      if (response.success) {
        setEvents((prev) => prev.filter((event) => event.id !== id))
        toast({
          title: "Événement supprimé",
          description: "L'événement a été supprimé avec succès",
        })
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Impossible de supprimer l'événement",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Brouillon</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Terminé</Badge>
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
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
                      <Label htmlFor="titre">Titre de l'événement</Label>
                      <Input
                        id="titre"
                        placeholder="Ex: Anniversaire de Marie - 30 ans"
                        value={formData.titre}
                        onChange={(e) => setFormData((prev) => ({ ...prev, titre: e.target.value }))}
                        disabled={actionLoading}
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
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                          disabled={actionLoading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Heure</Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                          disabled={actionLoading}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location">Lieu</Label>
                      <Input
                        id="location"
                        placeholder="Ex: Salle des Fêtes, Centre-ville"
                        value={formData.location}
                        onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                        disabled={actionLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxParticipants">Nombre maximum de participants</Label>
                      <Input
                        id="maxParticipants"
                        type="number"
                        min="1"
                        value={formData.maxParticipants}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, maxParticipants: Number.parseInt(e.target.value) }))
                        }
                        disabled={actionLoading}
                      />
                    </div>
                    <div className="flex space-x-3">
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
                      <TableHead>Événement</TableHead>
                      <TableHead>Date & Heure</TableHead>
                      <TableHead>Lieu</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{event.titre}</div>
                            <div className="text-sm text-gray-600">{event.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="font-medium">{new Date(event.date).toLocaleDateString()}</div>
                              {event.time && (
                                <div className="text-sm text-gray-600 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {event.time}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">
                              {event.currentParticipants}/{event.maxParticipants}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                              style={{
                                width: `${(event.currentParticipants / event.maxParticipants) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(event.status)}</TableCell>
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
