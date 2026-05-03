"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

interface Chambre {
  id_ch: string;
  numero: string;
  status: string;
  capacite: number;
  type: { libelle: string; prix: number };
  reservations: any[];
}

export default function ChambresPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [chambres, setChambres] = useState<Chambre[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("TOUTES"); // TOUTES, DISPONIBLE, OCCUPEE

  useEffect(() => {
    if (isLoaded && (!user || user.publicMetadata?.role !== "receptionniste")) {
      router.push("/dashboard");
    } else if (isLoaded) {
      fetchChambres();
    }
  }, [user, isLoaded, router]);

  const fetchChambres = async () => {
    try {
      const res = await fetch("/api/receptionniste/chambres");
      if (res.ok) {
        const data = await res.json();
        setChambres(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur de chargement des chambres");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (chambreId: string, reservationId: string) => {
    if (!confirm("Voulez-vous procéder au Check-In pour cette chambre ?")) return;
    
    try {
      const res = await fetch("/api/receptionniste/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chambreId, reservationId })
      });
      
      if (res.ok) {
        toast.success("Check-In effectué avec succès");
        fetchChambres(); // Refresh
      } else {
        const err = await res.json();
        toast.error(err.error || "Erreur lors du Check-In");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    }
  };

  const handleCheckOut = async (reservationId: string) => {
    router.push(`/receptionniste/departs?reservationId=${reservationId}`);
  };

  const filteredChambres = chambres.filter(c => filter === "TOUTES" || c.status === filter);

  if (loading) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-[#faf9f7] p-8">
      <div className="max-w-7xl mx-auto">
        
        <Link href="/receptionniste" className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-800 mb-6 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Retour au Tableau de Bord
        </Link>
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-serif text-gray-900 mb-2">Gestion des Chambres</h1>
            <p className="text-gray-500 font-light">Visualisez les disponibilités et effectuez les Check-In / Check-Out.</p>
          </div>
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            {["TOUTES", "DISPONIBLE", "OCCUPEE", "MAINTENANCE"].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === f ? 'bg-amber-100 text-amber-800' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredChambres.map((chambre) => {
            const currentRes = chambre.reservations?.[0]; // S'il y a une réservation confirmée pour le check-in
            
            return (
              <div key={chambre.id_ch} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
                <div className={`p-4 text-white flex justify-between items-center ${
                  chambre.status === 'DISPONIBLE' ? 'bg-emerald-600' :
                  chambre.status === 'OCCUPEE' ? 'bg-slate-800' :
                  chambre.status === 'MAINTENANCE' ? 'bg-rose-600' : 'bg-amber-500'
                }`}>
                  <span className="text-2xl font-serif">Chambre {chambre.numero}</span>
                  <span className="text-xs font-bold px-2 py-1 bg-white/20 rounded uppercase tracking-wider">
                    {chambre.status}
                  </span>
                </div>
                
                <div className="p-6 flex-1">
                  <div className="flex justify-between mb-4 border-b border-gray-100 pb-4">
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Type</p>
                      <p className="font-medium text-gray-900">{chambre.type.libelle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Capacité</p>
                      <p className="font-medium text-gray-900">{chambre.capacite} pers.</p>
                    </div>
                  </div>

                  {chambre.status === 'DISPONIBLE' && currentRes && (
                    <div className="bg-amber-50 p-4 rounded-lg mb-4 border border-amber-100">
                      <p className="text-sm font-semibold text-amber-800 mb-1">Arrivée prévue aujourd'hui</p>
                      <p className="text-sm text-amber-900">{currentRes.client?.nom || currentRes.clientNom || "Client"}</p>
                      <button 
                        onClick={() => handleCheckIn(chambre.id_ch, currentRes.id)}
                        className="mt-3 w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded shadow-sm text-sm font-medium transition-colors"
                      >
                        Effectuer le Check-In
                      </button>
                    </div>
                  )}

                  {chambre.status === 'OCCUPEE' && (
                    <div className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-100">
                      <p className="text-sm text-slate-500 mb-2">Occupée actuellement</p>
                      <button 
                        onClick={() => handleCheckOut(currentRes?.id || "unknown")}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2 rounded shadow-sm text-sm font-medium transition-colors"
                      >
                        Gérer le Check-Out
                      </button>
                    </div>
                  )}

                  {chambre.status === 'DISPONIBLE' && !currentRes && (
                    <div className="text-center py-4">
                      <p className="text-gray-400 text-sm">Prête pour affectation</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
