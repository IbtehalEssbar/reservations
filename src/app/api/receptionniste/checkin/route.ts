import { NextResponse } from "next/server";
import { PrismaReservationRepository } from "@/core/reception/infrastructure/repositories/PrismaReservationRepository";
import { PrismaChambreRepository } from "@/core/reception/infrastructure/repositories/PrismaChambreRepository";
import { ProcessCheckInUseCase } from "@/core/reception/application/useCases/CheckInUseCase";
export async function POST(request: Request) {
  try {
    const { reservationId } = await request.json();
    const useCase = new ProcessCheckInUseCase(new PrismaReservationRepository(), new PrismaChambreRepository());
    return NextResponse.json(await useCase.execute(reservationId));
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}