"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  MoreHorizontal,
  Check,
  Clock,
  ArrowLeft,
  Download,
  Users,
  Loader2,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { tokenManager } from "@/lib/api"
import { fetchParticipants, updateParticipant, regenerateParticipantCode, exportParticipantsCSV } from "@/lib/api"
import type { Participant } from "@/lib/types"

export default function ParticipantsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    const token = tokenManager.getToken("admin")

    if (!token) {
      router.push("/admin/login")
      return
    }

    loadParticipants()
  }, [router])

  useEffect(() => {
    let filtered = participants

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      if (statusFilter === "confirmed") {
        filtered = filtered.filter((p) => p.est_confirme)
      } else if (statusFilter === "pending") {
        filtered = filtered.filter((p) => !p.est_confirme)
      }
    }

    setFilteredParticipants(filtered)
  }, [participants, searchTerm, statusFilter])

  const loadParticipants = async () => {
    try {
      setLoading(true)
      const data = await fetchParticipants()
      setParticipants(data)
    } catch (error) {
      console.error("Erreur lors du chargement des participants:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de charger les participants",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateParticipantStatus = async (id: number, newStatus: boolean) => {
    try {
      setActionLoading(id)

      await updateParticipant(id.toString(), { est_confirme: newStatus })

      setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, est_confirme: newStatus } : p)))

      toast({
        title: "Statut mis à jour",
        description: `Inscription ${newStatus ? "confirmée" : "mise en attente"}`,
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de mettre à jour le statut",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const regenerateCode = async (id: number) => {
    try {
      setActionLoading(id)

      await regenerateParticipantCode(id.toString())

      toast({
        title: "Code régénéré",
        description: "Un nouveau code a été envoyé par email",
      })
    } catch (error) {
      console.error("Erreur lors de la régénération:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de régénérer le code",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleExport = async () => {
    try {
      await exportParticipantsCSV()
      toast({
        title: "Export réussi",
        description: "Le fichier CSV a été téléchargé",
      })
    } catch (error) {
      console.error("Erreur lors de l'export:", error)
      toast({
        title: "Erreur d'export",
        description: error instanceof Error ? error.message : "Impossible d'exporter les données",
        variant: "destructive",
      })
    }
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
          <p>Chargement des participants...</p>
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
                Gestion des Participants
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={loadParticipants} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
              <Button onClick={handleExport} variant="outline" size="sm" disabled={filteredParticipants.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Exporter CSV
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtres et Recherche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="confirmed">Confirmées</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
              <div></div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{filteredParticipants.length} résultat(s)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Participants Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Participants ({filteredParticipants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredParticipants.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  {participants.length === 0 ? "Aucun participant" : "Aucun résultat"}
                </h3>
                <p>
                  {participants.length === 0
                    ? "Les inscriptions apparaîtront ici une fois soumises."
                    : "Essayez de modifier vos critères de recherche."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Accompagnants</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date d'inscription</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParticipants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell className="font-medium">
                          {participant.prenom} {participant.nom}
                        </TableCell>
                        <TableCell>{participant.email}</TableCell>
                        <TableCell>{participant.guests || 0}</TableCell>
                        <TableCell>{getStatusBadge(participant)}</TableCell>
                        <TableCell>{new Date(participant.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                disabled={actionLoading === participant.id}
                              >
                                {actionLoading === participant.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <MoreHorizontal className="h-4 w-4" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => updateParticipantStatus(participant.id, true)}
                                className="text-green-600"
                                disabled={participant.est_confirme}
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Confirmer
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateParticipantStatus(participant.id, false)}
                                className="text-yellow-600"
                                disabled={!participant.est_confirme}
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                En attente
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => regenerateCode(participant.id)}
                                className="text-blue-600"
                              >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Régénérer code
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
