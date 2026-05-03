"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface DashboardStats {
  arriveesDuJour: number;
  departsDuJour: number;
  chambresDisponibles: number;
  totalChambres: number;
}

export default function ReceptionnistePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (isLoaded && (!user || user.publicMetadata?.role !== "receptionniste")) {
      router.push("/dashboard");
    }
  }, [user, isLoaded, router]);

  useEffect(() => {
    if (mounted && user && user.publicMetadata?.role === "receptionniste") {
      fetchDashboardData();
    }
  }, [mounted, user]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/receptionniste/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Erreur chargement données:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (!isLoaded || !user || !mounted || user.publicMetadata?.role !== "receptionniste") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
        <div className="text-center">
          <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-[3px] border-amber-500 border-t-transparent"></div>
          <p className="text-lg font-light tracking-widest text-amber-500 uppercase">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] font-sans selection:bg-amber-200">
      
      {/* Hero Section */}
      <section className="relative flex h-[50vh] min-h-[400px] w-full items-center justify-center overflow-hidden">
        <Image
          src="/images/hero.png" // Assumes hero.png exists from the client page
          alt="Luxury Resort Lobby"
          fill
          sizes="100vw"
          className="object-cover scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f7] via-transparent to-black/50" />
        
        <div className="relative z-10 text-center px-4 mt-8">
          <span className="mb-4 block text-sm font-medium tracking-[0.3em] text-amber-400 uppercase">
            Gestion & Excellence
          </span>
          <h1 className="mb-6 font-serif text-5xl md:text-7xl font-light text-white drop-shadow-lg">
            Espace Réception
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl font-light text-gray-200">
            Bienvenue {user.firstName || 'dans votre espace'}. Préparez-vous à offrir un service exceptionnel à nos invités.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 -mt-24 relative z-20">
        
        {/* KPI Section */}
        <section className="mb-16">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-white p-8 shadow-xl border border-gray-100 flex flex-col items-center justify-center text-center transform transition-transform hover:-translate-y-1">
              <span className="text-sm font-medium tracking-widest text-gray-500 uppercase mb-2">Arrivées du Jour</span>
              {loadingStats ? (
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent mt-2"></div>
              ) : (
                <span className="text-5xl font-serif text-amber-600">{stats?.arriveesDuJour || 0}</span>
              )}
            </div>
            <div className="rounded-xl bg-white p-8 shadow-xl border border-gray-100 flex flex-col items-center justify-center text-center transform transition-transform hover:-translate-y-1">
              <span className="text-sm font-medium tracking-widest text-gray-500 uppercase mb-2">Départs du Jour</span>
              {loadingStats ? (
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-500 border-t-transparent mt-2"></div>
              ) : (
                <span className="text-5xl font-serif text-slate-700">{stats?.departsDuJour || 0}</span>
              )}
            </div>
            <div className="rounded-xl bg-[#0a0a0a] p-8 shadow-xl flex flex-col items-center justify-center text-center transform transition-transform hover:-translate-y-1">
              <span className="text-sm font-medium tracking-widest text-amber-400 uppercase mb-2">Chambres Libres</span>
              {loadingStats ? (
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-white border-t-transparent mt-2"></div>
              ) : (
                <span className="text-5xl font-serif text-white">{stats?.chambresDisponibles || 0} <span className="text-2xl text-gray-500">/ {stats?.totalChambres || 0}</span></span>
              )}
            </div>
          </div>
        </section>

        {/* Action Dashboard */}
        <section className="mb-32">
          <div className="rounded-2xl bg-white p-8 md:p-12 shadow-2xl border border-gray-100">
            <div className="mb-10 text-center">
              <h2 className="font-serif text-3xl md:text-4xl text-gray-900">Opérations Quotidiennes</h2>
              <div className="mx-auto mt-4 h-0.5 w-16 bg-amber-500"></div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              
              <Link href="/receptionniste/arrivees" className="group relative overflow-hidden rounded-xl bg-[#faf9f7] p-8 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700 group-hover:scale-110 transition-transform">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-gray-900 mb-2">Check-In</h3>
                <p className="text-sm text-gray-500 font-light mb-6">Accueillez les clients attendus aujourd'hui et validez leur arrivée.</p>
                <div className="flex items-center whitespace-nowrap text-sm font-medium tracking-widest text-amber-600 uppercase group-hover:text-amber-800">
                  Gérer <span className="ml-2 inline-block group-hover:translate-x-2 transition-transform">&rarr;</span>
                </div>
              </Link>

              <Link href="/receptionniste/departs" className="group relative overflow-hidden rounded-xl bg-[#faf9f7] p-8 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-700 group-hover:scale-110 transition-transform">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-gray-900 mb-2">Check-Out</h3>
                <p className="text-sm text-gray-500 font-light mb-6">Procédez aux départs, éditez les factures et libérez les chambres.</p>
                <div className="flex items-center whitespace-nowrap text-sm font-medium tracking-widest text-slate-600 uppercase group-hover:text-slate-800">
                  Gérer <span className="ml-2 inline-block group-hover:translate-x-2 transition-transform">&rarr;</span>
                </div>
              </Link>

              <Link href="/receptionniste/reservations" className="group relative overflow-hidden rounded-xl bg-[#faf9f7] p-8 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700 group-hover:scale-110 transition-transform">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-gray-900 mb-2">Réservations</h3>
                <p className="text-sm text-gray-500 font-light mb-6">Consultez l'ensemble des réservations et modifiez les statuts.</p>
                <div className="flex items-center whitespace-nowrap text-sm font-medium tracking-widest text-blue-600 uppercase group-hover:text-blue-800">
                  Consulter <span className="ml-2 inline-block group-hover:translate-x-2 transition-transform">&rarr;</span>
                </div>
              </Link>

              <Link href="/receptionniste/chambres" className="group relative overflow-hidden rounded-xl bg-gray-900 p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-amber-400 group-hover:scale-110 transition-transform">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-white mb-2">Plan des Chambres</h3>
                <p className="text-sm text-gray-300 font-light mb-6">Visualisez l'état des chambres (nettoyage, disponibilité, maintenance).</p>
                <div className="flex items-center whitespace-nowrap text-sm font-medium tracking-widest text-amber-400 uppercase group-hover:text-amber-300">
                  Visualiser <span className="ml-2 inline-block group-hover:translate-x-2 transition-transform">&rarr;</span>
                </div>
              </Link>

              <Link href="/receptionniste/clients" className="group relative overflow-hidden rounded-xl bg-[#faf9f7] p-8 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 group-hover:scale-110 transition-transform">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-gray-900 mb-2">Liste des Clients</h3>
                <p className="text-sm text-gray-500 font-light mb-6">Recherchez un client, modifiez ou annulez ses séjours.</p>
                <div className="flex items-center whitespace-nowrap text-sm font-medium tracking-widest text-indigo-600 uppercase group-hover:text-indigo-800">
                  Gérer <span className="ml-2 inline-block group-hover:translate-x-2 transition-transform">&rarr;</span>
                </div>
              </Link>

              <Link href="/receptionniste/demandes" className="group relative overflow-hidden rounded-xl bg-[#faf9f7] p-8 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-700 group-hover:scale-110 transition-transform">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-gray-900 mb-2">Demandes & Conciergerie</h3>
                <p className="text-sm text-gray-500 font-light mb-6">Répondez aux demandes des clients en temps réel pour assurer un service irréprochable.</p>
                <div className="flex items-center whitespace-nowrap text-sm font-medium tracking-widest text-rose-600 uppercase group-hover:text-rose-800">
                  Traiter <span className="ml-2 inline-block group-hover:translate-x-2 transition-transform">&rarr;</span>
                </div>
              </Link>

            </div>
          </div>
        </section>

      </main>

      {/* Premium Footer */}
      <footer className="bg-[#0a0a0a] text-white pt-10 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-serif tracking-widest mb-4">L'ÉCRIN - STAFF</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-gray-600 font-light">
            <p>&copy; {new Date().getFullYear()} L'Écrin Hôtel. Interface Personnel.</p>
            <div className="hidden md:block w-1 h-1 bg-gray-600 rounded-full"></div>
            <a href="/sign-out" className="hover:text-amber-500 transition-colors">Déconnexion</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
