import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tryoutId } = await params
    const body = await request.json()
    const { userName, userSchool, answers } = body

    if (!userName || !userSchool || !answers) {
      return NextResponse.json(
        {
          success: false,
          error: 'Data tidak lengkap. Nama, sekolah, dan jawaban wajib diisi.'
        },
        { status: 400 }
      )
    }

    // Ambil tryout dan soal-soalnya
    const tryout = await db.tryout.findUnique({
      where: {
        id: tryoutId
      },
      include: {
        questions: {
          orderBy: {
            questionNumber: 'asc'
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

    // Hitung skor
    let totalCorrect = 0
    let totalWrong = 0
    let totalEmpty = 0

    tryout.questions.forEach(question => {
      const userAnswer = answers[question.id]
      if (!userAnswer) {
        totalEmpty++
      } else if (userAnswer === question.correctAnswer) {
        totalCorrect++
      } else {
        totalWrong++
      }
    })

    const score = (totalCorrect * 1) + (totalWrong * (-1)) + (totalEmpty * 0)

    // Simpan hasil
    const result = await db.userResult.create({
      data: {
        tryoutId,
        userName,
        userSchool,
        score,
        totalCorrect,
        totalWrong,
        totalEmpty,
        answers: JSON.stringify(answers)
      },
      include: {
        tryout: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: result.id,
        score: result.score,
        totalCorrect,
        totalWrong,
        totalEmpty,
        tryout: {
          id: result.tryout.id,
          title: result.tryout.title,
          level: result.tryout.level
        },
        completedAt: result.completedAt
      }
    })
  } catch (error) {
    console.error('Error submitting exam:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal menyimpan hasil ujian'
      },
      { status: 500 }
    )
  }
}
