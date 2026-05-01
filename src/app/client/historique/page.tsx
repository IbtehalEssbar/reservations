import Link from "next/link";

export default function HistoriquePage() {
  return (
    <div className="min-h-screen bg-[#faf9f7] font-sans p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        <Link href="/client" className="text-amber-600 hover:text-amber-800 mb-8 inline-block tracking-widest text-sm uppercase">
          &larr; Retour à l'accueil
        </Link>
        <h1 className="font-serif text-4xl text-gray-900 mb-2">Historique & Factures</h1>
        <p className="text-gray-500 font-light mb-8">Retrouvez les détails de vos visites précédentes.</p>
        
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400 mb-4">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-serif text-gray-900 mb-2">Votre historique est vide</h3>
          <p className="text-gray-500 font-light max-w-sm mx-auto">
            Vos factures et anciens séjours apparaîtront ici après votre première visite.
          </p>
        </div>
      </div>
    </div>
  );
}
