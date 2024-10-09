import prisma from '../../lib/db'
import { NextResponse } from 'next/server'

// Interface para criar um novo Item
interface ItemCreate {
  name: string
  quantity?: number
  price?: number // Adicionando o campo price
}

// Interface para atualizar um Item
interface UpdateItem {
  id: number
  name?: string
  quantity?: number
  price?: number // Adicionando o campo price
}

// GET: Listar todos os itens
export async function GET() {
  try {
    const items = await prisma.item.findMany({
      orderBy: {
        id: 'asc', // ou 'desc' se você quiser ordem decrescente
      },
    })
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
  try {
    const { name, quantity, price }: ItemCreate = await req.json()
    const newItem = await prisma.item.create({
      data: {
        name,
        quantity: quantity || 0, // Valor padrão se não for passado
        price: price || 0.0, // Valor padrão para price
      },
    })
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
  try {
    const { id }: { id: number } = await req.json()
    const deletedItem = await prisma.item.delete({
      where: { id: Number(id) },
    })
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
  try {
    const { id, name, quantity, price }: UpdateItem = await req.json()
    const updatedItem = await prisma.item.update({
      where: { id: Number(id) },
      data: {
        name,
        quantity,
        price,
      },
    })
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

/// PATCH: Atualizar um item parcialmente
export async function PATCH(req: Request) {
  try {
    const { id, name, quantity, price }: UpdateItem = await req.json()
    const updateData: Partial<ItemCreate> = {}

    if (name !== undefined) {
      updateData.name = name
    }
    if (quantity !== undefined) {
      updateData.quantity = quantity
    }
    if (price !== undefined) {
      updateData.price = price
    }

    const updatedItem = await prisma.item.update({
      where: { id: Number(id) },
      data: updateData,
    })
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
