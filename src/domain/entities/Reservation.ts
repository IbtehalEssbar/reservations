import { StatutReservation } from '../enums';
import { Utilisateur } from './Utilisateur';
import { Chambre } from './Chambre';

export interface Reservation {
  id: string;
  date_arrivee: Date;
  date_depart: Date;
  statut: StatutReservation;
  clientId: number;
  chambreId: string;
  promotionId: string | null;

  // Relations chargées (optionnel)
  client?: Utilisateur;
  chambre?: Chambre;
}
