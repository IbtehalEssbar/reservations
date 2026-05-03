import { IChambreRepository } from "../../domain/repositories/IChambreRepository";
export class GetChambresUseCase {
  constructor(private repo: IChambreRepository) {}
  async execute() { return this.repo.findAll(); }
}