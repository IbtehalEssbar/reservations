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

    const { dateArrivee, dateDepart, nbPersonnes, chambreId, clientNom, clientEmail, clientTelephone } = await request.json();

    if (!chambreId || !clientEmail || !clientNom) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
    }

    const arrivee = new Date(dateArrivee);
    const depart = new Date(dateDepart);

    // Récupérer la chambre pour le prix
    const chambre = await prisma.chambre.findUnique({
      where: { id_ch: chambreId },
      include: { type: true }
    });

    if (!chambre) return NextResponse.json({ error: "Chambre introuvable." }, { status: 404 });

    // Calcul du prix total basé sur le nombre de nuits
    const msParNuit = 1000 * 60 * 60 * 24;
    let nuits = Math.ceil((depart.getTime() - arrivee.getTime()) / msParNuit);
    if (nuits === 0) nuits = 1;
    const prixTotal = chambre.type.prix * nuits;

    // Gestion du Client
    let client = await prisma.utilisateur.findUnique({ where: { email: clientEmail } });
    if (!client) {
      client = await prisma.utilisateur.create({
        data: {
          email: clientEmail,
          nom: clientNom,
          num_tele: clientTelephone,
          clerkUserId: "guest_" + Date.now() + Math.random().toString(36).substring(7),
          role: "CLIENT"
        }
      });
    }

    // Créer la réservation
    const nouvelleReservation = await prisma.reservation.create({
      data: {
        date_arrivee: arrivee,
        date_depart: depart,
        nb_personnes: parseInt(nbPersonnes),
        statut: "CONFIRMEE",
        prix_total: prixTotal,
        clientId: client.id,
        clientNom: clientNom,
        clientTelephone: clientTelephone,
        chambreId: chambre.id_ch
      }
    });

    return NextResponse.json({ success: true, reservation: nouvelleReservation });

  } catch (error) {
    console.error("Erreur création réservation:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
