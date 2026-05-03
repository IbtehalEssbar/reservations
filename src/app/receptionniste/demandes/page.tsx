"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function DemandesPage() {
  const [demandes, setDemandes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      const res = await fetch("/api/receptionniste/demandes");
      if (res.ok) {
        const data = await res.json();
        setDemandes(data);
      }
    } catch (error) {
      toast.error("Erreur de chargement des demandes");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (demandeId: string, status: string) => {
    try {
      const res = await fetch("/api/receptionniste/demandes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demandeId, status })
      });
      if (res.ok) {
        toast.success(`Demande marquée comme ${status.replace("_", " ")}`);
        fetchDemandes();
      } else {
        toast.error("Erreur lors de la mise à jour");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    }
  };

  if (loading) return <div className="p-10 text-center">Chargement des demandes...</div>;

  return (
    <div className="min-h-screen bg-[#faf9f7] p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/receptionniste" className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-800 mb-6 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Retour au Tableau de Bord
        </Link>
        
        <div className="mb-10">
          <h1 className="text-4xl font-serif text-gray-900 mb-2">Demandes & Conciergerie</h1>
          <p className="text-gray-500 font-light">Gérez les demandes des clients en temps réel (Room Service, Ménage, Taxi...)</p>
        </div>

        {demandes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <p className="text-gray-500 text-lg font-light">Aucune demande en cours.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demandes.map(d => (
              <div key={d.id} className={`bg-white rounded-xl shadow-md border overflow-hidden flex flex-col justify-between p-6 ${
                d.status === 'EN_ATTENTE' ? 'border-amber-200' :
                d.status === 'EN_COURS' ? 'border-blue-200' :
                'border-emerald-200 opacity-70'
              }`}>
                
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold tracking-wider ${
                      d.status === 'EN_ATTENTE' ? 'bg-amber-100 text-amber-800' :
                      d.status === 'EN_COURS' ? 'bg-blue-100 text-blue-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {d.status.replace("_", " ")}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(d.date_crea).toLocaleTimeString()}</span>
                  </div>
                  
                  <h3 className="text-xl font-medium text-gray-900 mb-1">{d.type}</h3>
                  <p className="text-gray-600 text-sm mb-4">{d.description}</p>
                  
                  <div className="bg-gray-50 rounded p-3 text-sm">
                    <span className="font-medium text-gray-900">Chambre {d.reservation?.chambre?.numero}</span> - {d.reservation?.client?.nom}
                  </div>
                </div>

                {d.status !== "TERMINEE" && (
                  <div className="mt-6 flex gap-2">
                    {d.status === "EN_ATTENTE" && (
                      <button 
                        onClick={() => updateStatus(d.id, 'EN_COURS')}
                        className="flex-1 bg-amber-600 text-white py-2 rounded font-medium text-sm hover:bg-amber-700 transition"
                      >
                        Prendre en charge
                      </button>
                    )}
                    <button 
                      onClick={() => updateStatus(d.id, 'TERMINEE')}
                      className="flex-1 bg-[#0a0a0a] text-white py-2 rounded font-medium text-sm hover:bg-gray-800 transition"
                    >
                      Marquer Terminé
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
