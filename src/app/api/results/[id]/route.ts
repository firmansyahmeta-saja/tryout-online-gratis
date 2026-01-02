import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: resultId } = await params

    const result = await db.userResult.findUnique({
      where: {
        id: resultId
      },
      include: {
        tryout: {
          include: {
            questions: {
              orderBy: {
                questionNumber: 'asc'
              }
            }
          }
        }
      }
    })

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: 'Hasil tidak ditemukan'
        },
        { status: 404 }
      )
    }

    const answers = JSON.parse(result.answers)

    // Gabungkan soal dengan jawaban user dan status
    const questionsWithAnswers = result.tryout.questions.map(question => {
      const userAnswer = answers[question.id]
      const isCorrect = userAnswer === question.correctAnswer

      return {
        ...question,
        userAnswer,
        isCorrect,
        isAnswered: !!userAnswer
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: result.id,
        userName: result.userName,
        userSchool: result.userSchool,
        score: result.score,
        totalCorrect: result.totalCorrect,
        totalWrong: result.totalWrong,
        totalEmpty: result.totalEmpty,
        completedAt: result.completedAt,
        tryout: {
          id: result.tryout.id,
          title: result.tryout.title,
          description: result.tryout.description,
          level: result.tryout.level,
          duration: result.tryout.duration
        },
        questions: questionsWithAnswers
      }
    })
  } catch (error) {
    console.error('Error fetching result:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil hasil ujian'
      },
      { status: 500 }
    )
  }
}
