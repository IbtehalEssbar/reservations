import { Reservation } from '../entities/Reservation';
import { StatutReservation } from '../enums';

export interface IReservationRepository {
  findById(id: string): Promise<Reservation | null>;
  findAllByUserId(userId: string): Promise<Reservation[]>;  // string pour Clerk
  create(reservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reservation>;
  updateStatus(id: string, statut: StatutReservation): Promise<Reservation>;
  findConflictingReservations(chambreId: string, dateArrivee: Date, dateDepart: Date): Promise<Reservation[]>;
}