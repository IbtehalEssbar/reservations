import { IReservationRepository } from "../../domain/repositories/IReservationRepository";
export class UpdateReservationUseCase {
  constructor(private resRepo: IReservationRepository) {}
  async execute(id: string, data: any) {
    const old = await this.resRepo.findById(id);
    if (!old) throw new Error("Introuvable");
    const arrivee = new Date(data.dateArrivee);
    const depart = new Date(data.dateDepart);
    const overlaps = await this.resRepo.findOverlapping(old.chambreId, arrivee, depart, id);
    if (overlaps.length > 0) throw new Error("Indisponible");
    const nuits = Math.max(1, Math.ceil((depart.getTime() - arrivee.getTime()) / (1000 * 3600 * 24)));
    const prix = old.chambre.type.prix * nuits;
    return this.resRepo.update(id, { date_arrivee: arrivee, date_depart: depart, nb_personnes: parseInt(data.nbPersonnes), prix_total: prix });
  }
}