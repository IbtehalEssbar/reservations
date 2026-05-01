import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7] font-sans p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        <Link href="/client" className="text-amber-600 hover:text-amber-800 mb-8 inline-block tracking-widest text-sm uppercase">
          &larr; Retour à l'accueil
        </Link>
        <h1 className="font-serif text-4xl text-gray-900 mb-2">Conciergerie</h1>
        <p className="text-gray-500 font-light mb-8">Notre équipe est à votre service 24h/24 pour répondre à toutes vos demandes.</p>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-serif text-gray-900 mb-4">Nous contacter</h3>
            <p className="text-gray-600 font-light mb-6">
              Une demande spéciale pour votre séjour ? Besoin d'organiser un transfert ou une activité ?
            </p>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-semibold tracking-wider text-gray-500 uppercase mb-1">Sujet</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 outline-none focus:border-amber-500 transition-colors" placeholder="Ex: Réservation d'un taxi" />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-wider text-gray-500 uppercase mb-1">Message</label>
                <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 outline-none focus:border-amber-500 transition-colors" placeholder="Comment pouvons-nous vous aider ?"></textarea>
              </div>
              <button className="w-full bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-md text-sm font-medium tracking-widest uppercase transition-colors">
                Envoyer le message
              </button>
            </form>
          </div>

          <div className="bg-gray-900 p-8 rounded-xl shadow-sm text-white flex flex-col justify-center text-center">
             <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-amber-400 mb-6 mx-auto">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
             </div>
             <h3 className="text-2xl font-serif mb-4">Ligne Directe</h3>
             <p className="text-gray-400 font-light mb-6">Pour toute urgence, notre conciergerie est joignable instantanément par téléphone.</p>
             <p className="text-3xl text-amber-400 font-light tracking-wider">+33 1 23 45 67 89</p>
          </div>
        </div>
      </div>
    </div>
  );
}
