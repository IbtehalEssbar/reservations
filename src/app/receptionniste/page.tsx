"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ReceptionnistePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && (!user || user.publicMetadata?.role !== "receptionniste")) {
      router.push("/dashboard");
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || !user || user.publicMetadata?.role !== "receptionniste") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
          <p className="text-lg font-medium text-gray-600">Vérification de votre accès...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Espace Réceptionniste</h1>
          <p className="text-gray-600 max-w-2xl">
            Bienvenue dans l’interface dédiée au personnel de réception. Ici vous pouvez gérer les arrivées,
            départs, clients et réservations en quelques clics.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Arrivées</h2>
            <p className="text-gray-600 mb-5">Voir les clients attendus aujourd'hui et préparer les check-in.</p>
            <button className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
              Gérer les arrivées
            </button>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Départs</h2>
            <p className="text-gray-600 mb-5">Consulter les départs du jour et finaliser les factures.</p>
            <button className="inline-flex items-center justify-center rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
              Gérer les départs
            </button>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Réservations</h2>
            <p className="text-gray-600 mb-5">Rechercher, modifier ou confirmer une réservation existante.</p>
            <button className="inline-flex items-center justify-center rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700">
              Consulter les réservations
            </button>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Clients</h2>
            <p className="text-gray-600 mb-5">Accéder aux profils clients et aux historiques de séjour.</p>
            <button className="inline-flex items-center justify-center rounded-full bg-yellow-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-700">
              Voir les clients
            </button>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Chambres</h2>
            <p className="text-gray-600 mb-5">Suivre l’état des chambres et les disponibilités en temps réel.</p>
            <button className="inline-flex items-center justify-center rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700">
              Vérifier les chambres
            </button>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Messages et demandes</h2>
            <p className="text-gray-600 mb-5">Traiter les demandes de services, questions et demandes spéciales.</p>
            <button className="inline-flex items-center justify-center rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
              Gérer les demandes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
