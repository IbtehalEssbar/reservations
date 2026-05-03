import { IChambreRepository } from '../../../domain/repositories/IChambreRepository';
import { Chambre } from '../../../domain/entities/Chambre';
import { StatutChambre } from '../../../domain/enums';

export interface CreateChambreDTO {
  numero: string;
  id_type: string;
}

export class CreateChambreUseCase {
  constructor(private chambreRepository: IChambreRepository) {}

  async execute(data: CreateChambreDTO): Promise<Chambre> {
    // Validation
    if (!data.numero || data.numero.trim() === '') {
      throw new Error('Le numéro de chambre est requis');
    }
    
    if (!data.id_type) {
      throw new Error('Le type de chambre est requis');
    }

    return await this.chambreRepository.create({
      numero: data.numero,
      status: StatutChambre.DISPONIBLE,
      id_type: data.id_type
    });
  }
}