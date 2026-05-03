import { prisma } from '@/lib/prisma';
import { StatutChambre } from '@/domain/enums';

export interface GetAvailableChambresDTO {
  dateArrivee: Date;
  dateDepart: Date;
  nbPersonnes: number;
}

export class GetAvailableChambresUseCase {
  async execute({ dateArrivee, dateDepart, nbPersonnes }: GetAvailableChambresDTO) {
    // Validation des dates
    if (dateArrivee >= dateDepart) {
      throw new Error('La date de départ doit être après la date d\'arrivée');
    }

    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);
    
    if (dateArrivee < aujourdhui) {
      throw new Error('La date d\'arrivée ne peut pas être dans le passé');
    }

    const nombreNuits = Math.ceil((dateDepart.getTime() - dateArrivee.getTime()) / (1000 * 3600 * 24));

    // 1. Récupérer TOUTES les chambres (sauf maintenance)
    const toutesLesChambres = await prisma.chambre.findMany({
      where: {
        status: {
          not: StatutChambre.MAINTENANCE
        },
        capacite: {
          gte: nbPersonnes
        }
      },
      include: {
        type: true
      }
    });

    // 2. Récupérer TOUTES les réservations conflictuelles
    const reservationsConflict = await prisma.reservation.findMany({
      where: {
        statut: { in: ['CONFIRMEE', 'EN_ATTENTE'] },
        AND: [
          { date_arrivee: { lt: dateDepart } },
          { date_depart: { gt: dateArrivee } }
        ]
      },
      select: {
        chambreId: true
      }
    });

    // 3. Créer un Set des IDs de chambres occupées
    const chambresOccupeesIds = new Set(reservationsConflict.map(r => r.chambreId));

    // 4. Filtrer les chambres disponibles
    const chambresDisponibles = toutesLesChambres.filter(chambre => {
      return !chambresOccupeesIds.has(chambre.id_ch);
    });

    // 5. Ajouter le prix estimé
    const chambresAvecPrix = chambresDisponibles.map(chambre => ({
      id_ch: chambre.id_ch,
      numero: chambre.numero,
      status: chambre.status,
      id_type: chambre.id_type,
      type: chambre.type,
      capacite: chambre.capacite,
      nombreNuits: nombreNuits,
      prixEstimé: chambre.type.prix * nombreNuits
    }));

    console.log('🔍 Résumé disponibilité:', {
      totalChambres: toutesLesChambres.length,
      chambresOccupees: chambresOccupeesIds.size,
      chambresDisponibles: chambresDisponibles.length
    });

    return chambresAvecPrix;
  }
}