import prisma from '../../../lib/db'
import { NextResponse } from 'next/server'

// GET: Buscar um serviço pelo ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params

    const servico = await prisma.servico.findUnique({
      where: { id: Number(id) },
      include: {
        changes: {
          include: {
            item: true, // Inclui os itens relacionados através das mudanças de estoque
          },
        },
      },
    })

    if (!servico) {
      return NextResponse.json(
        { message: 'Serviço não encontrado' },
        { status: 404 },
      )
    }

    return NextResponse.json(servico)
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Erro ao buscar o serviço',
        error,
      },
      { status: 500 },
    )
  }
}
