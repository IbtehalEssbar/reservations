import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaChambreRepository } from '@/infrastructure/repositories/PrismaChambreRepository';
import { UpdateChambreStatusUseCase } from '@/application/use-cases/chambre/UpdateChambreStatusUseCase';
import { DeleteChambreUseCase } from '@/application/use-cases/chambre/DeleteChambreUseCase';

const chambreRepository = new PrismaChambreRepository();

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();
    const updateStatus = new UpdateChambreStatusUseCase(chambreRepository);
    await updateStatus.execute(id, status);
    
    return NextResponse.json({ message: 'Statut mis à jour avec succès' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const deleteChambre = new DeleteChambreUseCase(chambreRepository);
    await deleteChambre.execute(id);
    
    return NextResponse.json({ message: 'Chambre supprimée avec succès' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}