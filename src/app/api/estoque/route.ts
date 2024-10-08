import prisma from '../../lib/db'
import { NextResponse } from 'next/server'

// Interface para criar uma mudança de estoque
interface StockChangeCreate {
  itemId: number
  change: number
  servicoId?: number // Campo opcional para vincular a um serviço
}

// Interface para atualizar uma mudança de estoque
interface UpdateStockChange {
  id: number
  change?: number
  servicoId?: number // Campo opcional para vincular a um serviço
}

// GET: Listar todas as mudanças de estoque
export async function GET() {
  try {
    const stockChanges = await prisma.stockChange.findMany({
      include: {
        item: true, // Inclui o item relacionado para cada mudança de estoque
        servico: true, // Inclui o serviço relacionado, se houver
      },
    })

    return NextResponse.json(stockChanges)
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

// POST: Criar uma nova mudança de estoque
export async function POST(req: Request) {
  try {
    const { itemId, change, servicoId }: StockChangeCreate = await req.json()
    const newStockChange = await prisma.stockChange.create({
      data: {
        itemId,
        change,
        servicoId, // Vincula a um serviço, se aplicável
      },
    })

    // Atualizar a quantidade no estoque do Item
    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: {
        quantity: {
          increment: change, // Incrementa (ou decrementa se for negativo) a quantidade do item
        },
      },
    })

    return NextResponse.json({ newStockChange, updatedItem })
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

// DELETE: Deletar uma mudança de estoque pelo id
export async function DELETE(req: Request) {
  try {
    const { id }: { id: number } = await req.json()
    const deletedStockChange = await prisma.stockChange.delete({
      where: { id: Number(id) },
    })
    console.log('stockChange deletado', deletedStockChange)
    return NextResponse.json({ deletedStockChange })
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

// PUT: Atualizar completamente uma mudança de estoque
export async function PUT(req: Request) {
  console.log('PUT passou aqui')
  try {
    const { id, change, servicoId }: UpdateStockChange = await req.json()
    const updatedStockChange = await prisma.stockChange.update({
      where: { id: Number(id) },
      data: {
        change,
        servicoId, // Atualiza o campo servicoId, se fornecido
      },
    })
    console.log('stockChange atualizado', updatedStockChange)
    return NextResponse.json({ updatedStockChange })
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

// PATCH: Atualizar parcialmente uma mudança de estoque
export async function PATCH(req: Request) {
  console.log('PATCH passou aqui')
  try {
    const { id, change, servicoId }: UpdateStockChange = await req.json()
    const updateData: Partial<StockChangeCreate> = {}

    if (change !== undefined) {
      updateData.change = change
    }
    if (servicoId !== undefined) {
      updateData.servicoId = servicoId
    }

    const updatedStockChange = await prisma.stockChange.update({
      where: { id: Number(id) },
      data: updateData,
    })
    console.log('stockChange atualizado', updatedStockChange)
    return NextResponse.json({ updatedStockChange })
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
