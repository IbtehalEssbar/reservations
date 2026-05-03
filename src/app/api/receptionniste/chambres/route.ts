import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth, clerkClient } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const user = await clerkClient.users.getUser(userId);
    if (user.publicMetadata?.role !== "receptionniste" && user.publicMetadata?.role !== "administrateur") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Récupérer toutes les chambres avec leurs types et la réservation en cours (si existante)
    const chambres = await prisma.chambre.findMany({
      include: {
        type: true,
        reservations: {
          where: {
            statut: {
              in: ["CONFIRMEE"] // Seules les réservations confirmées nous intéressent pour le check-in
            },
            date_arrivee: {
              lte: new Date() // Arrivée prévue pour aujourd'hui ou avant
            }
          },
          include: {
            client: true
          }
        }
      },
      orderBy: {
        numero: 'asc'
      }
    });

    return NextResponse.json(chambres);
  } catch (error) {
    console.error("Erreur Fetch Chambres:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
