import { NextResponse } from "next/server";
import { PrismaReservationRepository } from "@/core/reception/infrastructure/repositories/PrismaReservationRepository";
import { PrismaClientRepository } from "@/core/reception/infrastructure/repositories/PrismaClientRepository";
import { CreateReservationUseCase } from "@/core/reception/application/useCases/CreateReservationUseCase";
export async function GET() {
  try {
    const repo = new PrismaReservationRepository();
    return NextResponse.json(await repo.findAll());
  } catch (error) { return NextResponse.json({ error: "Erreur" }, { status: 500 }); }
}
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const useCase = new CreateReservationUseCase(new PrismaReservationRepository(), new PrismaClientRepository());
    return NextResponse.json({ success: true, reservation: await useCase.execute(data) });
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}