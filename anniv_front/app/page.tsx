"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Cake, Crown, Sparkles, PartyPopper } from "lucide-react"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-10 left-10"
      >
        <Cake className="h-8 w-8 text-pink-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-10 right-10"
      >
        <PartyPopper className="h-8 w-8 text-purple-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-purple-800 mb-4">Bienvenue à la Fête!</h1>
        <p className="text-lg sm:text-xl text-purple-600 max-w-md mx-auto">
          Choisissez votre mode d'accès pour participer à cet événement spécial
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full h-full flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-300 hover:translate-y-[-5px] border border-pink-200">
            <div className="bg-pink-100 p-4 rounded-full mb-6">
              <Crown className="h-12 w-12 text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-pink-700 mb-4">Administrateur</h2>
            <p className="text-pink-600 mb-6 text-center">Gérez l'événement, les invités et les activités</p>
            <Link href="/auths/admin/login" className="w-full">
              <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-6 flex items-center justify-center gap-2">
                <span>Accéder à l'interface Admin</span>
                <Sparkles className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full h-full flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-300 hover:translate-y-[-5px] border border-purple-200">
            <div className="bg-purple-100 p-4 rounded-full mb-6">
              <PartyPopper className="h-12 w-12 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-purple-700 mb-4">Participant</h2>
            <p className="text-purple-600 mb-6 text-center">Rejoignez la fête et participez aux activités</p>
            <Link href="/participant" className="w-full">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 flex items-center justify-center gap-2">
                <span>Rejoindre en tant que Participant</span>
                <Sparkles className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-16 text-center text-purple-500"
      >
        <p>Célébrons ensemble ce moment spécial!</p>
      </motion.div>

      {/* Animated decorative elements */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        className="absolute bottom-10 left-10 opacity-70"
      >
        <Cake className="h-10 w-10 text-pink-400" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, -5, 0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 0.5,
        }}
        className="absolute bottom-10 right-10 opacity-70"
      >
        <PartyPopper className="h-10 w-10 text-purple-400" />
      </motion.div>
    </div>
  )
}
