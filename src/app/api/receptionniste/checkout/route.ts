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

    const { reservationId } = await request.json();

    if (!reservationId) {
      return NextResponse.json({ error: "Paramètre reservationId manquant" }, { status: 400 });
    }

    // Récupérer la réservation avec toutes ses dépendances (chambre, type, consommations, services, promotion)
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        chambre: { include: { type: true } },
        consommations: { include: { service: true } },
        promotion: true,
        facture: true
      }
    });

    if (!reservation) {
      return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });
    }

    if (reservation.statut === "TERMINEE") {
      return NextResponse.json({ error: "Le Check-Out a déjà été effectué" }, { status: 400 });
    }

    // --- Calcul de la Facture ---
    // 1. Calcul des nuits
    const dateArrivee = new Date(reservation.date_arrivee);
    const dateDepart = new Date(reservation.date_depart);
    const msParNuit = 1000 * 60 * 60 * 24;
    let nuits = Math.ceil((dateDepart.getTime() - dateArrivee.getTime()) / msParNuit);
    if (nuits === 0) nuits = 1; // Au moins 1 nuit facturée

    // 2. Calcul du prix de base de la chambre
    const prixChambreTotal = reservation.chambre.type.prix * nuits;

    // 3. Calcul des consommations (services)
    const totalServices = reservation.consommations.reduce((acc, cons) => {
      return acc + (cons.prix_app * cons.quantite);
    }, 0);

    // 4. Calcul de la remise (promotion)
    let remise = 0;
    if (reservation.promotion) {
      remise = (prixChambreTotal * reservation.promotion.pourcentage) / 100;
    }

    // 5. Total final : (Prix * nuits) + Services - Remises
    const montantFinal = prixChambreTotal + totalServices - remise;

    // --- Transactions de base de données ---
    // On met à jour la résa, la chambre, et on crée la facture si elle n'existe pas
    await prisma.$transaction([
      prisma.reservation.update({
        where: { id: reservationId },
        data: {
          statut: "TERMINEE",
          prix_total: montantFinal // Mettre à jour le prix total dans la réservation
        }
      }),
      prisma.chambre.update({
        where: { id_ch: reservation.chambreId },
        data: { status: "DISPONIBLE" } // La chambre devient disponible après le check-out
      }),
      // Création de la facture si elle n'existe pas déjà
      ...(reservation.facture ? [] : [
        prisma.facture.create({
          data: {
            reservationId: reservationId,
            montant_total: montantFinal
          }
        })
      ])
    ]);

    return NextResponse.json({
      success: true,
      facture: {
        nuits,
        prixChambreTotal,
        totalServices,
        remise,
        montantFinal
      }
    });

  } catch (error) {
    console.error("Erreur Check-Out:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
