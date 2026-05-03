'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Avis {
  id: string;
  clientNom: string;
  note: number;
  commentaire: string;
  statut: string;
  dateCreation: string;
  datePublication?: string;
  client?: {
    email: string;
    nom: string;
  };
}

export default function AdminAvisPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [avis, setAvis] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState('tous');
  const [message, setMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn) {
      verifierAdmin();
    }
  }, [isSignedIn]);

  const verifierAdmin = async () => {
    try {
      const response = await fetch('/api/admin/verifier');
      const data = await response.json();
      if (!data.isAdmin) {
        router.push('/');
      } else {
        setIsAdmin(true);
        fetchAvis();
      }
    } catch (error) {
      router.push('/');
    }
  };

  const fetchAvis = async () => {
    setLoading(true);
    try {
      const url = filtre === 'en-attente' 
        ? '/api/admin/avis?filtre=en-attente'
        : '/api/admin/avis';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setAvis(data);
      } else {
        setMessage('Erreur: ' + data.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const gererAvis = async (id: string, action: 'valider' | 'rejeter') => {
    try {
      const response = await fetch('/api/admin/avis', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      });
      
      if (response.ok) {
        setMessage(`✅ Avis ${action === 'valider' ? 'validé' : 'rejeté'} avec succès`);
        fetchAvis();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setMessage('❌ ' + data.error);
      }
    } catch (error) {
      setMessage('❌ Erreur lors de l\'opération');
    }
  };

  const renderStars = (note: number) => {
    return '⭐'.repeat(note) + '☆'.repeat(5 - note);
  };

  const getStatutBadge = (statut: string) => {
    const badges: Record<string, string> = {
      EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
      VALIDE: 'bg-green-100 text-green-800',
      REJETE: 'bg-red-100 text-red-800'
    };
    const labels: Record<string, string> = {
      EN_ATTENTE: '⏳ En attente',
      VALIDE: '✓ Validé',
      REJETE: '✗ Rejeté'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badges[statut]}`}>
        {labels[statut]}
      </span>
    );
  };

  if (!isLoaded || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Vérification des droits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Gestion des avis clients
          </h1>
          <p className="text-gray-500 mt-2">
            Validez ou rejetez les avis avant leur publication sur le site
          </p>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-lg bg-blue-100 text-blue-700 border border-blue-200">
            {message}
          </div>
        )}

        {/* Filtres */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFiltre('tous')}
            className={`px-5 py-2 rounded-lg transition-colors ${
              filtre === 'tous' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            📋 Tous les avis
          </button>
          <button
            onClick={() => {
              setFiltre('en-attente');
              fetchAvis();
            }}
            className={`px-5 py-2 rounded-lg transition-colors ${
              filtre === 'en-attente' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            ⏳ En attente
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Chargement des avis...</p>
          </div>
        ) : avis.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-500 text-lg">Aucun avis à afficher</p>
          </div>
        ) : (
          <div className="space-y-4">
            {avis.map((a) => (
              <div key={a.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow p-6">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <p className="font-semibold text-gray-800 text-lg">
                        {a.clientNom}
                      </p>
                      {getStatutBadge(a.statut)}
                    </div>
                    
                    <div className="text-amber-500 text-sm mb-3">
                      {renderStars(a.note)}
                    </div>
                    
                    <p className="text-gray-600 italic leading-relaxed mb-3">
                      "{a.commentaire}"
                    </p>
                    
                    <div className="flex gap-4 text-xs text-gray-400">
                      <span>📅 Soumis le: {new Date(a.dateCreation).toLocaleString('fr-FR')}</span>
                    </div>
                  </div>
                  
                  {a.statut === 'EN_ATTENTE' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => gererAvis(a.id, 'valider')}
                        className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        ✓ Valider
                      </button>
                      <button
                        onClick={() => gererAvis(a.id, 'rejeter')}
                        className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        ✗ Rejeter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}