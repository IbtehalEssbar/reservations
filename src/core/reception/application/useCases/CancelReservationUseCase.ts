import { IReservationRepository } from "../../domain/repositories/IReservationRepository";

export class CancelReservationUseCase {
  private reservationRepo: IReservationRepository;

  constructor(reservationRepo: IReservationRepository) {
    this.reservationRepo = reservationRepo;
  }

  async execute(reservationId: string) {
    const reservation = await this.reservationRepo.findById(reservationId);
    
    if (!reservation) {
      throw new Error("Réservation introuvable");
    }
    if (reservation.statut !== "CONFIRMEE" && reservation.statut !== "EN_ATTENTE") {
      throw new Error("Impossible d'annuler cette réservation");
    }

    // Règle Métier : Calcul des pénalités
    const now = new Date();
    const arrivee = new Date(reservation.date_arrivee);
    const msToArrival = arrivee.getTime() - now.getTime();
    const hoursToArrival = msToArrival / (1000 * 60 * 60);

    let penalite = 0;
    // Si annulation à moins de 48h -> facturer 1 nuit
    if (hoursToArrival > 0 && hoursToArrival <= 48) {
      penalite = reservation.chambre.type.prix;
    }

    // Mettre à jour via le Repository
    await this.reservationRepo.updateStatusAndPrice(reservationId, "ANNULEE", penalite);
    
    // Libérer la chambre si occupée
    if (reservation.chambre.status === "OCCUPEE") {
      await this.reservationRepo.freeRoom(reservation.chambreId);
    }

    return { success: true, penalite };
  }
}
