"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ArriveesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [arrivees, setArrivees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && (!user || user.publicMetadata?.role !== "receptionniste")) {
      router.push("/dashboard");
    } else if (isLoaded) {
      fetchArrivees();
    }
  }, [user, isLoaded, router]);

  const fetchArrivees = async () => {
    try {
      const res = await fetch("/api/receptionniste/dashboard");
      if (res.ok) {
        const data = await res.json();
        const today = new Date().toDateString();
        
        // On filtre pour ne garder que les arrivées du jour qui sont "EN_ATTENTE" ou "CONFIRMEE"
        const arriveesDuJour = data.reservations.filter((r: any) => {
          const isToday = new Date(r.date_arrivee).toDateString() === today;
          const isPending = r.statut === "EN_ATTENTE" || r.statut === "CONFIRMEE";
          const roomNotOccupied = r.chambre?.status !== "OCCUPEE";
          return isToday && isPending && roomNotOccupied;
        });
        
        setArrivees(arriveesDuJour);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (chambreId: string, reservationId: string) => {
    if (!confirm("Voulez-vous valider le Check-In pour ce client ?")) return;
    
    try {
      const res = await fetch("/api/receptionniste/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chambreId, reservationId })
      });
      
      if (res.ok) {
        toast.success("Client bien installé en chambre !");
        fetchArrivees(); // Refresh
      } else {
        const err = await res.json();
        toast.error(err.error || "Erreur lors du Check-In");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    }
  };

  if (loading) return <div className="p-10 text-center">Chargement des arrivées...</div>;

  return (
    <div className="min-h-screen bg-[#faf9f7] p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/receptionniste" className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-800 mb-6 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Retour au Tableau de Bord
        </Link>
        <div className="mb-10">
          <h1 className="text-4xl font-serif text-gray-900 mb-2">Check-In : Arrivées du Jour</h1>
          <p className="text-gray-500 font-light">Accueillez les clients, vérifiez leur identité et validez leur arrivée.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {arrivees.map((r) => (
            <div key={r.id} className="bg-white rounded-xl shadow-md border border-amber-100 overflow-hidden flex flex-col hover:shadow-lg transition">
              <div className="bg-amber-600 text-white p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-serif text-xl">Chambre {r.chambre?.numero}</span>
                  <span className="text-xs font-bold px-2 py-1 bg-white/20 rounded uppercase tracking-wider">{r.chambre?.type?.libelle}</span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{r.client?.nom || r.clientNom}</h3>
                  <p className="text-sm text-gray-500 mb-4">{r.clientTelephone || r.client?.email}</p>
                  
                  <div className="bg-gray-50 p-3 rounded text-sm text-gray-600 mb-6">
                    <p>Nuits : <span className="font-medium text-gray-900">{Math.ceil((new Date(r.date_depart).getTime() - new Date(r.date_arrivee).getTime()) / (1000 * 3600 * 24))}</span></p>
                    <p>Personnes : <span className="font-medium text-gray-900">{r.nb_personnes}</span></p>
                    <p>Total estimé : <span className="font-medium text-amber-600">{r.prix_total} €</span></p>
                  </div>
                </div>

                <button 
                  onClick={() => handleCheckIn(r.chambreId, r.id)}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg shadow-sm text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Valider le Check-In
                </button>
              </div>
            </div>
          ))}

          {arrivees.length === 0 && (
            <div className="col-span-full bg-white p-12 text-center rounded-xl border border-gray-100">
              <p className="text-xl font-serif text-gray-400">Aucune arrivée en attente pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
