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

    const clients = await prisma.utilisateur.findMany({
      where: { role: "CLIENT" },
      include: {
        reservations: {
          include: {
            chambre: {
              include: { type: true }
            }
          },
          orderBy: { date_arrivee: 'desc' }
        }
      }
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Erreur Fetch Clients:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
