import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth, clerkClient } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const user = await clerkClient.users.getUser(userId);
    if (user.publicMetadata?.role !== "receptionniste" && user.publicMetadata?.role !== "administrateur") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const { chambreId, reservationId } = await request.json();

    if (!chambreId || !reservationId) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
    }

    // Effectuer le Check-In : 
    // 1. Mettre à jour la chambre en OCCUPEE
    // 2. La réservation reste CONFIRMEE (ou on peut la marquer comme EN_COURS si l'enum le permettait, 
    // mais dans votre schéma le statut CONFIRMEE est utilisé jusqu'au Check-out -> TERMINEE).

    // Transaction pour assurer l'intégrité
    await prisma.$transaction([
      prisma.chambre.update({
        where: { id_ch: chambreId },
        data: { status: "OCCUPEE" }
      }),
      // Optionnel : on pourrait stocker la date de check-in réelle si on ajoute un champ
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur Check-In:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
