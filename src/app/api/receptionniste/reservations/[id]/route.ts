import { NextResponse } from "next/server";
import { PrismaReservationRepository } from "@/core/reception/infrastructure/repositories/PrismaReservationRepository";
import { UpdateReservationUseCase } from "@/core/reception/application/useCases/UpdateReservationUseCase";
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const repo = new PrismaReservationRepository();
    const res = await repo.findById(params.id);
    if (!res) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    return NextResponse.json(res);
  } catch (error) { return NextResponse.json({ error: "Erreur" }, { status: 500 }); }
}
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const useCase = new UpdateReservationUseCase(new PrismaReservationRepository());
    return NextResponse.json({ success: true, reservation: await useCase.execute(params.id, data) });
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}