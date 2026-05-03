import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GetUserReservationsUseCase } from '@/application/use-cases/reservation/GetUserReservationsUseCase';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const getUserReservations = new GetUserReservationsUseCase();
    const reservations = await getUserReservations.execute(userId);

    return NextResponse.json(reservations);
  } catch (error: any) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}