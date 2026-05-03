import { IDemandeRepository } from "../../domain/repositories/IDemandeRepository";
export class GetDemandesUseCase {
  constructor(private repo: IDemandeRepository) {}
  async execute() { return this.repo.findAll(); }
}
export class UpdateDemandeStatusUseCase {
  constructor(private repo: IDemandeRepository) {}
  async execute(id: string, status: string) { return this.repo.updateStatus(id, status); }
}