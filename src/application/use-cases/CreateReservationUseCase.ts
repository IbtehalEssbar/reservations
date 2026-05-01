import { IReservationRepository } from '../../domain/repositories/IReservationRepository';
import { Reservation } from '../../domain/entities/Reservation';
import { StatutReservation } from '../../domain/enums';

export class CreateReservationUseCase {
  constructor(private reservationRepository: IReservationRepository) {}

  async execute(data: {
    date_arrivee: Date;
    date_depart: Date;
    clientId: number;
    chambreId: string;
    promotionId?: string;
  }): Promise<Reservation> {
    if (data.date_depart <= data.date_arrivee) {
      throw new Error('La date de départ doit être après la date d\'arrivée.');
    }

    return this.reservationRepository.create({
      date_arrivee: data.date_arrivee,
      date_depart: data.date_depart,
      statut: StatutReservation.EN_ATTENTE,
      clientId: data.clientId,
      chambreId: data.chambreId,
      promotionId: data.promotionId || null,
    });
  }
}
