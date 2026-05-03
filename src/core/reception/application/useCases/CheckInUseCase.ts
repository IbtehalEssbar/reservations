import { IReservationRepository } from "../../domain/repositories/IReservationRepository";
import { IChambreRepository } from "../../domain/repositories/IChambreRepository";
export class ProcessCheckInUseCase {
  constructor(private resRepo: IReservationRepository, private chRepo: IChambreRepository) {}
  async execute(reservationId: string) {
    const reservation = await this.resRepo.findById(reservationId);
    if (!reservation) throw new Error("Introuvable");
    await this.resRepo.update(reservationId, { statut: "EN_COURS" });
    await this.chRepo.updateStatus(reservation.chambreId, "OCCUPEE");
    return { success: true };
  }
}