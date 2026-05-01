import { IReservationRepository } from '../../domain/repositories/IReservationRepository';
import { Reservation } from '../../domain/entities/Reservation';

export class GetUserReservationsUseCase {
  constructor(private reservationRepository: IReservationRepository) {}

  async execute(userId: number): Promise<Reservation[]> {
    return this.reservationRepository.findAllByUserId(userId);
  }
}
