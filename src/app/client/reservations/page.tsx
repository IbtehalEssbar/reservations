import Link from "next/link";

export default function ReservationsPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7] font-sans p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        <Link href="/client" className="text-amber-600 hover:text-amber-800 mb-8 inline-block tracking-widest text-sm uppercase">
          &larr; Retour à l'accueil
        </Link>
        <h1 className="font-serif text-4xl text-gray-900 mb-2">Mes Séjours</h1>
        <p className="text-gray-500 font-light mb-8">Gérez vos réservations en cours et futures.</p>
        
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400 mb-4">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-serif text-gray-900 mb-2">Aucune réservation trouvée</h3>
          <p className="text-gray-500 font-light max-w-sm mx-auto mb-6">
            Vous n'avez pas encore prévu de séjour parmi nous. Laissez-vous tenter par nos suites exclusives.
          </p>
          <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md text-sm font-medium tracking-widest uppercase transition-colors">
            Réserver un séjour
          </button>
        </div>
      </div>
    </div>
  );
}
