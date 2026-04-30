"use client";

export default function Home() {
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
              <button className="px-8 py-3 bg-purple-600 rounded-full font-medium hover:bg-purple-700 transition">
                Commencer maintenant
              </button>
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
      </main>
    </div>
  );
}
