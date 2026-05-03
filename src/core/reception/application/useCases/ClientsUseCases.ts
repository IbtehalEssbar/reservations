import { IClientRepository } from "../../domain/repositories/IClientRepository";
export class GetClientsUseCase {
  constructor(private repo: IClientRepository) {}
  async execute() { return this.repo.findAll(); }
}