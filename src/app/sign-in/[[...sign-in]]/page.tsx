"use client";
import Image from "next/image";
import { SignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoaded, router]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <section className="relative flex-1 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-violet-900 px-6 py-10 text-white lg:px-12 lg:py-16">
          <div className="absolute inset-0 opacity-30">
            <Image
              src="/hot.jpg"
              alt="Réservation hôtel"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-slate-950/75 mix-blend-multiply" />
          </div>

          <div className="relative z-10 mx-auto flex h-full max-w-xl flex-col justify-between gap-8">
            <div>
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-slate-200">
                RéservHotel Pro
              </span>

              <h1 className="mt-8 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
                Connectez-vous et gérez vos réservations rapidement.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                Accédez à votre espace personnel, suivez vos réservations et profitez d'une interface moderne pensée pour les clients, réceptionnistes et administrateurs.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
                <p className="font-semibold text-slate-100">Support 24/7</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">Besoin d'aide pour votre séjour ou votre compte ? Notre équipe est là pour vous.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
                <p className="font-semibold text-slate-100">Offres exclusives</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">Accédez rapidement aux meilleures offres et promotions disponibles pour votre prochain voyage.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex-1 bg-slate-100 px-6 py-10 text-slate-950 lg:px-12 lg:py-16">
          <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Connexion</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Bienvenue de retour</h2>
              <p className="mt-3 text-sm text-slate-500">Connectez-vous pour accéder à votre tableau de bord et retrouver vos réservations.</p>
            </div>

            <div className="space-y-6">
              <SignIn forceRedirectUrl="/dashboard" appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "rounded-3xl border border-slate-200 shadow-xl shadow-slate-900/5",
                  headerTitle: "text-2xl font-semibold text-slate-900",
                  headerSubtitle: "text-slate-500",
                  formButtonPrimary: "bg-slate-950 text-white hover:bg-slate-800 rounded-full py-3",
                  formFieldInput: "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-900 focus:ring-slate-900/10",
                },
              }} />
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              <p className="font-medium text-slate-900">Pourquoi se connecter ?</p>
              <ul className="mt-3 space-y-2">
                <li>• Gestion sécurisée de vos réservations</li>
                <li>• Accès aux offres et documents de voyage</li>
                <li>• Interface adaptée à votre rôle</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
  