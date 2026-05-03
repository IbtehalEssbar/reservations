"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Avis {
  id: string;
  clientNom: string;
  note: number;
  commentaire: string;
  datePublication: string;
}

export default function Home() {
  const [avis, setAvis] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvis();
  }, []);

  const fetchAvis = async () => {
    try {
      const response = await fetch('/api/avis/validates');
      const data = await response.json();
      if (response.ok) {
        setAvis(data);
      }
    } catch (error) {
      console.error('Erreur chargement avis:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (note: number) => {
    return '⭐'.repeat(note) + '☆'.repeat(5 - note);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      {/* <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">ReservHotel</h1>
          <div className="flex gap-4">
            <button className="px-6 py-2 border border-purple-500 text-purple-400 rounded-full hover:bg-purple-500/10 transition">
              Se connecter
            </button>
            <button className="px-6 py-2 bg-purple-600 rounded-full hover:bg-purple-700 transition">
              Créer un compte
            </button>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Text */}
          <div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Trouvez votre<br />
              séjour idéal.<br />
              Facilement.
            </h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              ReservHotel vous aide à découvrir et réserver les meilleurs hôtels, 
              comparer les prix, lire les avis — tout en restant rapide et sécurisé.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/client/reservations"
                className="px-8 py-3 bg-purple-600 rounded-full font-medium hover:bg-purple-700 transition"
              >
                Commencer maintenant
              </Link>
              <button className="px-8 py-3 border border-gray-600 rounded-full hover:border-gray-400 hover:bg-gray-900/50 transition">
                Voir une démo
              </button>
            </div>
          </div>

          {/* Right Side - Feature Card */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-6">Avantages clés</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-purple-400">•</span>
                <span className="text-gray-300">Accès à des milliers d'hôtels en France</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400">•</span>
                <span className="text-gray-300">Comparaison de prix en temps réel</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400">•</span>
                <span className="text-gray-300">Avis vérifiés et notes des utilisateurs</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400">•</span>
                <span className="text-gray-300">Offres exclusives et réductions</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400">•</span>
                <span className="text-gray-300">Annulation gratuite jusqu'à 24h avant</span>
              </li>
            </ul>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-sm text-gray-500">Rejoins plus de 50 000 utilisateurs satisfaits</p>
            </div>
          </div>
        </div>

        {/* ==================== SECTION AVIS CLIENTS ==================== */}
        <section className="mt-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ce que disent nos clients
            </h2>
            <div className="w-20 h-0.5 bg-purple-500 mx-auto mb-6"></div>
            <p className="text-gray-400 text-lg">
              Des séjours authentiques, des clients satisfaits
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-400">Chargement des avis...</p>
            </div>
          ) : avis.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {avis.map((a) => (
                <div 
                  key={a.id} 
                  className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-semibold text-white text-lg">
                        {a.clientNom}
                      </p>
                      <div className="text-amber-500 text-sm mt-1">
                        {renderStars(a.note)}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(a.datePublication).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-gray-300 italic leading-relaxed">
                    "{a.commentaire}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl">
              <div className="text-6xl mb-4">🏨</div>
              <p className="text-gray-400 text-lg mb-4">
                Aucun avis pour le moment
              </p>
              <p className="text-gray-500 text-sm">
                Soyez le premier à partager votre expérience après votre séjour !
              </p>
              <Link 
                href="/client/reservations" 
                className="inline-block mt-6 px-6 py-2 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition"
              >
                Réserver maintenant
              </Link>
            </div>
          )}
        </section>

        {/* Call to Action Section */}
        <section className="mt-32 text-center">
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt pour votre prochain séjour ?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de voyageurs qui nous font confiance pour leurs réservations
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/client/reservations"
                className="px-8 py-3 bg-purple-600 rounded-full font-medium hover:bg-purple-700 transition"
              >
                Réserver maintenant
              </Link>
              <Link 
                href="/sign-up"
                className="px-8 py-3 border border-gray-600 rounded-full hover:border-gray-400 hover:bg-gray-900/50 transition"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ReservHotel</h3>
              <p className="text-gray-500 text-sm">
                Votre partenaire de confiance pour trouver l'hébergement idéal.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liens utiles</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/" className="hover:text-purple-400 transition">Accueil</Link></li>
                <li><Link href="/client/reservations" className="hover:text-purple-400 transition">Réservations</Link></li>
                <li><Link href="/contact" className="hover:text-purple-400 transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/mentions-legales" className="hover:text-purple-400 transition">Mentions légales</Link></li>
                <li><Link href="/confidentialite" className="hover:text-purple-400 transition">Politique de confidentialité</Link></li>
                <li><Link href="/cgv" className="hover:text-purple-400 transition">CGV</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suivez-nous</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-purple-400 transition">Facebook</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Instagram</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} ReservHotel. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}