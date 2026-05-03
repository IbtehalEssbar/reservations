import { NextResponse } from "next/server";
import { PrismaDemandeRepository } from "@/core/reception/infrastructure/repositories/PrismaDemandeRepository";
import { GetDemandesUseCase, UpdateDemandeStatusUseCase } from "@/core/reception/application/useCases/DemandesUseCases";
export async function GET() {
  try {
    const useCase = new GetDemandesUseCase(new PrismaDemandeRepository());
    return NextResponse.json(await useCase.execute());
  } catch (error) { return NextResponse.json({ error: "Erreur" }, { status: 500 }); }
}
export async function PATCH(request: Request) {
  try {
    const { demandeId, status } = await request.json();
    const useCase = new UpdateDemandeStatusUseCase(new PrismaDemandeRepository());
    return NextResponse.json(await useCase.execute(demandeId, status));
  } catch (error) { return NextResponse.json({ error: "Erreur" }, { status: 500 }); }
}