import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth, clerkClient } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const user = await clerkClient.users.getUser(userId);
    if (user.publicMetadata?.role !== "receptionniste" && user.publicMetadata?.role !== "administrateur") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const reservationId = params.id;
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { chambre: { include: { type: true } } }
    });

    if (!reservation) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    if (reservation.statut !== "CONFIRMEE" && reservation.statut !== "EN_ATTENTE") {
      return NextResponse.json({ error: "Impossible d'annuler cette réservation" }, { status: 400 });
    }

    // Calcul des pénalités
    const now = new Date();
    const arrivee = new Date(reservation.date_arrivee);
    const msToArrival = arrivee.getTime() - now.getTime();
    const hoursToArrival = msToArrival / (1000 * 60 * 60);

    let penalite = 0;
    // Règle métier : < 48h = 1 nuit de pénalité, sinon 0.
    if (hoursToArrival > 0 && hoursToArrival <= 48) {
      penalite = reservation.chambre.type.prix;
    }

    // Mise à jour
    await prisma.$transaction([
      prisma.reservation.update({
        where: { id: reservationId },
        data: { 
          statut: "ANNULEE",
          prix_total: penalite // Le prix total devient la pénalité (0 si pas de frais)
        }
      })
    ]);

    return NextResponse.json({ success: true, penalite });
  } catch (error) {
    console.error("Erreur Annulation:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
