import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.userResult.deleteMany()
  await prisma.question.deleteMany()
  await prisma.tryout.deleteMany()

  // Tryout 1: UTBK Paket 1
  const tryout1 = await prisma.tryout.create({
    data: {
      title: 'Tryout UTBK Paket 1',
      description: 'Latihan soal UTBK dengan berbagai materi dasar',
      level: 'UTBK',
      duration: 90,
      questions: {
        create: [
          {
            questionNumber: 1,
            questionText: 'Manakah dari berikut ini yang merupakan bilangan prima terbesar di bawah 100?',
            optionA: '91',
            optionB: '97',
            optionC: '89',
            optionD: '93',
            correctAnswer: 'B',
            explanationText: 'Bilangan prima di bawah 100 adalah: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97. Jadi bilangan prima terbesar di bawah 100 adalah 97.'
          },
          {
            questionNumber: 2,
            questionText: 'Hasil dari 3/4 + 5/6 adalah...',
            optionA: '19/12',
            optionB: '8/10',
            optionC: '17/12',
            optionD: '15/12',
            correctAnswer: 'A',
            explanationText: '3/4 + 5/6 = (3×3)/(4×3) + (5×2)/(6×2) = 9/12 + 10/12 = 19/12'
          },
          {
            questionNumber: 3,
            questionText: 'Jika x + y = 10 dan xy = 24, maka x² + y² adalah...',
            optionA: '28',
            optionB: '52',
            optionC: '76',
            optionD: '100',
            correctAnswer: 'B',
            explanationText: 'x² + y² = (x + y)² - 2xy = 10² - 2(24) = 100 - 48 = 52'
          }
        ]
      }
    }
  })

  console.log(`✅ Created tryout: ${tryout1.title}`)

  // Tryout 2: SMA Matematika
  const tryout2 = await prisma.tryout.create({
    data: {
      title: 'Tryout SMA Matematika',
      description: 'Latihan soal matematika tingkat SMA',
      level: 'SMA',
      duration: 60,
      questions: {
        create: [
          {
            questionNumber: 1,
            questionText: 'Turunan pertama dari f(x) = 3x² + 5x - 2 adalah...',
            optionA: '6x + 5',
            optionB: '6x - 5',
            optionC: '3x + 5',
            optionD: '6x + 2',
            correctAnswer: 'A',
            explanationText: 'f(x) = 3x² + 5x - 2\nf\'(x) = 2(3x) + 5(1) - 0 = 6x + 5'
          },
          {
            questionNumber: 2,
            questionText: 'Nilai dari ∫(2x + 3)dx adalah...',
            optionA: 'x² + 3x + C',
            optionB: '2x² + 3x + C',
            optionC: 'x² + 3 + C',
            optionD: 'x² + 2x + C',
            correctAnswer: 'A',
            explanationText: '∫(2x + 3)dx = ∫2x dx + ∫3 dx = x² + 3x + C'
          }
        ]
      }
    }
  })

  console.log(`✅ Created tryout: ${tryout2.title}`)

  // Tryout 3: SMP IPA
  const tryout3 = await prisma.tryout.create({
    data: {
      title: 'Tryout SMP IPA',
      description: 'Latihan soal IPA tingkat SMP',
      level: 'SMP',
      duration: 45,
      questions: {
        create: [
          {
            questionNumber: 1,
            questionText: 'Hukum pertama Newton menyatakan bahwa...',
            optionA: 'F = ma',
            optionB: 'Setiap benda cenderung tetap diam atau bergerak lurus beraturan',
            optionC: 'Setiap aksi memiliki reaksi yang sama besar dan berlawanan arah',
            optionD: 'Energi tidak dapat diciptakan atau dimusnahkan',
            correctAnswer: 'B',
            explanationText: 'Hukum I Newton (Hukum Kelembaman): Benda yang diam akan tetap diam, dan benda yang bergerak akan tetap bergerak dengan kecepatan konstan, kecuali ada gaya luar yang bekerja padanya.'
          },
          {
            questionNumber: 2,
            questionText: 'Satuan SI untuk gaya adalah...',
            optionA: 'Joule',
            optionB: 'Newton',
            optionC: 'Watt',
            optionD: 'Pascal',
            correctAnswer: 'B',
            explanationText: 'Satuan SI untuk gaya adalah Newton (N). 1 Newton adalah gaya yang diperlukan untuk memberikan percepatan 1 m/s² pada benda bermassa 1 kg.'
          }
        ]
      }
    }
  })

  console.log(`✅ Created tryout: ${tryout3.title}`)

  // Tryout 4: SD Matematika
  const tryout4 = await prisma.tryout.create({
    data: {
      title: 'Tryout SD Matematika',
      description: 'Latihan soal matematika tingkat SD',
      level: 'SD',
      duration: 30,
      questions: {
        create: [
          {
            questionNumber: 1,
            questionText: 'Hasil dari 25 × 4 adalah...',
            optionA: '50',
            optionB: '100',
            optionC: '75',
            optionD: '125',
            correctAnswer: 'B',
            explanationText: '25 × 4 = 100'
          },
          {
            questionNumber: 2,
            questionText: 'Hasil dari 144 : 12 adalah...',
            optionA: '11',
            optionB: '12',
            optionC: '13',
            optionD: '14',
            correctAnswer: 'B',
            explanationText: '144 : 12 = 12'
          },
          {
            questionNumber: 3,
            questionText: 'Bentuk pecahan dari 0,25 adalah...',
            optionA: '1/2',
            optionB: '1/4',
            optionC: '3/4',
            optionD: '1/5',
            correctAnswer: 'B',
            explanationText: '0,25 = 25/100 = 1/4'
          }
        ]
      }
    }
  })

  console.log(`✅ Created tryout: ${tryout4.title}`)

  console.log('🎉 Seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
