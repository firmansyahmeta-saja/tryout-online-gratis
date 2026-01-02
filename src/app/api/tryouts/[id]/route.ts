import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const tryout = await db.tryout.findUnique({
      where: {
        id
      },
      include: {
        questions: {
          orderBy: {
            questionNumber: 'asc'
          }
        },
        _count: {
          select: {
            results: true
          }
        }
      }
    })

    if (!tryout) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tryout tidak ditemukan'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: tryout.id,
        title: tryout.title,
        description: tryout.description,
        level: tryout.level,
        duration: tryout.duration,
        questions: tryout.questions.map(q => ({
          id: q.id,
          questionNumber: q.questionNumber,
          questionText: q.questionText,
          questionImage: q.questionImage,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          // Sembunyikan kunci jawaban dan pembahasan saat mengambil soal untuk ujian
          correctAnswer: undefined,
          explanationText: undefined,
          explanationImage: undefined
        })),
        questionCount: tryout.questions.length,
        resultCount: tryout._count.results
      }
    })
  } catch (error) {
    console.error('Error fetching tryout details:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil detail tryout'
      },
      { status: 500 }
    )
  }
}
