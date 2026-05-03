import { NextResponse } from "next/server";
import { PrismaChambreRepository } from "@/core/reception/infrastructure/repositories/PrismaChambreRepository";
import { CheckAvailabilityUseCase } from "@/core/reception/application/useCases/CheckAvailabilityUseCase";
export async function POST(request: Request) {
  try {
    const { dateArrivee, dateDepart, nbPersonnes } = await request.json();
    const useCase = new CheckAvailabilityUseCase(new PrismaChambreRepository());
    const chambres = await useCase.execute(new Date(dateArrivee), new Date(dateDepart), parseInt(nbPersonnes));
    return NextResponse.json({ chambresLibres: chambres });
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}