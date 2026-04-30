"use client"; // Très important : cela dit à Next.js de l'exécuter côté navigateur

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardDispatcher() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    // console.log(user?.publicMetadata?.role);
    // On attend que Clerk ait fini de charger les infos de l'utilisateur
    if (isLoaded) {
      if (!user) {
        router.push("/sign-in");
      } else {
        // On vérifie le rôle
        const role = user.publicMetadata?.role;
        
        // Redirection fluide côté client
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "receptionniste") {
          router.push("/receptionniste");
        } else {
          router.push("/client");
        }
      }
    }
  }, [user, isLoaded, router]);

  // Ce qui s'affiche pendant la fraction de seconde où Clerk cherche le rôle
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-medium text-gray-600">Ouverture de votre espace...</p>
    </div>
  );
}