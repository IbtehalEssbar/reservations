"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ModifierReservationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reservation, setReservation] = useState<any>(null);

  const [formData, setFormData] = useState({
    dateArrivee: "",
    dateDepart: "",
    nbPersonnes: 1
  });

  useEffect(() => {
    fetchReservation();
  }, [params.id]);

  const fetchReservation = async () => {
    try {
      const res = await fetch(`/api/receptionniste/reservations/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setReservation(data);
        setFormData({
          dateArrivee: new Date(data.date_arrivee).toISOString().split('T')[0],
          dateDepart: new Date(data.date_depart).toISOString().split('T')[0],
          nbPersonnes: data.nb_personnes
        });
      } else {
        toast.error("Réservation introuvable");
        router.push("/receptionniste/clients");
      }
    } catch (error) {
      toast.error("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(formData.dateArrivee) >= new Date(formData.dateDepart)) {
      toast.error("La date de départ doit être après l'arrivée");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/receptionniste/reservations/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Réservation modifiée avec succès !");
        router.push("/receptionniste/clients");
      } else {
        toast.error(data.error || "Erreur lors de la modification");
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
      <div className="max-w-2xl mx-auto">
        <Link href="/receptionniste/clients" className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-800 mb-6 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Retour aux clients
        </Link>
        
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
          <h1 className="text-4xl font-serif text-gray-900 mb-2">Modifier Réservation</h1>
          <p className="text-gray-500 font-light mb-8">Client : {reservation?.client?.nom}</p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200 text-gray-800">
            <h3 className="font-medium mb-2">Détails actuels</h3>
            <p className="text-sm">Chambre {reservation?.chambre?.numero} ({reservation?.chambre?.type?.libelle})</p>
            <p className="text-sm mt-1">Ancien Prix : <span className="font-bold">{reservation?.prix_total} €</span></p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nouvelle Date d'arrivée</label>
                <input type="date" required min={new Date().toISOString().split('T')[0]} value={formData.dateArrivee} onChange={(e) => setFormData({...formData, dateArrivee: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none bg-gray-50"/>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nouvelle Date de départ</label>
                <input type="date" required min={formData.dateArrivee || new Date().toISOString().split('T')[0]} value={formData.dateDepart} onChange={(e) => setFormData({...formData, dateDepart: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none bg-gray-50"/>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Nouveau Nombre de personnes</label>
              <input type="number" required min="1" max={reservation?.chambre?.capacite || 10} value={formData.nbPersonnes} onChange={(e) => setFormData({...formData, nbPersonnes: parseInt(e.target.value)})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none bg-gray-50"/>
            </div>
            
            <button type="submit" disabled={submitting} className="w-full bg-[#0a0a0a] hover:bg-gray-800 text-white py-4 rounded-xl text-lg font-medium transition-colors mt-6">
              {submitting ? 'Vérification des disponibilités...' : 'Sauvegarder les modifications'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
