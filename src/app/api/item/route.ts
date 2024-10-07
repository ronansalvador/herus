import prisma from '../../lib/db'
import { NextResponse } from 'next/server'

// Interface para criar um novo Item
interface ItemCreate {
  name: string
  quantity?: number
}

// Interface para atualizar um Item
interface UpdateItem {
  id: number
  name?: string
  quantity?: number
}

// GET: Listar todos os itens
export async function GET() {
  try {
    const items = await prisma.item.findMany()
    console.log(items)
    return NextResponse.json(items)
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

// POST: Criar um novo Item
export async function POST(req: Request) {
  console.log('POST passou aqui')
  try {
    const { name, quantity }: ItemCreate = await req.json()
    const newItem = await prisma.item.create({
      data: {
        name,
        quantity: quantity || 0, // Valor padrão se não for passado
      },
    })
    console.log('newItem', newItem)
    return NextResponse.json({ newItem })
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

// DELETE: Deletar um item pelo id
export async function DELETE(req: Request) {
  console.log('DELETE passou aqui')
  try {
    const { id }: { id: number } = await req.json()
    const deletedItem = await prisma.item.delete({
      where: { id: Number(id) },
    })
    console.log('item deletado', deletedItem)
    return NextResponse.json({ deletedItem })
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

// PUT: Atualizar um item (atualiza todos os campos)
export async function PUT(req: Request) {
  console.log('PUT passou aqui')
  try {
    const { id, name, quantity }: UpdateItem = await req.json()
    const updatedItem = await prisma.item.update({
      where: { id: Number(id) },
      data: {
        name,
        quantity,
      },
    })
    console.log('item atualizado', updatedItem)
    return NextResponse.json({ updatedItem })
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

// PATCH: Atualizar um item parcialmente
export async function PATCH(req: Request) {
  console.log('PATCH passou aqui')
  try {
    const { id, name, quantity }: UpdateItem = await req.json()
    const updateData: Partial<ItemCreate> = {}

    if (name !== undefined) {
      updateData.name = name
    }
    if (quantity !== undefined) {
      updateData.quantity = quantity
    }

    const updatedItem = await prisma.item.update({
      where: { id: Number(id) },
      data: updateData,
    })
    console.log('item atualizado', updatedItem)
    return NextResponse.json({ updatedItem })
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
