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
import { Search, Filter, MoreHorizontal, Check, X, Clock, ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Participant {
  id: number
  firstName: string
  lastName: string
  email: string
  status: "confirmed" | "pending" | "rejected"
  type: "Standard" | "VIP"
  guests: number
  registrationDate: string
}

export default function ParticipantsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 1,
      firstName: "Marie",
      lastName: "Dubois",
      email: "marie@email.com",
      status: "confirmed",
      type: "VIP",
      guests: 1,
      registrationDate: "2024-12-01",
    },
    {
      id: 2,
      firstName: "Pierre",
      lastName: "Martin",
      email: "pierre@email.com",
      status: "pending",
      type: "Standard",
      guests: 0,
      registrationDate: "2024-12-01",
    },
    {
      id: 3,
      firstName: "Sophie",
      lastName: "Laurent",
      email: "sophie@email.com",
      status: "confirmed",
      type: "Standard",
      guests: 2,
      registrationDate: "2024-11-30",
    },
    {
      id: 4,
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean@email.com",
      status: "confirmed",
      type: "VIP",
      guests: 1,
      registrationDate: "2024-11-30",
    },
    {
      id: 5,
      firstName: "Anne",
      lastName: "Moreau",
      email: "anne@email.com",
      status: "rejected",
      type: "Standard",
      guests: 0,
      registrationDate: "2024-11-29",
    },
    {
      id: 6,
      firstName: "Paul",
      lastName: "Bernard",
      email: "paul@email.com",
      status: "pending",
      type: "VIP",
      guests: 3,
      registrationDate: "2024-11-29",
    },
  ])

  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>(participants)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth")
    if (!isAuth) {
      router.push("/admin/login")
    }
  }, [router])

  useEffect(() => {
    let filtered = participants

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((p) => p.type === typeFilter)
    }

    setFilteredParticipants(filtered)
  }, [participants, searchTerm, statusFilter, typeFilter])

  const updateParticipantStatus = (id: number, newStatus: "confirmed" | "pending" | "rejected") => {
    setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)))

    const statusText = {
      confirmed: "confirmée",
      pending: "en attente",
      rejected: "refusée",
    }

    toast({
      title: "Statut mis à jour",
      description: `Inscription ${statusText[newStatus]}`,
    })
  }

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

  const exportData = () => {
    const csvContent = [
      ["Prénom", "Nom", "Email", "Statut", "Type", "Accompagnants", "Date d'inscription"],
      ...filteredParticipants.map((p) => [
        p.firstName,
        p.lastName,
        p.email,
        p.status,
        p.type,
        p.guests.toString(),
        p.registrationDate,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "participants.csv"
    a.click()
    window.URL.revokeObjectURL(url)
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
            <Button onClick={exportData} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter CSV
            </Button>
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
                  <SelectItem value="rejected">Refusées</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                </SelectContent>
              </Select>

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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
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
                        {participant.firstName} {participant.lastName}
                      </TableCell>
                      <TableCell>{participant.email}</TableCell>
                      <TableCell>
                        <Badge variant={participant.type === "VIP" ? "default" : "secondary"}>{participant.type}</Badge>
                      </TableCell>
                      <TableCell>{participant.guests}</TableCell>
                      <TableCell>{getStatusBadge(participant.status)}</TableCell>
                      <TableCell>{participant.registrationDate}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => updateParticipantStatus(participant.id, "confirmed")}
                              className="text-green-600"
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Confirmer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateParticipantStatus(participant.id, "pending")}
                              className="text-yellow-600"
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              En attente
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateParticipantStatus(participant.id, "rejected")}
                              className="text-red-600"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Refuser
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
