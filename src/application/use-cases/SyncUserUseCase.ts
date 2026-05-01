import { IUtilisateurRepository } from '../../domain/repositories/IUtilisateurRepository';
import { Role } from '../../domain/enums';

export class SyncUserUseCase {
  constructor(private utilisateurRepository: IUtilisateurRepository) {}

  async execute(data: {
    clerkUserId: string;
    email: string;
    nom: string | null;
  }): Promise<void> {
    if (!data.email) {
      throw new Error("Email address is required to create a user");
    }

    const exists = await this.utilisateurRepository.findByClerkId(data.clerkUserId);

    if (!exists) {
      await this.utilisateurRepository.create({
        clerkUserId: data.clerkUserId,
        email: data.email,
        nom: data.nom ?? data.email,
        motdp: "", // vide par défaut
        role: Role.CLIENT,
        num_tele: null,
        CIN: null,
      });
      console.log("User created in DB via SyncUserUseCase");
    } else {
      console.log("User already exists in DB");
    }
  }
}
