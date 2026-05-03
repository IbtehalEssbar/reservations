import { IReservationRepository } from "../../domain/repositories/IReservationRepository";
export class ProcessCheckOutUseCase {
  constructor(private resRepo: IReservationRepository) {}
  async execute(reservationId: string) {
    const reservation = await this.resRepo.findById(reservationId);
    if (!reservation) throw new Error("Introuvable");
    let extrasTotal = 0;
    if (reservation.consommations && reservation.consommations.length > 0) {
      extrasTotal = reservation.consommations.reduce((acc: number, curr: any) => acc + curr.prix, 0);
    }
    const totalAPayer = reservation.prix_total + extrasTotal;
    const factureData = { montant_total: totalAPayer, date_emission: new Date(), reservationId: reservation.id };
    await this.resRepo.createFactureAndFinish(reservationId, factureData, reservation.chambreId);
    return { success: true, total: totalAPayer };
  }
}