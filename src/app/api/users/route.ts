// pages/api/users.js
import { NextResponse } from 'next/server'
import prisma from '../../lib/db'

export async function GET() {
  try {
    const users = await prisma.user.findMany()
    return NextResponse.json(users)
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

export async function POST(req: Request) {
  try {
    const { name, email, role } = await req.json()
    // const { cliente, date, servico }: Agendamento = await req.json()
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role: role || 'user',
      },
    })
    return NextResponse.json({ newUser })
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
