import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { PrismaReservationRepository } from "@/core/reception/infrastructure/repositories/PrismaReservationRepository";
import { CancelReservationUseCase } from "@/core/reception/application/useCases/CancelReservationUseCase";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const user = await clerkClient.users.getUser(userId);
    if (user.publicMetadata?.role !== "receptionniste" && user.publicMetadata?.role !== "administrateur") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // CLEAN ARCHITECTURE : Instanciation
    const repository = new PrismaReservationRepository();
    const useCase = new CancelReservationUseCase(repository);

    // Exécution du Use Case
    const result = await useCase.execute(params.id);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Erreur Annulation:", error);
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 });
  }
}
