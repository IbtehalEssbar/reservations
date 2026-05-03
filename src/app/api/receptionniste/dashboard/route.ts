import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth, clerkClient } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const user = await clerkClient.users.getUser(userId);
    if (user.publicMetadata?.role !== "receptionniste" && user.publicMetadata?.role !== "administrateur") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch all reservations
    const reservations = await prisma.reservation.findMany({
      include: {
        client: true,
        chambre: {
          include: {
            type: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Fetch all chambres for status
    const chambres = await prisma.chambre.findMany({
      include: {
        type: true
      }
    });

    // Calculate stats
    const arriveesDuJour = reservations.filter(
      r => r.date_arrivee >= today && r.date_arrivee < tomorrow
    ).length;

    const departsDuJour = reservations.filter(
      r => r.date_depart >= today && r.date_depart < tomorrow
    ).length;

    const chambresDisponibles = chambres.filter(c => c.status === "DISPONIBLE").length;

    return NextResponse.json({
      reservations,
      chambres,
      stats: {
        arriveesDuJour,
        departsDuJour,
        chambresDisponibles,
        totalChambres: chambres.length
      }
    });

  } catch (error) {
    console.error("Erreur Dashboard Réceptionniste:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
