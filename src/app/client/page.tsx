"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function ClientPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && (!user )) {
      router.push("/dashboard");
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || !user ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
          <p className="text-lg font-medium text-gray-600">Chargement de votre espace client...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Espace Client</h1>
          <p className="text-gray-600 max-w-2xl mt-3">
            Bienvenue dans votre espace personnel. Ici vous pouvez consulter vos réservations, gérer vos séjours et retrouver toutes vos informations de voyage.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Mes réservations</h2>
            <p className="text-gray-600 mb-5">Consultez vos réservations en cours et à venir.</p>
            <button className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
              Voir mes réservations
            </button>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Profil</h2>
            <p className="text-gray-600 mb-5">Modifiez vos informations personnelles et préférences.</p>
            <button className="inline-flex items-center justify-center rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
              Gérer mon profil
            </button>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Historique</h2>
            <p className="text-gray-600 mb-5">Retrouvez tous vos séjours et factures passés.</p>
            <button className="inline-flex items-center justify-center rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700">
              Voir mon historique
            </button>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Offres</h2>
            <p className="text-gray-600 mb-5">Accédez aux meilleures offres disponibles pour votre prochain séjour.</p>
            <button className="inline-flex items-center justify-center rounded-full bg-yellow-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-700">
              Découvrir les offres
            </button>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Assistance</h2>
            <p className="text-gray-600 mb-5">Contactez le service client ou consultez les FAQ.</p>
            <button className="inline-flex items-center justify-center rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700">
              Contacter le support
            </button>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Documents</h2>
            <p className="text-gray-600 mb-5">Téléchargez vos confirmations et documents de voyage.</p>
            <button className="inline-flex items-center justify-center rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
              Accéder aux documents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
