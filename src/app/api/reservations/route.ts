import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { CreateReservationUseCase } from '@/application/use-cases/reservation/CreateReservationUseCase';
import { PrismaUtilisateurRepository } from '@/infrastructure/repositories/PrismaUtilisateurRepository';
import { SyncUserUseCase } from '@/application/use-cases/SyncUserUseCase';

const utilisateurRepository = new PrismaUtilisateurRepository();
const syncUserUseCase = new SyncUserUseCase(utilisateurRepository);

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.date_arrivee || !body.date_depart || !body.chambreId || !body.clientNom) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }

    const email = body.clientEmail || clerkUser.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: 'Email utilisateur manquant' }, { status: 400 });
    }

    await syncUserUseCase.execute({
      clerkUserId: userId,
      email,
      nom: body.clientNom || `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || null,
    });

    const utilisateur = await utilisateurRepository.findByClerkId(userId);
    if (!utilisateur) {
      return NextResponse.json({ error: 'Impossible de récupérer l’utilisateur local' }, { status: 500 });
    }

    const createReservation = new CreateReservationUseCase();
    const reservation = await createReservation.execute({
      date_arrivee: body.date_arrivee,
      date_depart: body.date_depart,
      nb_personnes: body.nb_personnes,
      chambreId: body.chambreId,
      clientId: utilisateur.id,
      clientNom: body.clientNom,
      clientTelephone: body.clientTelephone || ''
    });

    console.log('✅ Réservation créée:', reservation.id);
    return NextResponse.json(reservation, { status: 201 });
  } catch (error: any) {
    console.error('❌ Erreur API reservation:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}