import { prisma } from '@/lib/prisma';
import { StatutReservation } from '@/domain/enums';

export interface CreateReservationDTO {
  date_arrivee: Date | string;
  date_depart: Date | string;
  nb_personnes: number;
  chambreId: string;
  clientId: number;
  clientNom: string;
  clientTelephone?: string;
}

export class CreateReservationUseCase {
  async execute(data: CreateReservationDTO) {
    try {
      const dateArrivee = typeof data.date_arrivee === 'string'
        ? new Date(data.date_arrivee)
        : data.date_arrivee;

      const dateDepart = typeof data.date_depart === 'string'
        ? new Date(data.date_depart)
        : data.date_depart;

      if (isNaN(dateArrivee.getTime()) || isNaN(dateDepart.getTime())) {
        throw new Error('Dates invalides');
      }

      const chambre = await prisma.chambre.findUnique({
        where: { id_ch: data.chambreId },
        include: { type: true }
      });

      if (!chambre) {
        throw new Error('Chambre non trouvée');
      }

      // Vérifier les conflits de dates
      const conflit = await prisma.reservation.findFirst({
        where: {
          chambreId: data.chambreId,
          statut: { in: ['CONFIRMEE', 'EN_ATTENTE'] },
          AND: [
            { date_arrivee: { lt: dateDepart } },
            { date_depart: { gt: dateArrivee } }
          ]
        }
      });

      if (conflit) {
        throw new Error('Cette chambre n\'est pas disponible sur ces dates');
      }

      const nombreNuits = Math.ceil((dateDepart.getTime() - dateArrivee.getTime()) / (1000 * 3600 * 24));
      const prix_total = chambre.type.prix * nombreNuits;

      // Créer la réservation (SANS modifier le statut de la chambre)
      const reservation = await prisma.reservation.create({
        data: {
          date_arrivee: dateArrivee,
          date_depart: dateDepart,
          nb_personnes: data.nb_personnes,
          statut: StatutReservation.CONFIRMEE,
          clientId: data.clientId,
          clientNom: data.clientNom,
          clientTelephone: data.clientTelephone,
          chambreId: data.chambreId,
          prix_total: prix_total,
        },
        include: {
          chambre: {
            include: { type: true }
          }
        }
      });

      // ⚠️ SUPPRIMÉ : La mise à jour du statut de la chambre
      // La chambre reste DISPONIBLE, la disponibilité est gérée via les réservations

      return reservation;
    } catch (error: any) {
      console.error('Erreur CreateReservationUseCase:', error);
      throw error;
    }
  }
}