import { NextResponse } from "next/server";
import { PrismaClientRepository } from "@/core/reception/infrastructure/repositories/PrismaClientRepository";
import { GetClientsUseCase } from "@/core/reception/application/useCases/ClientsUseCases";
export async function GET() {
  try {
    const useCase = new GetClientsUseCase(new PrismaClientRepository());
    return NextResponse.json(await useCase.execute());
  } catch (error) { return NextResponse.json({ error: "Erreur" }, { status: 500 }); }
}