import { Reservation } from '../entities/Reservation';
import { StatutReservation } from '../enums';

export interface IReservationRepository {
  findById(id: string): Promise<Reservation | null>;
  findAllByUserId(userId: number): Promise<Reservation[]>;
  create(reservation: Omit<Reservation, 'id'>): Promise<Reservation>;
  updateStatus(id: string, statut: StatutReservation): Promise<Reservation>;
}
