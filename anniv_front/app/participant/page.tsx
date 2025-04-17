"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Gift, PartyPopper, Users } from "lucide-react";
import { useState, FormEvent } from "react";
import { RegisterFormData, LoginFormData } from "../types";

export default function Home() {
  const [showSpecialOffer, setShowSpecialOffer] = useState<boolean>(true);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: RegisterFormData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      guests: Number(formData.get('guests')),
    };
    console.log('Register data:', data);
    // TODO: Implement registration logic
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: LoginFormData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };
    console.log('Login data:', data);
    // TODO: Implement login logic
  };

  return (
    <main className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=3540')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.3)"
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Special Offer Popup */}
        <Dialog open={showSpecialOffer} onOpenChange={setShowSpecialOffer}>
          <DialogContent className="mx-4 max-w-[calc(100%-2rem)] sm:mx-0 sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-rose-500" />
                Rejoignez-moi pour célébrer !
              </DialogTitle>
            </DialogHeader>
            <div className="p-4 sm:p-6 text-center text-white bg-black/10 backdrop-blur-lg rounded-lg shadow-lg">
              <p className="text-base sm:text-lg text-white">
                Une année de plus de rires, d'aventures et de souvenirs !
              </p>
              <p className="mt-2 text-xs sm:text-sm text-white">
                Confirmez votre présence avant le 20 avril 2024
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 sm:py-32 text-center">
          <div className="flex justify-center">
            <PartyPopper className="h-12 w-12 sm:h-16 sm:w-16 text-rose-400" />
          </div>
          <h1 className="mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            HappyBurst 
          </h1>
          <p className="mt-3 sm:mt-4 text-lg sm:text-xl text-gray-200 px-4">
            Partageons ensemble ce moment spécial
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600">
                  Je participe !
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 max-w-[calc(100%-2rem)] sm:mx-0 sm:max-w-md">
                <Tabs defaultValue="register" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="register">Inscription</TabsTrigger>
                    <TabsTrigger value="login">Connexion</TabsTrigger>
                  </TabsList>
                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nom complet</Label>
                        <Input id="name" name="name" type="text" className="mt-1.5" required />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" className="mt-1.5" required />
                      </div>
                      <div>
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input id="password" name="password" type="password" className="mt-1.5" required />
                      </div>
                      <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600">
                        Confirmer ma présence
                      </Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="login-email">Email</Label>
                        <Input id="login-email" name="email" type="email" className="mt-1.5" required />
                      </div>
                      <div>
                        <Label htmlFor="login-password">Mot de passe</Label>
                        <Input id="login-password" name="password" type="password" className="mt-1.5" required />
                      </div>
                      <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600">
                        Se connecter
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 text-white hover:bg-white/20 border-white/20">
              Plus d'informations
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-12 sm:py-20">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white/10 backdrop-blur-lg p-5 sm:p-6 shadow-lg text-center sm:text-left border border-white/10">
              <div className="flex justify-center sm:justify-start">
                <CalendarDays className="h-10 w-10 sm:h-12 sm:w-12 text-rose-400" />
              </div>
              <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold text-white">Quand & Où</h3>
              <p className="mt-2 text-sm sm:text-base text-gray-200">
                vendredi 04 avril 2024 à 19h
                <br />
                Restaurant "ble doré"
              </p>
            </div>
            <div className="rounded-lg bg-white/10 backdrop-blur-lg p-5 sm:p-6 shadow-lg text-center sm:text-left border border-white/10">
              <div className="flex justify-center sm:justify-start">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-rose-400" />
              </div>
              <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold text-white">Ambiance</h3>
              <p className="mt-2 text-sm sm:text-base text-gray-200">
                Soirée décontractée
                <br />
                Entre amis et famille
              </p>
            </div>
            <div className="rounded-lg bg-white/10 backdrop-blur-lg p-5 sm:p-6 shadow-lg text-center sm:text-left border border-white/10">
              <div className="flex justify-center sm:justify-start">
                <Gift className="h-10 w-10 sm:h-12 sm:w-12 text-rose-400" />
              </div>
              <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold text-white">Au Programme</h3>
              <p className="mt-2 text-sm sm:text-base text-gray-200">
                Dîner, Musique & Danse
                <br />
                Moments de partage
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}