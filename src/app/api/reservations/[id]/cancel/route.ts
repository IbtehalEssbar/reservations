import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// IMPORTANT: La fonction doit avoir cette signature exacte
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Attendre params (Next.js 15+)
    const { id } = await params;
    
    console.log('🔍 ID extrait:', id);
    
    if (!id) {
      console.error(' ID manquant');
      return NextResponse.json({ error: 'ID de réservation manquant' }, { status: 400 });
    }
    
    const { userId } = await auth();
    console.log('👤 Utilisateur Clerk:', userId);
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Trouver l'utilisateur local
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { clerkUserId: userId }
    });

    if (!utilisateur) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Vérifier que la réservation existe
    const reservation = await prisma.reservation.findFirst({
      where: {
        id: id,
        clientId: utilisateur.id
      }
    });

    if (!reservation) {
      console.error(' Réservation non trouvée');
      return NextResponse.json({ error: 'Réservation non trouvée' }, { status: 404 });
    }

    // Vérifier si annulable
    if (reservation.statut === 'ANNULEE') {
      return NextResponse.json({ error: 'Réservation déjà annulée' }, { status: 400 });
    }

    // Annuler la réservation
    await prisma.reservation.update({
      where: { id: id },
      data: { statut: 'ANNULEE' }
    });

    console.log(' Réservation annulée:', id);
    return NextResponse.json({ message: 'Réservation annulée avec succès' });
    
  } catch (error: any) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}