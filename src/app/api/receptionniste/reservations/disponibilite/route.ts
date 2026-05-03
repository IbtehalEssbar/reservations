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

    const { dateArrivee, dateDepart, nbPersonnes, typeChambreId } = await request.json();

    if (!dateArrivee || !dateDepart || !nbPersonnes) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
    }

    const arrivee = new Date(dateArrivee);
    const depart = new Date(dateDepart);

    // Trouver les chambres disponibles
    const filtres: any = {
      capacite: { gte: parseInt(nbPersonnes) }
    };
    if (typeChambreId) filtres.id_type = typeChambreId;

    const chambres = await prisma.chambre.findMany({
      where: filtres,
      include: {
        type: true,
        reservations: {
          where: {
            statut: { in: ["EN_ATTENTE", "CONFIRMEE"] },
            AND: [
              { date_arrivee: { lt: depart } },
              { date_depart: { gt: arrivee } }
            ]
          }
        }
      }
    });

    // Ne garder que celles qui n'ont aucune réservation superposée
    const disponibles = chambres.filter(c => c.reservations.length === 0);

    return NextResponse.json(disponibles);

  } catch (error) {
    console.error("Erreur Fetch Dispos:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
