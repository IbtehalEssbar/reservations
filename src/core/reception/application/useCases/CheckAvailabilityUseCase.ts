import { IChambreRepository } from "../../domain/repositories/IChambreRepository";
export class CheckAvailabilityUseCase {
  constructor(private chRepo: IChambreRepository) {}
  async execute(arrivee: Date, depart: Date, nbPersonnes: number) {
    const chambres = await this.chRepo.findAvailable(nbPersonnes);
    return chambres.filter((c: any) => {
      const isAvailable = c.reservations.every((r: any) => {
        const resArrivee = new Date(r.date_arrivee);
        const resDepart = new Date(r.date_depart);
        return depart <= resArrivee || arrivee >= resDepart;
      });
      return isAvailable;
    });
  }
}