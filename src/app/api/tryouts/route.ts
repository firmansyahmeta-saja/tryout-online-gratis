import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const tryouts = await db.tryout.findMany({
      include: {
        _count: {
          select: {
            questions: true,
            results: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: tryouts.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        level: t.level,
        duration: t.duration,
        questionCount: t._count.questions,
        resultCount: t._count.results,
        createdAt: t.createdAt
      }))
    })
  } catch (error) {
    console.error('Error fetching tryouts:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil data tryout'
      },
      { status: 500 }
    )
  }
}
