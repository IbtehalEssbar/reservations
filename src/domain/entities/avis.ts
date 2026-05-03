export interface Avis {
  id: string;
  clientId: number;
  clientNom: string;
  note: number;
  commentaire: string;
  statut: string;
  dateCreation: Date;
  datePublication?: Date;
}