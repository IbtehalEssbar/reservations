"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function DepartsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const focusReservationId = searchParams.get('reservationId');

  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [factureGeneree, setFactureGeneree] = useState<any>(null);

  useEffect(() => {
    if (isLoaded && (!user || user.publicMetadata?.role !== "receptionniste")) {
      router.push("/dashboard");
    } else if (isLoaded) {
      fetchDeparts();
    }
  }, [user, isLoaded, router]);

  const fetchDeparts = async () => {
    try {
      // Pour cet exemple on récupère toutes les réservations CONFIRMEES (occupant actuellement une chambre)
      // et dont la date de départ est aujourd'hui ou passée
      const res = await fetch("/api/receptionniste/dashboard"); // On peut réutiliser le dashboard pour avoir toutes les infos vite fait, ou faire un endpoint spécifique
      if (res.ok) {
        const data = await res.json();
        const activeReservations = data.reservations.filter(
          (r: any) => r.statut === "CONFIRMEE" || r.chambre?.status === "OCCUPEE"
        );
        setReservations(activeReservations);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (reservationId: string) => {
    if (!confirm("Voulez-vous clôturer ce séjour et générer la facture ?")) return;

    try {
      const res = await fetch("/api/receptionniste/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Check-Out réussi !");
        setFactureGeneree(data.facture);
        fetchDeparts(); // Rafraîchir la liste
      } else {
        toast.error(data.error || "Erreur lors du Check-out");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    }
  };

  if (loading) return <div className="p-10 text-center">Chargement des départs...</div>;

  return (
    <div className="min-h-screen bg-[#faf9f7] p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/receptionniste" className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-800 mb-6 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Retour au Tableau de Bord
        </Link>
        <h1 className="text-4xl font-serif text-gray-900 mb-2">Gestion des Départs & Check-Out</h1>
        <p className="text-gray-500 font-light mb-10">Procédez au check-out et générez les factures automatiquement.</p>

        {factureGeneree && (
          <div className="mb-10 bg-white border-2 border-emerald-500 rounded-xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 font-bold tracking-wider text-sm">FACTURE GÉNÉRÉE</div>
            <h2 className="text-2xl font-serif mb-6 text-gray-800">Détails de la facture</h2>
            
            <div className="grid grid-cols-2 gap-4 text-gray-600 mb-6 border-b border-gray-100 pb-6">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span>Nuits facturées</span>
                <span className="font-medium text-gray-900">{factureGeneree.nuits}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span>Total Chambre</span>
                <span className="font-medium text-gray-900">{factureGeneree.prixChambreTotal} €</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span>Consommations / Services</span>
                <span className="font-medium text-gray-900">{factureGeneree.totalServices} €</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2 text-rose-500">
                <span>Remises</span>
                <span className="font-medium">- {factureGeneree.remise} €</span>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <p className="text-sm text-gray-400">Le statut de la réservation est maintenant "Terminée". La chambre est libérée.</p>
              <div className="text-right">
                <span className="block text-sm text-gray-500 uppercase tracking-widest mb-1">Montant Net à Payer</span>
                <span className="text-4xl font-serif text-emerald-600 font-bold">{factureGeneree.montantFinal} €</span>
              </div>
            </div>
            
            <button 
              onClick={() => setFactureGeneree(null)}
              className="mt-6 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded transition"
            >
              Fermer la facture
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#0a0a0a] text-amber-500">
              <tr>
                <th className="p-4 font-medium tracking-wider text-sm uppercase">Client</th>
                <th className="p-4 font-medium tracking-wider text-sm uppercase">Chambre</th>
                <th className="p-4 font-medium tracking-wider text-sm uppercase">Date Départ</th>
                <th className="p-4 font-medium tracking-wider text-sm uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reservations.map(r => {
                const estAujourdHui = new Date(r.date_depart).toDateString() === new Date().toDateString();
                const estEnRetard = new Date(r.date_depart) < new Date() && !estAujourdHui;
                const focus = r.id === focusReservationId;

                return (
                  <tr key={r.id} className={`hover:bg-gray-50 transition-colors ${focus ? 'bg-amber-50' : ''}`}>
                    <td className="p-4">
                      <p className="font-medium text-gray-900">{r.client?.nom || r.clientNom}</p>
                      <p className="text-sm text-gray-500">{r.clientTelephone || r.client?.email}</p>
                    </td>
                    <td className="p-4">
                      <span className="inline-block bg-slate-100 text-slate-800 px-3 py-1 rounded font-bold">
                        N° {r.chambre?.numero}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className={`font-medium ${estEnRetard ? 'text-rose-600' : estAujourdHui ? 'text-amber-600' : 'text-gray-900'}`}>
                        {new Date(r.date_depart).toLocaleDateString("fr-FR")}
                      </p>
                      {estAujourdHui && <span className="text-xs text-amber-600 bg-amber-100 px-2 rounded">Aujourd'hui</span>}
                      {estEnRetard && <span className="text-xs text-rose-600 bg-rose-100 px-2 rounded">En retard</span>}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleCheckOut(r.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded shadow-sm transition font-medium"
                      >
                        Effectuer Check-Out
                      </button>
                    </td>
                  </tr>
                );
              })}
              {reservations.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 font-light">
                    Aucun départ prévu ou en attente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
