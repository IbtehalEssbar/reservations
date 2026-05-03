"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ReservationsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && (!user || user.publicMetadata?.role !== "receptionniste")) {
      router.push("/dashboard");
    } else if (isLoaded) {
      fetchReservations();
    }
  }, [user, isLoaded, router]);

  const fetchReservations = async () => {
    try {
      const res = await fetch("/api/receptionniste/dashboard");
      if (res.ok) {
        const data = await res.json();
        setReservations(data.reservations);
      }
    } catch (error) {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMEE": return "bg-blue-100 text-blue-800";
      case "EN_ATTENTE": return "bg-amber-100 text-amber-800";
      case "ANNULEE": return "bg-rose-100 text-rose-800";
      case "TERMINEE": return "bg-emerald-100 text-emerald-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
            <h1 className="text-4xl font-serif text-gray-900 mb-2">Toutes les Réservations</h1>
            <p className="text-gray-500 font-light">Consultez l'historique et modifiez les statuts.</p>
          </div>
          <Link href="/receptionniste/reservations/nouvelle" className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition font-medium">
            + Nouvelle Réservation
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-[#0a0a0a] text-white">
                <tr>
                  <th className="p-4 font-medium tracking-wider text-sm">Réf</th>
                  <th className="p-4 font-medium tracking-wider text-sm">Client</th>
                  <th className="p-4 font-medium tracking-wider text-sm">Chambre</th>
                  <th className="p-4 font-medium tracking-wider text-sm">Dates</th>
                  <th className="p-4 font-medium tracking-wider text-sm">Montant</th>
                  <th className="p-4 font-medium tracking-wider text-sm">Statut</th>
                  <th className="p-4 font-medium tracking-wider text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reservations.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-sm text-gray-500">{r.id.substring(0,8)}</td>
                    <td className="p-4">
                      <p className="font-medium text-gray-900">{r.client?.nom || r.clientNom}</p>
                    </td>
                    <td className="p-4 font-medium">N° {r.chambre?.numero}</td>
                    <td className="p-4 text-sm">
                      {new Date(r.date_arrivee).toLocaleDateString()} - {new Date(r.date_depart).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm font-medium">{r.prix_total} €</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold tracking-wider ${getStatusColor(r.statut)}`}>
                        {r.statut}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Voir / Modifier</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
