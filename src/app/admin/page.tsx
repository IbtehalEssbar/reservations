'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && (!user || user.publicMetadata?.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || !user || user.publicMetadata?.role !== 'admin') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-600">Vérification des autorisations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Interface Administrateur</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Gestion des Utilisateurs */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gestion des Utilisateurs</h2>
            <p className="text-gray-600 mb-4">Gérer les comptes utilisateurs, rôles et permissions.</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Accéder
            </button>
          </div>

          {/* Gestion des Réservations */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gestion des Réservations</h2>
            <p className="text-gray-600 mb-4">Voir et gérer toutes les réservations d'hôtels.</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Accéder
            </button>
          </div>

          {/* Gestion des Hôtels */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gestion des Hôtels</h2>
            <p className="text-gray-600 mb-4">Ajouter, modifier ou supprimer des hôtels.</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Accéder
            </button>
          </div>

          {/* Statistiques */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistiques</h2>
            <p className="text-gray-600 mb-4">Voir les statistiques générales du système.</p>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
              Voir
            </button>
          </div>

          {/* Paramètres Système */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Paramètres Système</h2>
            <p className="text-gray-600 mb-4">Configurer les paramètres globaux de l'application.</p>
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Configurer
            </button>
          </div>

          {/* Logs et Audit */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Logs et Audit</h2>
            <p className="text-gray-600 mb-4">Consulter les logs système et l'historique des actions.</p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Consulter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}