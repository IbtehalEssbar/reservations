import { prisma } from '@/lib/prisma';

// N'importez PAS de l'enum, utilisez directement les strings
export class CancelReservationUseCase {
  async execute(reservationId: string, clerkUserId: string): Promise<void> {
    console.log('🔍 Annulation - Début:', { reservationId, clerkUserId });
    
    // Vérifier que l'utilisateur existe
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { clerkUserId: clerkUserId }
    });

    if (!utilisateur) {
      throw new Error('Utilisateur non trouvé');
    }

    // Récupérer la réservation
    const reservation = await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        clientId: utilisateur.id
      }
    });

    if (!reservation) {
      throw new Error('Réservation non trouvée');
    }

    console.log('Réservation trouvée:', {
      id: reservation.id,
      statut: reservation.statut,
      date_arrivee: reservation.date_arrivee
    });

    // Vérifier si déjà annulée
    if (reservation.statut === 'ANNULEE') {
      throw new Error('Cette réservation est déjà annulée');
    }

    // Vérifier si la réservation n'est pas déjà passée
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);
    const dateArrivee = new Date(reservation.date_arrivee);
    dateArrivee.setHours(0, 0, 0, 0);

    if (dateArrivee < aujourdhui) {
      throw new Error('Impossible d\'annuler une réservation déjà passée');
    }

    // Utiliser $executeRaw pour contourner Prisma (solution de contournement)
    try {
      // Méthode 1: Utiliser update avec string direct
      await prisma.$executeRaw`
        UPDATE Reservation 
        SET statut = 'ANNULEE' 
        WHERE id = ${reservationId}
      `;
      
      console.log('✅ Réservation annulée (via raw SQL)');
    } catch (error) {
      console.error('Erreur raw SQL:', error);
      
      // Méthode 2: Utiliser update normal
      try {
        await prisma.reservation.update({
          where: { id: reservationId },
          data: { statut: 'ANNULEE' as any }
        });
        console.log('✅ Réservation annulée (via update)');
      } catch (updateError) {
        console.error('Erreur update:', updateError);
        throw new Error('Impossible d\'annuler la réservation');
      }
    }
  }
}