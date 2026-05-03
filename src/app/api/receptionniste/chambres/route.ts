import { NextResponse } from "next/server";
import { PrismaChambreRepository } from "@/core/reception/infrastructure/repositories/PrismaChambreRepository";
import { GetChambresUseCase } from "@/core/reception/application/useCases/ChambresUseCases";
export async function GET() {
  try {
    const useCase = new GetChambresUseCase(new PrismaChambreRepository());
    return NextResponse.json(await useCase.execute());
  } catch (error) { return NextResponse.json({ error: "Erreur" }, { status: 500 }); }
}