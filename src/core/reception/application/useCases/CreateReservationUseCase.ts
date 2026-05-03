import { IReservationRepository } from "../../domain/repositories/IReservationRepository";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
export class CreateReservationUseCase {
  constructor(private resRepo: IReservationRepository, private cliRepo: IClientRepository) {}
  async execute(data: any) {
    let client = await this.cliRepo.findByEmail(data.client.email);
    if (!client) {
      client = await this.cliRepo.create({
        email: data.client.email, nom: data.client.nom, prenom: data.client.prenom || "", telephone: data.client.telephone || "", clerkUserId: "guest_" + Date.now(), role: "user"
      });
    }
    const arrivee = new Date(data.dateArrivee);
    const depart = new Date(data.dateDepart);
    const overlapping = await this.resRepo.findOverlapping(data.chambreId, arrivee, depart);
    if (overlapping.length > 0) throw new Error("Chambre indisponible");
    const nuits = Math.max(1, Math.ceil((depart.getTime() - arrivee.getTime()) / (1000 * 3600 * 24)));
    const prixTotal = data.prixUnitaire * nuits;
    return this.resRepo.create({ clientId: client.id, chambreId: data.chambreId, date_arrivee: arrivee, date_depart: depart, nb_personnes: data.nbPersonnes, statut: "CONFIRMEE", prix_total: prixTotal });
  }
}