import { IChambreRepository } from '../../../domain/repositories/IChambreRepository';
import { Chambre } from '../../../domain/entities/Chambre';

export class GetAllChambresUseCase {
  constructor(private chambreRepository: IChambreRepository) {}

  async execute(): Promise<Chambre[]> {
    return await this.chambreRepository.findAll();
  }
}