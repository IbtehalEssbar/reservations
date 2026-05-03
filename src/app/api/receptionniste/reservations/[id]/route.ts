import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth, clerkClient } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const reservation = await prisma.reservation.findUnique({
      where: { id: params.id },
      include: {
        chambre: { include: { type: true } },
        client: true
      }
    });

    if (!reservation) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    return NextResponse.json(reservation);
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const user = await clerkClient.users.getUser(userId);
    if (user.publicMetadata?.role !== "receptionniste" && user.publicMetadata?.role !== "administrateur") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const { dateArrivee, dateDepart, nbPersonnes } = await request.json();
    const reservationId = params.id;

    const arrivee = new Date(dateArrivee);
    const depart = new Date(dateDepart);

    const oldReservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { chambre: { include: { type: true } } }
    });

    if (!oldReservation) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

    // Vérifier la disponibilité de la chambre actuelle pour les NOUVELLES dates
    // On doit s'assurer que la chambre n'a pas d'AUTRE réservation qui chevauche
    const chevauchement = await prisma.reservation.findFirst({
      where: {
        chambreId: oldReservation.chambreId,
        id: { not: reservationId },
        statut: { in: ["EN_ATTENTE", "CONFIRMEE"] },
        AND: [
          { date_arrivee: { lt: depart } },
          { date_depart: { gt: arrivee } }
        ]
      }
    });

    if (chevauchement) {
      return NextResponse.json({ error: "La chambre n'est pas disponible pour ces nouvelles dates." }, { status: 400 });
    }

    // Nouveau prix
    const msParNuit = 1000 * 60 * 60 * 24;
    let nuits = Math.ceil((depart.getTime() - arrivee.getTime()) / msParNuit);
    if (nuits === 0) nuits = 1;
    const prixTotal = oldReservation.chambre.type.prix * nuits;

    const updated = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        date_arrivee: arrivee,
        date_depart: depart,
        nb_personnes: parseInt(nbPersonnes),
        prix_total: prixTotal
      }
    });

    return NextResponse.json({ success: true, reservation: updated });
  } catch (error) {
    console.error("Erreur Modification:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
