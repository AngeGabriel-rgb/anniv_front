import Link from "next/link"
import { PartyPopper, Mail, MapPin, Phone, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                <PartyPopper className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Idea</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Votre plateforme dédiée aux événements d'anniversaire. Créons ensemble des moments inoubliables remplis de
              joie et de partage.
            </p>
            <div className="flex items-center text-gray-400 text-sm">
              <Heart className="w-4 h-4 mr-2 text-rose-400" />
              Fait avec amour pour célébrer la vie
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-rose-400 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/participant" className="text-gray-300 hover:text-rose-400 transition-colors">
                  Espace Participant
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-gray-300 hover:text-rose-400 transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-gray-300 hover:text-rose-400 transition-colors">
                  Fonctionnalités
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-3 text-rose-400" />
                <span className="text-sm">gabrielange433@gmail.com</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-3 text-rose-400" />
                <span className="text-sm">+241 77 36 44 91</span>
              </li>
              <li className="flex items-start text-gray-300">
                <MapPin className="w-4 h-4 mr-3 text-rose-400 mt-0.5" />
                <span className="text-sm">
                 alibandeng
                  <br />
                    Libreville, Gabon
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">&copy; 2025 Idea. Tous droits réservés.</div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-rose-400 transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-rose-400 transition-colors">
                Conditions d'utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
