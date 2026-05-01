import { IUtilisateurRepository } from '../../domain/repositories/IUtilisateurRepository';
import { Utilisateur } from '../../domain/entities/Utilisateur';
import { prisma } from '../../lib/prisma';
import { Role as PrismaRole } from '../../generated/prisma/client';
import { Role } from '../../domain/enums';

export class PrismaUtilisateurRepository implements IUtilisateurRepository {
  private mapToDomain(prismaUser: any): Utilisateur {
    return {
      id: prismaUser.id,
      clerkUserId: prismaUser.clerkUserId,
      nom: prismaUser.nom,
      email: prismaUser.email,
      motdp: prismaUser.motdp,
      role: prismaUser.role as Role,
      num_tele: prismaUser.num_tele,
      CIN: prismaUser.CIN,
    };
  }

  async findById(id: number): Promise<Utilisateur | null> {
    const user = await prisma.utilisateur.findUnique({ where: { id } });
    return user ? this.mapToDomain(user) : null;
  }

  async findByClerkId(clerkId: string): Promise<Utilisateur | null> {
    const user = await prisma.utilisateur.findUnique({ where: { clerkUserId: clerkId } });
    return user ? this.mapToDomain(user) : null;
  }

  async findByEmail(email: string): Promise<Utilisateur | null> {
    const user = await prisma.utilisateur.findUnique({ where: { email } });
    return user ? this.mapToDomain(user) : null;
  }

  async create(user: Omit<Utilisateur, 'id'>): Promise<Utilisateur> {
    const createdUser = await prisma.utilisateur.create({
      data: {
        clerkUserId: user.clerkUserId,
        nom: user.nom,
        email: user.email,
        motdp: user.motdp,
        role: user.role as PrismaRole,
        num_tele: user.num_tele,
        CIN: user.CIN,
      },
    });
    return this.mapToDomain(createdUser);
  }

  async update(id: number, user: Partial<Utilisateur>): Promise<Utilisateur> {
    const updatedUser = await prisma.utilisateur.update({
      where: { id },
      data: {
        nom: user.nom,
        email: user.email,
        num_tele: user.num_tele,
        CIN: user.CIN,
      },
    });
    return this.mapToDomain(updatedUser);
  }
}
