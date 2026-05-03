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

    const demandes = await prisma.demande.findMany({
      include: {
        reservation: {
          include: {
            chambre: true,
            client: true
          }
        }
      },
      orderBy: { date_crea: 'desc' }
    });

    return NextResponse.json(demandes);
  } catch (error) {
    console.error("Erreur Fetch Demandes:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const user = await clerkClient.users.getUser(userId);
    if (user.publicMetadata?.role !== "receptionniste" && user.publicMetadata?.role !== "administrateur") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const { demandeId, status } = await request.json();

    if (!demandeId || !status) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
    }

    const demande = await prisma.demande.update({
      where: { id: demandeId },
      data: { status }
    });

    return NextResponse.json(demande);
  } catch (error) {
    console.error("Erreur Update Demande:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
