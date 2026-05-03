import { StatutReservation } from '../enums';

export interface Reservation {
  id: string;
  date_arrivee: Date;
  date_depart: Date;
  nb_personnes: number;
  statut: StatutReservation;
  clientId: string;
  chambreId: string;
  prix_total: number;
  createdAt: Date;
  updatedAt: Date;
}