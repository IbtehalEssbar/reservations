import { StatutChambre } from '../enums';

export interface TypeChambre {
  id: string;
  libelle: string;
  prix: number;
}

export interface Chambre {
  id_ch: string;
  numero: string;
  status: StatutChambre;
  id_type: string;
  
  // Relations chargées (optionnel)
  type?: TypeChambre;
}
