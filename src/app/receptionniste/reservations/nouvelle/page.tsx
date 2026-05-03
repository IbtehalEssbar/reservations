"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function NouvelleReservationPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Phase 1 : Recherche
  const [searchParams, setSearchParams] = useState({
    dateArrivee: "",
    dateDepart: "",
    typeChambreId: "",
    nbPersonnes: 1
  });
  const [searching, setSearching] = useState(false);
  const [chambresDispos, setChambresDispos] = useState<any[] | null>(null);

  // Phase 2 : Sélection
  const [chambreSelectionnee, setChambreSelectionnee] = useState<any>(null);

  // Phase 3 : Client
  const [clientData, setClientData] = useState({
    nom: "",
    email: "",
    telephone: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isLoaded && (!user || user.publicMetadata?.role !== "receptionniste")) {
      router.push("/dashboard");
    } else if (isLoaded) {
      fetchTypes();
    }
  }, [user, isLoaded, router]);

  const fetchTypes = async () => {
    try {
      const res = await fetch("/api/receptionniste/reservations/form-data");
      if (res.ok) {
        const data = await res.json();
        setTypes(data.typesChambre);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(searchParams.dateArrivee) >= new Date(searchParams.dateDepart)) {
      toast.error("La date de départ doit être après l'arrivée");
      return;
    }

    setSearching(true);
    setChambresDispos(null);
    setChambreSelectionnee(null);

    try {
      const res = await fetch("/api/receptionniste/reservations/disponibilite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchParams)
      });
      const data = await res.json();
      if (res.ok) {
        setChambresDispos(data);
        if (data.length === 0) toast.error("Aucune chambre disponible pour ces critères");
      }
    } catch (error) {
      toast.error("Erreur lors de la recherche");
    } finally {
      setSearching(false);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/receptionniste/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateArrivee: searchParams.dateArrivee,
          dateDepart: searchParams.dateDepart,
          nbPersonnes: searchParams.nbPersonnes,
          chambreId: chambreSelectionnee.id_ch,
          clientNom: clientData.nom,
          clientEmail: clientData.email,
          clientTelephone: clientData.telephone
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success("Réservation confirmée avec succès !");
        router.push("/receptionniste/reservations");
      } else {
        toast.error(data.error || "Erreur de création");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-[#faf9f7] p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/receptionniste/reservations" className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-800 mb-6 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Retour aux Réservations
        </Link>
        
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
          <h1 className="text-4xl font-serif text-gray-900 mb-2">Créer une Réservation</h1>
          <p className="text-gray-500 font-light mb-10">Étape 1 : Recherche de disponibilités</p>

          <form onSubmit={handleSearch} className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Date d'arrivée</label>
              <input type="date" required min={new Date().toISOString().split('T')[0]} value={searchParams.dateArrivee} onChange={(e) => setSearchParams({...searchParams, dateArrivee: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none bg-gray-50"/>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Date de départ</label>
              <input type="date" required min={searchParams.dateArrivee || new Date().toISOString().split('T')[0]} value={searchParams.dateDepart} onChange={(e) => setSearchParams({...searchParams, dateDepart: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none bg-gray-50"/>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Nombre de personnes</label>
              <input type="number" required min="1" max="10" value={searchParams.nbPersonnes} onChange={(e) => setSearchParams({...searchParams, nbPersonnes: parseInt(e.target.value)})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none bg-gray-50"/>
            </div>
            
            <div className="col-span-3 pt-4">
              <button type="submit" disabled={searching} className="w-full bg-[#0a0a0a] hover:bg-gray-800 text-white py-4 rounded-xl text-lg font-medium transition-colors disabled:opacity-70">
                {searching ? 'Recherche en cours...' : 'Vérifier les disponibilités'}
              </button>
            </div>
          </form>
        </div>

        {chambresDispos !== null && chambresDispos.length > 0 && !chambreSelectionnee && (
          <div className="mb-8 animate-fade-in-up">
            <h2 className="text-2xl font-serif text-gray-900 mb-6">Étape 2 : Chambres Disponibles ({chambresDispos.length})</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {chambresDispos.map(ch => (
                <div key={ch.id_ch} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-amber-500 hover:shadow-md transition cursor-pointer" onClick={() => setChambreSelectionnee(ch)}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xl font-serif">Chambre {ch.numero}</span>
                    <span className="text-amber-600 font-bold">{ch.type.prix} € / nuit</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">{ch.type.libelle} • Capacité : {ch.capacite} pers.</p>
                  <button className="w-full bg-amber-100 text-amber-800 py-2 rounded font-medium hover:bg-amber-200 transition">
                    Sélectionner
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {chambreSelectionnee && (
          <div id="reservation-form" className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 animate-fade-in-up relative">
            
            <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6 print:hidden">
              <h2 className="text-3xl font-serif text-gray-900">Étape 3 : Informations Client</h2>
              <div className="flex gap-4">
                <button onClick={() => window.print()} className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                  Enregistrer PDF
                </button>
                <button onClick={() => setChambreSelectionnee(null)} className="text-gray-400 hover:text-gray-600 underline text-sm py-2">
                  Changer de chambre
                </button>
              </div>
            </div>

            {/* Encadré de résumé (style image du client) */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200 text-gray-800">
              <h3 className="text-xl font-medium mb-4">Résumé du séjour</h3>
              <div className="space-y-2 text-sm font-medium text-gray-600">
                <p><span className="font-semibold text-gray-800">Chambre:</span> {chambreSelectionnee.numero} ({chambreSelectionnee.type.libelle})</p>
                <p><span className="font-semibold text-gray-800">Dates:</span> du {new Date(searchParams.dateArrivee).toLocaleDateString()} au {new Date(searchParams.dateDepart).toLocaleDateString()}</p>
                <p><span className="font-semibold text-gray-800">Personnes:</span> {searchParams.nbPersonnes}</p>
                <p><span className="font-semibold text-gray-800">Prix total:</span> {chambreSelectionnee.type.prix * (Math.max(1, Math.ceil((new Date(searchParams.dateDepart).getTime() - new Date(searchParams.dateArrivee).getTime()) / (1000 * 3600 * 24))))} €</p>
              </div>
            </div>

            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nom et Prénom</label>
                <input type="text" required value={clientData.nom} onChange={(e) => setClientData({...clientData, nom: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Ex: Jean Dupont"/>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Adresse E-mail</label>
                  <input type="email" required value={clientData.email} onChange={(e) => setClientData({...clientData, email: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="jean.dupont@email.com"/>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
                  <input type="tel" required value={clientData.telephone} onChange={(e) => setClientData({...clientData, telephone: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="+33 6 12 34 56 78"/>
                </div>
              </div>

              <div className="pt-6 mt-6 print:hidden">
                <button type="submit" disabled={submitting} className="w-full bg-[#0a0a0a] hover:bg-gray-800 text-white py-4 rounded-xl text-lg font-medium transition-colors disabled:opacity-70 shadow-lg">
                  {submitting ? 'Validation...' : 'Confirmer la Réservation'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
