import { IChambreRepository } from '../../../domain/repositories/IChambreRepository';

export class DeleteChambreUseCase {
  constructor(private chambreRepository: IChambreRepository) {}

  async execute(id: string): Promise<void> {
    const chambre = await this.chambreRepository.findById(id);
    if (!chambre) {
      throw new Error('Chambre non trouvée');
    }
    
    // Vérifier si la chambre a des réservations futures
    // (À implémenter plus tard avec le repository de réservations)
    
    await this.chambreRepository.delete(id);
  }
}