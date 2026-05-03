'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ChambreDisponible {
  id_ch: string;
  numero: string;
  type: { libelle: string; prix: number };
  capacite: number;
  prixEstimé: number;
  nombreNuits: number;
}

interface ClientInfo {
  nom: string;
  email: string;
  telephone: string;
}

export default function ReservationPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  
  // Étape 1: Formulaire de recherche
  const [step, setStep] = useState(1);
  const [searchData, setSearchData] = useState({
    dateArrivee: '',
    dateDepart: '',
    nbPersonnes: 1
  });
  
  // Étape 2: Chambres disponibles
  const [chambres, setChambres] = useState<ChambreDisponible[]>([]);
  const [selectedChambre, setSelectedChambre] = useState<ChambreDisponible | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Étape 3: Infos client
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    nom: user?.fullName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    telephone: ''
  });

  // Rechercher les chambres disponibles
  const rechercherChambres = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const params = new URLSearchParams({
        dateArrivee: searchData.dateArrivee,
        dateDepart: searchData.dateDepart,
        nbPersonnes: searchData.nbPersonnes.toString()
      });
      
      const res = await fetch(`/api/chambres/disponibles?${params}`);
      const data = await res.json();
      
      if (res.ok) {
        setChambres(data);
        setStep(2);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  // Choisir une chambre
  const choisirChambre = (chambre: ChambreDisponible) => {
    setSelectedChambre(chambre);
    setStep(3);
  };

  // Confirmer la réservation - VERSION CORRIGÉE
const confirmerReservation = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  // Vérifier que toutes les données sont présentes
  console.log('Données avant envoi:', {
    date_arrivee: searchData.dateArrivee,
    date_depart: searchData.dateDepart,
    nb_personnes: searchData.nbPersonnes,
    chambreId: selectedChambre?.id_ch,
    clientNom: clientInfo.nom,
    clientEmail: clientInfo.email,
    clientTelephone: clientInfo.telephone
  });
  
  try {
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date_arrivee: searchData.dateArrivee,  // ← Envoyer la string directement, PAS new Date()
        date_depart: searchData.dateDepart,    // ← Envoyer la string directement
        nb_personnes: searchData.nbPersonnes,
        chambreId: selectedChambre?.id_ch,
        clientNom: clientInfo.nom,
        clientEmail: clientInfo.email,
        clientTelephone: clientInfo.telephone
      })
    });
    
    const data = await response.json();
    console.log('Réponse:', response.status, data);
    
    if (response.ok) {
      alert('✅ Réservation confirmée !');
      router.push('/client/mes-reservations');
    } else {
      alert('❌ Erreur: ' + (data.error || 'Erreur inconnue'));
    }
  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur lors de la réservation');
  } finally {
    setLoading(false);
  }
};

  if (!isSignedIn) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Réservation</h1>
        <p>Veuillez vous connecter pour effectuer une réservation</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Réserver une chambre</h1>
      
      {/* Étape 1: Formulaire de recherche */}
      {step === 1 && (
        <div className="bg-white shadow rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Rechercher une chambre</h2>
          <form onSubmit={rechercherChambres} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Date d'arrivée</label>
              <input
                type="date"
                required
                value={searchData.dateArrivee}
                onChange={(e) => setSearchData({...searchData, dateArrivee: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Date de départ</label>
              <input
                type="date"
                required
                value={searchData.dateDepart}
                onChange={(e) => setSearchData({...searchData, dateDepart: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={searchData.dateArrivee}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Nombre de personnes</label>
              <input
                type="number"
                required
                min="1"
                max="4"
                value={searchData.nbPersonnes}
                onChange={(e) => setSearchData({...searchData, nbPersonnes: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Recherche...' : 'Rechercher'}
            </button>
          </form>
        </div>
      )}
      
      {/* Étape 2: Affichage des chambres disponibles */}
      {step === 2 && (
        <div>
          <button
            onClick={() => setStep(1)}
            className="mb-4 text-blue-600 hover:underline"
          >
            ← Modifier les dates
          </button>
          
          <h2 className="text-xl font-semibold mb-4">
            Chambres disponibles ({chambres.length})
          </h2>
          
          {chambres.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p>Aucune chambre disponible pour ces dates</p>
              <button onClick={() => setStep(1)} className="mt-4 text-blue-600">
                Modifier la recherche
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {chambres.map((chambre) => (
                <div key={chambre.id_ch} className="border rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">Chambre {chambre.numero}</h3>
                      <p className="text-gray-600">{chambre.type.libelle}</p>
                      <p className="text-sm text-gray-500">Capacité: {chambre.capacite} personnes</p>
                      <p className="text-sm text-gray-500">{chambre.nombreNuits} nuit(s)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {chambre.prixEstimé} €
                      </p>
                      <p className="text-sm text-gray-500">
                        soit {chambre.type.prix}€/nuit
                      </p>
                      <button
                        onClick={() => choisirChambre(chambre)}
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                      >
                        Choisir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Étape 3: Formulaire infos client */}
      {step === 3 && selectedChambre && (
        <div>
          <button
            onClick={() => setStep(2)}
            className="mb-4 text-blue-600 hover:underline"
          >
            ← Retour aux chambres
          </button>
          
          <div className="bg-white shadow rounded-lg p-6 border">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Vos informations</h2>
            
            <div className="mb-6 p-4 bg-gray-50 rounded border">
              <p className="text-gray-800"><strong>Chambre:</strong> {selectedChambre.numero} ({selectedChambre.type.libelle})</p>
              <p className="text-gray-800"><strong>Dates:</strong> du {new Date(searchData.dateArrivee).toLocaleDateString()} au {new Date(searchData.dateDepart).toLocaleDateString()}</p>
              <p className="text-gray-800"><strong>Personnes:</strong> {searchData.nbPersonnes}</p>
              <p className="text-gray-800"><strong>Prix total:</strong> {selectedChambre.prixEstimé} €</p>
            </div>
            
            <form onSubmit={confirmerReservation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={clientInfo.nom}
                  onChange={(e) => setClientInfo({...clientInfo, nom: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Email *</label>
                <input
                  type="email"
                  required
                  value={clientInfo.email}
                  onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Téléphone</label>
                <input
                  type="tel"
                  value={clientInfo.telephone}
                  onChange={(e) => setClientInfo({...clientInfo, telephone: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Confirmation...' : 'Confirmer la réservation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}