import { NextResponse } from "next/server";
import { PrismaReservationRepository } from "@/core/reception/infrastructure/repositories/PrismaReservationRepository";
import { ProcessCheckOutUseCase } from "@/core/reception/application/useCases/CheckOutUseCase";
export async function POST(request: Request) {
  try {
    const { reservationId } = await request.json();
    const useCase = new ProcessCheckOutUseCase(new PrismaReservationRepository());
    return NextResponse.json(await useCase.execute(reservationId));
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}