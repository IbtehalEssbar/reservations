import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const dateArrivee = new Date(searchParams.get('dateArrivee')!);
    const dateDepart = new Date(searchParams.get('dateDepart')!);
    const nbPersonnes = parseInt(searchParams.get('nbPersonnes')!);

    if (isNaN(dateArrivee.getTime()) || isNaN(dateDepart.getTime())) {
      return NextResponse.json({ error: 'Dates invalides' }, { status: 400 });
    }

    if (dateArrivee >= dateDepart) {
      return NextResponse.json({ error: 'La date de départ doit être après la date d\'arrivée' }, { status: 400 });
    }

    const nombreNuits = Math.ceil((dateDepart.getTime() - dateArrivee.getTime()) / (1000 * 3600 * 24));

    // Récupérer toutes les chambres (sauf maintenance)
    const toutesLesChambres = await prisma.chambre.findMany({
      where: {
        status: { not: 'MAINTENANCE' },
        capacite: { gte: nbPersonnes }
      },
      include: { type: true }
    });

    // Récupérer les IDs des chambres occupées sur ces dates
    const reservationsOccupants = await prisma.reservation.findMany({
      where: {
        statut: { in: ['CONFIRMEE', 'EN_ATTENTE'] },
        AND: [
          { date_arrivee: { lt: dateDepart } },
          { date_depart: { gt: dateArrivee } }
        ]
      },
      select: { chambreId: true }
    });

    const chambresOccupeesIds = new Set(reservationsOccupants.map(r => r.chambreId));

    // Filtrer
    const chambresDisponibles = toutesLesChambres.filter(chambre => !chambresOccupeesIds.has(chambre.id_ch));

    const resultats = chambresDisponibles.map(chambre => ({
      id_ch: chambre.id_ch,
      numero: chambre.numero,
      status: chambre.status,
      id_type: chambre.id_type,
      type: chambre.type,
      capacite: chambre.capacite,
      nombreNuits: nombreNuits,
      prixEstimé: chambre.type.prix * nombreNuits
    }));

    console.log(`✅ ${resultats.length} chambres disponibles sur ${toutesLesChambres.length}`);
    console.log('🟢 Disponibles:', resultats.map(c => c.numero));
    console.log('🔴 Occupées:', Array.from(chambresOccupeesIds));

    return NextResponse.json(resultats);
  } catch (error: any) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}