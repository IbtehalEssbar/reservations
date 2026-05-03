'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Reservation {
  id: string;
  date_arrivee: Date;
  date_depart: Date;
  nb_personnes: number;
  statut: string;
  prix_total: number;
  chambre: {
    numero: string;
    type: {
      libelle: string;
      prix: number;
    };
  };
  createdAt: Date;
}

interface ReservationsData {
  aVenir: Reservation[];
  passees: Reservation[];
  annulees: Reservation[];
}

export default function MesReservationsPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [reservations, setReservations] = useState<ReservationsData>({
    aVenir: [],
    passees: [],
    annulees: []
  });
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      fetchReservations();
    }
  }, [isSignedIn]);

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/reservations/user');
      const data = await response.json();
      
      if (response.ok) {
        // Convertir les dates en objets Date
        const formatter = (items: any[]) => items.map(item => ({
          ...item,
          date_arrivee: new Date(item.date_arrivee),
          date_depart: new Date(item.date_depart),
          createdAt: new Date(item.createdAt)
        }));
        
        setReservations({
          aVenir: formatter(data.aVenir),
          passees: formatter(data.passees),
          annulees: formatter(data.annulees)
        });
      } else {
        console.error('Erreur:', data.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Modifiez la fonction annulerReservation
const annulerReservation = async (id: string) => {
  console.log('🔍 ID reçu pour annulation:', id);  // ← Vérifiez que l'ID est bien passé
  
  if (!id) {
    console.error('❌ ID de réservation manquant');
    alert('Erreur: ID de réservation manquant');
    return;
  }
  
  if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
    return;
  }
  
  setCancellingId(id);
  
  try {
    console.log('📤 Envoi requête à:', `/api/reservations/${id}/cancel`);
    
    const response = await fetch(`/api/reservations/${id}/cancel`, {
      method: 'PATCH'
    });
    
    console.log('📥 Réponse status:', response.status);
    const data = await response.json();
    console.log('📥 Réponse data:', data);
    
    if (response.ok) {
      alert('✅ Réservation annulée avec succès');
      fetchReservations();
    } else {
      alert('❌ ' + (data.error || 'Erreur lors de l\'annulation'));
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
    alert('Erreur lors de l\'annulation');
  } finally {
    setCancellingId(null);
  }
};


  const formaterDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatutBadge = (statut: string) => {
    const badges: Record<string, string> = {
      CONFIRMEE: 'bg-green-100 text-green-800',
      EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
      ANNULEE: 'bg-red-100 text-red-800',
      TERMINEE: 'bg-gray-100 text-gray-800'
    };
    const labels: Record<string, string> = {
      CONFIRMEE: 'Confirmée',
      EN_ATTENTE: 'En attente',
      ANNULEE: 'Annulée',
      TERMINEE: 'Terminée'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[statut] || 'bg-gray-100'}`}>
        {labels[statut] || statut}
      </span>
    );
  };

  const CarteReservation = ({ reservation, showCancelButton = true }: { reservation: Reservation; showCancelButton?: boolean }) => {
    const peutAnnuler = () => {
      if (reservation.statut === 'ANNULEE') return false;
      const aujourdhui = new Date();
      const dateArrivee = new Date(reservation.date_arrivee);
      const heuresAvantArrivee = (dateArrivee.getTime() - aujourdhui.getTime()) / (1000 * 3600);
      return heuresAvantArrivee >= 24;
    };

    return (
      <div className="bg-white rounded-lg shadow-md border p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-800">
                Chambre {reservation.chambre.numero}
              </h3>
              {getStatutBadge(reservation.statut)}
            </div>
            
            <p className="text-gray-600">{reservation.chambre.type.libelle}</p>
            
            <div className="mt-3 space-y-1 text-sm text-gray-600">
              <p>📅 Du {formaterDate(reservation.date_arrivee)} au {formaterDate(reservation.date_depart)}</p>
              <p>👤 {reservation.nb_personnes} personne(s)</p>
              <p>💰 Prix total: <span className="font-bold text-green-600">{reservation.prix_total} €</span></p>
              <p className="text-xs text-gray-400">Réservé le {formaterDate(reservation.createdAt)}</p>
            </div>
          </div>
          
          {showCancelButton && reservation.statut !== 'ANNULEE' && (
            <div className="text-right">
              {peutAnnuler() ? (
                <button
  onClick={() => {
    console.log('🖱️ Clic sur annuler pour ID:', reservation.id);
    annulerReservation(reservation.id);
  }}
  disabled={cancellingId === reservation.id}
  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
>
  {cancellingId === reservation.id ? 'Annulation...' : 'Annuler'}
</button>
              ) : (
                <button
                  disabled
                  className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
                  title="Annulation impossible moins de 24h avant l'arrivée"
                >
                  Annulation impossible
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Mes réservations</h1>
          <p className="text-gray-600 mb-4">Veuillez vous connecter pour voir vos réservations</p>
          <button
            onClick={() => router.push('/sign-in')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de vos réservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Mes réservations
        </h1>

        {/* Réservations à venir */}
        {reservations.aVenir.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              📅 À venir ({reservations.aVenir.length})
            </h2>
            <div className="space-y-4">
              {reservations.aVenir.map((res) => (
                <CarteReservation key={res.id} reservation={res} showCancelButton={true} />
              ))}
            </div>
          </div>
        )}

        {/* Réservations passées */}
        {reservations.passees.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              ✅ Passées ({reservations.passees.length})
            </h2>
            <div className="space-y-4">
              {reservations.passees.map((res) => (
                <CarteReservation key={res.id} reservation={res} showCancelButton={false} />
              ))}
            </div>
          </div>
        )}

        {/* Réservations annulées */}
        {reservations.annulees.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              ❌ Annulées ({reservations.annulees.length})
            </h2>
            <div className="space-y-4">
              {reservations.annulees.map((res) => (
                <CarteReservation key={res.id} reservation={res} showCancelButton={false} />
              ))}
            </div>
          </div>
        )}

        {/* Aucune réservation */}
        {reservations.aVenir.length === 0 && 
         reservations.passees.length === 0 && 
         reservations.annulees.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-6xl mb-4">🏨</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Aucune réservation
            </h2>
            <p className="text-gray-500 mb-6">
              Vous n'avez pas encore effectué de réservation
            </p>
            <button
              onClick={() => router.push('/client/reservations')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Réserver maintenant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}