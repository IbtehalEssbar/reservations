"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

interface Avis {
  id: string;
  clientNom: string;
  note: number;
  commentaire: string;
  datePublication: string;
}

export default function ClientPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // État pour les avis
  const [avis, setAvis] = useState<Avis[]>([]);
  const [showAvisForm, setShowAvisForm] = useState(false);
  const [avisFormData, setAvisFormData] = useState({
    note: 5,
    commentaire: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [avisMessage, setAvisMessage] = useState('');

  useEffect(() => {
    setMounted(true);
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [user, isLoaded, router]);

  // Charger les avis validés
  useEffect(() => {
    if (mounted) {
      fetchAvis();
    }
  }, [mounted]);

  const fetchAvis = async () => {
    try {
      const response = await fetch('/api/avis/validates');
      const data = await response.json();
      if (response.ok) {
        setAvis(data);
      }
    } catch (error) {
      console.error('Erreur chargement avis:', error);
    }
  };

  const soumettreAvis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAvisMessage('Veuillez vous connecter pour laisser un avis');
      return;
    }

    setSubmitting(true);
    setAvisMessage('');

    try {
      const response = await fetch('/api/avis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientNom: user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Client',
          note: avisFormData.note,
          commentaire: avisFormData.commentaire
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setAvisMessage('✅ Merci pour votre avis ! Il sera publié après validation.');
        setAvisFormData({ note: 5, commentaire: '' });
        setShowAvisForm(false);
        setTimeout(() => setAvisMessage(''), 3000);
      } else {
        setAvisMessage('❌ ' + data.error);
      }
    } catch (error) {
      setAvisMessage('❌ Erreur lors de l\'envoi');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (note: number) => {
    return '⭐'.repeat(note) + '☆'.repeat(5 - note);
  };

  if (!isLoaded || !user || !mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
        <div className="text-center">
          <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-[3px] border-amber-500 border-t-transparent"></div>
          <p className="text-lg font-light tracking-widest text-amber-500 uppercase">Préparation de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] font-sans selection:bg-amber-200">
      
      {/* Hero Section */}
      <section className="relative flex h-[85vh] min-h-[600px] w-full items-center justify-center overflow-hidden">
        <Image
          src="/images/hero.png"
          alt="Luxury Resort Pool at Sunset"
          fill
          sizes="100vw"
          className="object-cover scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f7] via-transparent to-black/50" />
        
        <div className="relative z-10 text-center px-4 mt-16">
          <span className="mb-4 block text-sm font-medium tracking-[0.3em] text-amber-400 uppercase">
            Bienvenue dans l'excellence
          </span>
          <h1 className="mb-6 font-serif text-5xl md:text-8xl font-light text-white drop-shadow-lg">
            Bonjour, {user.firstName || 'Monsieur'}
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl font-light text-gray-200">
            Votre retraite exclusive vous attend. Laissez-nous prendre soin de chaque détail de votre prochain séjour.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 -mt-24 relative z-20">
        
        {/* Action Dashboard */}
        <section className="mb-32">
          <div className="rounded-2xl bg-white p-8 md:p-12 shadow-2xl border border-gray-100">
            <div className="mb-10 text-center">
              <h2 className="font-serif text-3xl md:text-4xl text-gray-900">Votre Espace Personnel</h2>
              <div className="mx-auto mt-4 h-0.5 w-16 bg-amber-500"></div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              <Link href="/client/reservations" className="group relative overflow-hidden rounded-xl bg-[#faf9f7] p-8 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700 group-hover:scale-110 transition-transform">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-gray-900 mb-2">Mes Séjours</h3>
                <p className="text-sm text-gray-500 font-light mb-6">Gérez vos réservations en cours et futures en toute simplicité.</p>
                <div className="flex items-center whitespace-nowrap text-sm font-medium tracking-widest text-amber-600 uppercase group-hover:text-amber-800">
                  Accéder <span className="ml-2 inline-block group-hover:translate-x-2 transition-transform">&rarr;</span>
                </div>
              </Link>

              <Link href="/client/historique" className="group relative overflow-hidden rounded-xl bg-[#faf9f7] p-8 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-700 group-hover:scale-110 transition-transform">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-gray-900 mb-2">Historique</h3>
                <p className="text-sm text-gray-500 font-light mb-6">Retrouvez les détails et factures de vos anciennes visites.</p>
                <div className="flex items-center whitespace-nowrap text-sm font-medium tracking-widest text-slate-600 uppercase group-hover:text-slate-800">
                  Consulter <span className="ml-2 inline-block group-hover:translate-x-2 transition-transform">&rarr;</span>
                </div>
              </Link>

              <Link href="/client/support" className="group relative overflow-hidden rounded-xl bg-gray-900 p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-amber-400 group-hover:scale-110 transition-transform">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-white mb-2">Conciergerie</h3>
                <p className="text-sm text-gray-300 font-light mb-6">Notre équipe dédiée est à votre service 24h/24 pour toute demande.</p>
                <div className="flex items-center whitespace-nowrap text-sm font-medium tracking-widest text-amber-400 uppercase group-hover:text-amber-300">
                  Contacter <span className="ml-2 inline-block group-hover:translate-x-2 transition-transform">&rarr;</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Recommended Rooms Section */}
        <section className="mb-32">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-4xl text-gray-900">Nos Suites Exclusives</h2>
            <div className="mx-auto mt-4 h-0.5 w-16 bg-amber-500"></div>
            <p className="mt-6 text-gray-500 font-light text-lg">L'élégance repensée pour votre confort absolu</p>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="group relative overflow-hidden rounded-sm bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative h-[450px] w-full overflow-hidden">
                <Image
                  src="/images/ocean.png"
                  alt="Ocean View Room"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 transition-opacity group-hover:opacity-90" />
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="mb-3 inline-block bg-white/20 px-3 py-1 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur-md">
                    Vue Océan
                  </div>
                  <h3 className="font-serif text-3xl text-white mb-2">Suite Panoramique</h3>
                  <div className="flex items-end justify-between">
                    <p className="text-gray-300 font-light max-w-sm line-clamp-2">
                      Éveillez vos sens avec une vue imprenable sur l'horizon depuis votre terrasse privée.
                    </p>
                    <span className="text-2xl text-white font-medium">350€<span className="text-sm font-light">/nuit</span></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-sm bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative h-[450px] w-full overflow-hidden">
                <Image
                  src="/images/deluxe.png"
                  alt="Deluxe Suite"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 transition-opacity group-hover:opacity-90" />
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="mb-3 inline-block bg-amber-600 px-3 py-1 text-xs font-semibold tracking-widest text-white uppercase">
                    Signature
                  </div>
                  <h3 className="font-serif text-3xl text-white mb-2">Suite Royale</h3>
                  <div className="flex items-end justify-between">
                    <p className="text-gray-300 font-light max-w-sm line-clamp-2">
                      L'apogée du luxe moderne avec un mobilier de créateur et un grand salon indépendant.
                    </p>
                    <span className="text-2xl text-white font-medium">580€<span className="text-sm font-light">/nuit</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experiences Section */}
        <section className="mb-16">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-4xl text-gray-900">Expériences Inoubliables</h2>
            <div className="mx-auto mt-4 h-0.5 w-16 bg-amber-500"></div>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            <Link href="/client/restaurant" className="group cursor-pointer block">
              <div className="relative h-[500px] w-full overflow-hidden rounded-sm shadow-lg">
                <Image src="/images/restaurant.png" alt="Gastronomic Restaurant" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
              </div>
              <div className="mt-8 text-center">
                <h3 className="text-3xl font-serif text-gray-900 group-hover:text-amber-700 transition-colors">La Table Étoilée</h3>
                <p className="mt-3 text-gray-500 font-light max-w-md mx-auto">Une aventure culinaire signée par notre chef exécutif. Découvrez des saveurs locales raffinées.</p>
                <span className="mt-4 inline-block border-b border-amber-600 text-sm tracking-widest text-amber-700 uppercase pb-1 group-hover:border-amber-400">Découvrir le Menu</span>
              </div>
            </Link>
            
            <Link href="/client/spa" className="group cursor-pointer block">
              <div className="relative h-[500px] w-full overflow-hidden rounded-sm shadow-lg">
                <Image src="/images/spa.png" alt="Luxury Spa" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
              </div>
              <div className="mt-8 text-center">
                <h3 className="text-3xl font-serif text-gray-900 group-hover:text-amber-700 transition-colors">Le Spa Sérénité</h3>
                <p className="mt-3 text-gray-500 font-light max-w-md mx-auto">Un sanctuaire de bien-être dédié à votre relaxation absolue. Laissez-vous porter par la plénitude.</p>
                <span className="mt-4 inline-block border-b border-amber-600 text-sm tracking-widest text-amber-700 uppercase pb-1 group-hover:border-amber-400">Réserver un soin</span>
              </div>
            </Link>
          </div>
        </section>

        {/* ==================== SECTION AVIS CLIENTS AJOUTÉE ==================== */}
        <section className="mt-32 mb-20">
          <div className="rounded-2xl bg-white p-8 md:p-12 shadow-xl border border-gray-100">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl text-gray-900">
                Ce que disent nos clients
              </h2>
              <div className="mx-auto mt-4 h-0.5 w-16 bg-amber-500"></div>
              <p className="mt-4 text-gray-500 font-light">
                Des séjours authentiques, des souvenirs inoubliables
              </p>
            </div>

            {/* Liste des avis validés */}
            {avis.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 mb-12">
                {avis.map((a) => (
                  <div key={a.id} className="bg-[#faf9f7] rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-800">{a.clientNom}</p>
                        <div className="text-amber-500 text-sm mt-1">
                          {renderStars(a.note)}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(a.datePublication).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-gray-600 italic leading-relaxed">
                      "{a.commentaire}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 mb-8">
                <p>Soyez le premier à partager votre expérience !</p>
              </div>
            )}

            {/* Bouton ou formulaire d'avis */}
            {!showAvisForm ? (
              <div className="text-center">
                <button
                  onClick={() => setShowAvisForm(true)}
                  className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium tracking-wide shadow-md"
                >
                  ✍️ Donner mon avis
                </button>
              </div>
            ) : (
              <div className="max-w-lg mx-auto bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-serif text-gray-800 mb-4 text-center">
                  Partagez votre expérience
                </h3>
                
                <form onSubmit={soumettreAvis} className="space-y-4">
                  {/* Note étoiles */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                      Votre note
                    </label>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setAvisFormData({ ...avisFormData, note: n })}
                          className={`text-3xl transition-all hover:scale-110 ${
                            avisFormData.note >= n ? 'text-amber-500' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Commentaire */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Votre commentaire
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={avisFormData.commentaire}
                      onChange={(e) => setAvisFormData({ ...avisFormData, commentaire: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Décrivez votre séjour..."
                    />
                  </div>

                  {/* Message de retour */}
                  {avisMessage && (
                    <div className={`p-3 rounded-lg text-center ${
                      avisMessage.includes('✅') 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {avisMessage}
                    </div>
                  )}

                  {/* Boutons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAvisForm(false);
                        setAvisMessage('');
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 disabled:bg-amber-300 transition-colors"
                    >
                      {submitting ? 'Envoi...' : 'Envoyer'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Premium Footer */}
      <footer className="bg-[#0a0a0a] text-white pt-20 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-4 mb-16 border-b border-gray-800 pb-16">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-3xl font-serif tracking-widest mb-6">L'ÉCRIN</h2>
              <p className="text-gray-400 font-light max-w-sm mb-6">
                L'art de recevoir revisité. Profitez d'une expérience d'hospitalité sans pareille où luxe, confort et nature se rencontrent.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-amber-600 hover:border-amber-600 transition-colors cursor-pointer">
                  <span>In</span>
                </div>
                <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-amber-600 hover:border-amber-600 transition-colors cursor-pointer">
                  <span>Fb</span>
                </div>
                <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-amber-600 hover:border-amber-600 transition-colors cursor-pointer">
                  <span>Ig</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-serif mb-6 text-amber-500">Navigation</h3>
              <ul className="space-y-4 text-gray-400 font-light">
                <li><Link href="/client/reservations" className="hover:text-white transition-colors">Mes Réservations</Link></li>
                <li><Link href="/client/historique" className="hover:text-white transition-colors">Historique</Link></li>
                <li><Link href="/client/spa" className="hover:text-white transition-colors">Le Spa</Link></li>
                <li><Link href="/client/restaurant" className="hover:text-white transition-colors">Le Restaurant</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-serif mb-6 text-amber-500">Contact</h3>
              <ul className="space-y-4 text-gray-400 font-light">
                <li>123 Avenue de la Plage, Riviera</li>
                <li>+33 1 23 45 67 89</li>
                <li>contact@lecrin-hotel.com</li>
                <li>Conciergerie 24/7</li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 font-light">
            <p>&copy; {new Date().getFullYear()} L'Écrin Hôtel. Tous droits réservés.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
              <a href="#" className="hover:text-white transition-colors">Politique de Confidentialité</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}