import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Vérifier que Prisma est disponible
    if (!prisma) {
      console.error('Prisma non initialisé');
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    // Récupérer les avis validés
    const avis = await prisma.avis.findMany({
      where: {
        statut: 'VALIDE'
      },
      orderBy: {
        datePublication: 'desc'
      },
      take: 10
    });

    console.log('Avis trouvés:', avis.length);
    return NextResponse.json(avis);
    
  } catch (error: any) {
    console.error('Erreur GET /api/avis/validates:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}