import prisma from '../../lib/db'
import { NextResponse } from 'next/server'

// Interface para criar um novo serviço
interface ServicoCreate {
  cliente: string
}

// Interface para atualizar um serviço
interface UpdateServico {
  id: number
  cliente?: string
}

// GET: Listar todos os serviços
export async function GET() {
  try {
    const servicos = await prisma.servico.findMany({
      include: {
        changes: {
          include: {
            item: true, // Inclui os itens relacionados através das mudanças de estoque
          },
        },
      },
    })
    console.log(servicos)
    return NextResponse.json(servicos)
  } catch (error) {
    return NextResponse.json(
      {
        message: 'error',
        error,
      },
      { status: 500 },
    )
  }
}

// POST: Criar um novo serviço
export async function POST(req: Request) {
  console.log('POST passou aqui')
  try {
    const { cliente }: ServicoCreate = await req.json()
    const newServico = await prisma.servico.create({
      data: {
        cliente,
      },
    })

    console.log('newServico', newServico)
    return NextResponse.json({ newServico })
  } catch (error) {
    return NextResponse.json(
      {
        message: 'error',
        error,
      },
      { status: 500 },
    )
  }
}

// DELETE: Deletar um serviço pelo id
export async function DELETE(req: Request) {
  console.log('DELETE passou aqui')
  try {
    const { id }: { id: number } = await req.json()
    const deletedServico = await prisma.servico.delete({
      where: { id: Number(id) },
    })
    console.log('Servico deletado', deletedServico)
    return NextResponse.json({ deletedServico })
  } catch (error) {
    return NextResponse.json(
      {
        message: 'error',
        error,
      },
      { status: 500 },
    )
  }
}

// PUT: Atualizar completamente um serviço
export async function PUT(req: Request) {
  console.log('PUT passou aqui')
  try {
    const { id, cliente }: UpdateServico = await req.json()
    const updatedServico = await prisma.servico.update({
      where: { id: Number(id) },
      data: {
        cliente,
      },
    })
    console.log('Servico atualizado', updatedServico)
    return NextResponse.json({ updatedServico })
  } catch (error) {
    return NextResponse.json(
      {
        message: 'error',
        error,
      },
      { status: 500 },
    )
  }
}

// PATCH: Atualizar parcialmente um serviço
export async function PATCH(req: Request) {
  console.log('PATCH passou aqui')
  try {
    const { id, cliente }: UpdateServico = await req.json()
    const updateData: Partial<ServicoCreate> = {}

    if (cliente !== undefined) {
      updateData.cliente = cliente
    }

    const updatedServico = await prisma.servico.update({
      where: { id: Number(id) },
      data: updateData,
    })
    console.log('Servico atualizado', updatedServico)
    return NextResponse.json({ updatedServico })
  } catch (error) {
    return NextResponse.json(
      {
        message: 'error',
        error,
      },
      { status: 500 },
    )
  }
}
