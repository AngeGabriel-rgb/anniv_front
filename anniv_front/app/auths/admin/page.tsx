"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Users, Search, Plus, Edit, Trash2, MapPin, Info } from "lucide-react";
import { getParticipants } from "@/lib/auth"; // Assurez-vous d'importer correctement votre fonction

export default function AdminDashboard() {
  interface Anniversaire {
    id: string;
    title: string;
    date: string;
    location: string;
    maxGuests: number;
    description: string;
  }

  const [anniversaires, setAnniversaires] = useState<Anniversaire[]>([]);
  interface Participant {
    id: string;
    name: string;
    email: string;
    guests: number;
    status: 'confirmed' | 'pending' | 'declined';
  }

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipant, setNewParticipant] = useState<{ nom: string; prenom: string; email: string }>({ nom: '', prenom: '', email: '' });

  // Fonction pour récupérer les anniversaires (placeholder)
  const fetchAnniversaires = async () => {

   
  };

  // Fonction pour récupérer les participants
  const fetchParticipants = async () => {
    try {
      const data = await getParticipants();
      setParticipants(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des participants:", error);
    }
  };

  // Fonction pour créer un nouveau participant
  const handleCreateParticipant = async () => {
    try {
      const response = await fetch('http://localhost:8000/auths/participants/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newParticipant),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la création du participant.");
      }

      // Réinitialiser le formulaire
      setNewParticipant({ nom: '', prenom: '', email: '' });
      fetchParticipants(); // Rafraîchir la liste des participants
    } catch (error) {
      console.error("Erreur lors de la création du participant:", error);
    }
  };

  // Appeler les fonctions lors du montage du composant
  useEffect(() => {
    fetchAnniversaires();
    fetchParticipants();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Administrateur
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gérez les anniversaires et les participants
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
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

          <TabsContent value="anniversaires" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Rechercher un anniversaire..."
                  className="pl-10 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-700"
                />
              </div>
              <Button size="lg" className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white">
                <Plus className="h-5 w-5 mr-2" />
                Nouvel Anniversaire
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {anniversaires.map((anniversaire) => (
                <Card key={anniversaire.id} className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      {anniversaire.title}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CalendarDays className="h-4 w-4 text-rose-500" />
                        <span>{new Date(anniversaire.date).toLocaleDateString('fr-FR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 text-rose-500" />
                        <span>{anniversaire.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4 text-rose-500" />
                        <span>{anniversaire.maxGuests} invités maximum</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Info className="h-4 w-4 text-rose-500" />
                        <span>{anniversaire.description}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="participants" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Rechercher un participant..."
                  className="pl-10 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-700"
                />
              </div>
              <Button size="lg" className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white" onClick={handleCreateParticipant}>
                <Plus className="h-5 w-5 mr-2" />
                Ajouter un Participant
              </Button>
            </div>

            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left p-4 font-medium text-gray-600 dark:text-gray-400">Nom</th>
                        <th className="text-left p-4 font-medium text-gray-600 dark:text-gray-400">Email</th>
                        <th className="text-left p-4 font-medium text-gray-600 dark:text-gray-400">Invités</th>
                        <th className="text-left p-4 font-medium text-gray-600 dark:text-gray-400">Statut</th>
                        <th className="text-left p-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((participant) => (
                        <tr key={participant.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                          <td className="p-4 text-gray-900 dark:text-white">{participant.name}</td>
                          <td className="p-4 text-gray-600 dark:text-gray-400">{participant.email}</td>
                          <td className="p-4 text-gray-600 dark:text-gray-400">{participant.guests}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                              ${participant.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                              participant.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                              {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}