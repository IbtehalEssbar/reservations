import { IDashboardRepository } from "../../domain/repositories/IDashboardRepository";

export class GetDashboardKPIsUseCase {
  private repository: IDashboardRepository;

  constructor(repository: IDashboardRepository) {
    this.repository = repository;
  }

  async execute() {
    const today = new Date();
    
    // On exécute les appels à l'infrastructure
    const [arrivees, departs, chambresLibres] = await Promise.all([
      this.repository.getArrivalsCount(today),
      this.repository.getDeparturesCount(today),
      this.repository.getAvailableRoomsCount()
    ]);

    // Retourne le DTO (Data Transfer Object)
    return {
      arrivees,
      departs,
      chambresLibres
    };
  }
}
