import { prisma } from '@/lib/prisma';

export interface ReservationWithDetails {
  id: string;
  date_arrivee: Date;
  date_depart: Date;
  nb_personnes: number;
  statut: string;
  prix_total: number;
  chambre: {
    numero: string;
    type: {
      libelle: string;
      prix: number;
    };
  };
  createdAt: Date;
}

export class GetUserReservationsUseCase {
  async execute(clerkUserId: string): Promise<{
    aVenir: ReservationWithDetails[];
    passees: ReservationWithDetails[];
    annulees: ReservationWithDetails[];
  }> {
    // Trouver l'utilisateur local à partir du clerkUserId
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { clerkUserId: clerkUserId }
    });

    if (!utilisateur) {
      throw new Error('Utilisateur non trouvé');
    }

    // Récupérer toutes les réservations de l'utilisateur
    const reservations = await prisma.reservation.findMany({
      where: {
        clientId: utilisateur.id
      },
      include: {
        chambre: {
          include: {
            type: true
          }
        }
      },
      orderBy: {
        date_arrivee: 'desc'
      }
    });

    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);

    // Classer les réservations
    const aVenir: ReservationWithDetails[] = [];
    const passees: ReservationWithDetails[] = [];
    const annulees: ReservationWithDetails[] = [];

    reservations.forEach((res) => {
      const reservationFormatted = {
        id: res.id,
        date_arrivee: res.date_arrivee,
        date_depart: res.date_depart,
        nb_personnes: res.nb_personnes,
        statut: res.statut,
        prix_total: res.prix_total,
        chambre: {
          numero: res.chambre.numero,
          type: {
            libelle: res.chambre.type.libelle,
            prix: res.chambre.type.prix
          }
        },
        createdAt: res.createdAt
      };

      if (res.statut === 'ANNULEE') {
        annulees.push(reservationFormatted);
      } else if (res.date_depart < aujourdhui) {
        passees.push(reservationFormatted);
      } else {
        aVenir.push(reservationFormatted);
      }
    });

    return { aVenir, passees, annulees };
  }
}