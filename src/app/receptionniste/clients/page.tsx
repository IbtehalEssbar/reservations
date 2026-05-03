"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ClientsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState("");
  const [clientSelectionne, setClientSelectionne] = useState<any>(null);

  useEffect(() => {
    if (isLoaded && (!user || user.publicMetadata?.role !== "receptionniste")) {
      router.push("/dashboard");
    } else if (isLoaded) {
      fetchClients();
    }
  }, [user, isLoaded, router]);

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/receptionniste/clients");
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (error) {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleAnnulerReservation = async (reservationId: string) => {
    if (!confirm("Voulez-vous vraiment annuler cette réservation ? Des pénalités pourraient s'appliquer selon le délai d'annulation.")) return;
    
    try {
      const res = await fetch(`/api/receptionniste/reservations/${reservationId}/annulation`, {
        method: "POST"
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.penalite > 0 ? `Réservation annulée. Pénalité appliquée : ${data.penalite} €` : "Réservation annulée sans frais.");
        fetchClients();
        setClientSelectionne(null);
      } else {
        toast.error(data.error || "Erreur lors de l'annulation");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    }
  };

  const clientsFiltres = clients.filter(c => 
    (c.nom?.toLowerCase() || "").includes(recherche.toLowerCase()) ||
    (c.email?.toLowerCase() || "").includes(recherche.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center">Chargement des clients...</div>;

  return (
    <div className="min-h-screen bg-[#faf9f7] p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/receptionniste" className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-800 mb-6 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Retour au Tableau de Bord
        </Link>
        
        <div className="mb-10">
          <h1 className="text-4xl font-serif text-gray-900 mb-2">Liste des Clients</h1>
          <p className="text-gray-500 font-light mb-6">Recherchez un client pour consulter son historique et modifier ses séjours.</p>
          
          <div className="relative max-w-xl">
            <input 
              type="text" 
              placeholder="Rechercher par nom ou email..." 
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
            <svg className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Liste des clients */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden h-[600px] overflow-y-auto">
            <div className="p-4 bg-gray-50 border-b border-gray-100 font-medium text-gray-700">Résultats ({clientsFiltres.length})</div>
            <div className="divide-y divide-gray-50">
              {clientsFiltres.map(c => (
                <div 
                  key={c.id} 
                  onClick={() => setClientSelectionne(c)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-amber-50 ${clientSelectionne?.id === c.id ? 'bg-amber-50 border-l-4 border-amber-500' : 'border-l-4 border-transparent'}`}
                >
                  <p className="font-medium text-gray-900">{c.nom || "Client Sans Nom"}</p>
                  <p className="text-xs text-gray-500 mt-1">{c.email}</p>
                  <p className="text-xs text-gray-400 mt-1">{c.reservations?.length || 0} séjour(s)</p>
                </div>
              ))}
            </div>
          </div>

          {/* Détails du client sélectionné */}
          <div className="lg:col-span-2">
            {clientSelectionne ? (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
                <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-100">
                  <div>
                    <h2 className="text-3xl font-serif text-gray-900 mb-2">{clientSelectionne.nom || "Client"}</h2>
                    <p className="text-gray-500">{clientSelectionne.email} • {clientSelectionne.num_tele || "Pas de téléphone"}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm text-gray-400 uppercase tracking-wider mb-1">Total Séjours</span>
                    <span className="text-3xl font-serif text-amber-600">{clientSelectionne.reservations?.length || 0}</span>
                  </div>
                </div>

                <h3 className="text-xl font-medium text-gray-800 mb-4">Historique des Réservations</h3>
                
                {clientSelectionne.reservations?.length > 0 ? (
                  <div className="space-y-4">
                    {clientSelectionne.reservations.map((r: any) => {
                      const isFuture = new Date(r.date_arrivee) >= new Date();
                      
                      return (
                        <div key={r.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <span className={`px-2 py-1 rounded text-xs font-bold tracking-wider mr-3 ${
                                r.statut === 'CONFIRMEE' ? 'bg-blue-100 text-blue-800' :
                                r.statut === 'EN_ATTENTE' ? 'bg-amber-100 text-amber-800' :
                                r.statut === 'TERMINEE' ? 'bg-emerald-100 text-emerald-800' :
                                'bg-rose-100 text-rose-800'
                              }`}>
                                {r.statut}
                              </span>
                              <span className="font-medium text-gray-900">Chambre {r.chambre?.numero} ({r.chambre?.type?.libelle})</span>
                            </div>
                            <span className="font-medium text-gray-900">{r.prix_total} €</span>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-4">
                            Du {new Date(r.date_arrivee).toLocaleDateString()} au {new Date(r.date_depart).toLocaleDateString()} • {r.nb_personnes} pers.
                          </div>

                          {(r.statut === "CONFIRMEE" || r.statut === "EN_ATTENTE") && isFuture && (
                            <div className="flex gap-3 pt-3 border-t border-gray-100 mt-4">
                              <Link href={`/receptionniste/reservations/${r.id}/modifier`} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                Modifier la réservation
                              </Link>
                              <span className="text-gray-300">|</span>
                              <button onClick={() => handleAnnulerReservation(r.id)} className="text-sm text-rose-600 hover:text-rose-800 font-medium">
                                Annuler (Pénalités)
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 font-light">Aucune réservation trouvée pour ce client.</p>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <p className="text-gray-400 font-light">Sélectionnez un client dans la liste pour voir ses détails.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
