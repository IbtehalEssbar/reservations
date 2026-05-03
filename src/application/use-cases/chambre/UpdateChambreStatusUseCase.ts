import { IChambreRepository } from '../../../domain/repositories/IChambreRepository';
import { StatutChambre } from '../../../domain/enums';

export class UpdateChambreStatusUseCase {
  constructor(private chambreRepository: IChambreRepository) {}

  async execute(id: string, status: StatutChambre): Promise<void> {
    const chambre = await this.chambreRepository.findById(id);
    if (!chambre) {
      throw new Error('Chambre non trouvée');
    }
    
    await this.chambreRepository.updateStatus(id, status);
  }
}