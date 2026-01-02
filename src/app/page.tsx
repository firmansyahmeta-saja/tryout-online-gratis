'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Clock, FileText, Users, ArrowLeft, Play, AlertCircle, ChevronLeft, ChevronRight, CheckCircle2, Circle, Check, X, Eye, RotateCcw, Home } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

// Types
type Question = {
  id: string
  questionNumber: number
  questionText: string
  questionImage?: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
  explanationText: string
  explanationImage?: string
}

// Mock data - will be replaced with API call
const mockTryouts = [
  {
    id: '1',
    title: 'Tryout UTBK Paket 1',
    description: 'Latihan soal UTBK dengan berbagai materi dasar',
    level: 'UTBK',
    duration: 90,
    questionCount: 20
  },
  {
    id: '2',
    title: 'Tryout SMA Matematika',
    description: 'Latihan soal matematika tingkat SMA',
    level: 'SMA',
    duration: 60,
    questionCount: 15
  },
  {
    id: '3',
    title: 'Tryout SMP IPA',
    description: 'Latihan soal IPA tingkat SMP',
    level: 'SMP',
    duration: 45,
    questionCount: 10
  },
  {
    id: '4',
    title: 'Tryout SD Matematika',
    description: 'Latihan soal matematika tingkat SD',
    level: 'SD',
    duration: 30,
    questionCount: 10
  }
]

// Mock questions for each tryout
const mockQuestions: Record<string, Question[]> = {
  '1': [
    {
      id: 'q1-1',
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
      id: 'q1-2',
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
      id: 'q1-3',
      questionNumber: 3,
      questionText: 'Jika x + y = 10 dan xy = 24, maka x² + y² adalah...',
      optionA: '28',
      optionB: '52',
      optionC: '76',
      optionD: '100',
      correctAnswer: 'B',
      explanationText: 'x² + y² = (x + y)² - 2xy = 10² - 2(24) = 100 - 48 = 52'
    }
  ],
  '2': [
    {
      id: 'q2-1',
      questionNumber: 1,
      questionText: 'Turunan pertama dari f(x) = 3x² + 5x - 2 adalah...',
      optionA: '6x + 5',
      optionB: '6x - 5',
      optionC: '3x + 5',
      optionD: '6x + 2',
      correctAnswer: 'A',
      explanationText: 'f(x) = 3x² + 5x - 2\nf\'(x) = 2(3x) + 5(1) - 0 = 6x + 5'
    }
  ],
  '3': [
    {
      id: 'q3-1',
      questionNumber: 1,
      questionText: 'Hukum pertama Newton menyatakan bahwa...',
      optionA: 'F = ma',
      optionB: 'Setiap benda cenderung tetap diam atau bergerak lurus beraturan',
      optionC: 'Setiap aksi memiliki reaksi yang sama besar dan berlawanan arah',
      optionD: 'Energi tidak dapat diciptakan atau dimusnahkan',
      correctAnswer: 'B',
      explanationText: 'Hukum I Newton (Hukum Kelembaman): Benda yang diam akan tetap diam, dan benda yang bergerak akan tetap bergerak dengan kecepatan konstan, kecuali ada gaya luar yang bekerja padanya.'
    }
  ],
  '4': [
    {
      id: 'q4-1',
      questionNumber: 1,
      questionText: 'Hasil dari 25 × 4 adalah...',
      optionA: '50',
      optionB: '100',
      optionC: '75',
      optionD: '125',
      correctAnswer: 'B',
      explanationText: '25 × 4 = 100'
    }
  ]
}

type Level = 'SD' | 'SMP' | 'SMA' | 'UTBK'

export default function Home() {
  const [selectedLevel, setSelectedLevel] = useState<Level | 'All'>('All')
  const [filteredTryouts, setFilteredTryouts] = useState(mockTryouts)
  const [selectedTryout, setSelectedTryout] = useState<string | null>(null)
  const [examMode, setExamMode] = useState<'landing' | 'form' | 'exam' | 'result'>('landing')

  // Form state
  const [userName, setUserName] = useState('')
  const [userSchool, setUserSchool] = useState('')
  const [formError, setFormError] = useState('')

  // Exam state
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(90 * 60) // 90 minutes in seconds
  const [examSubmitted, setExamSubmitted] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Filter tryouts by level
  useEffect(() => {
    if (selectedLevel === 'All') {
      setFilteredTryouts(mockTryouts)
    } else {
      setFilteredTryouts(mockTryouts.filter(t => t.level === selectedLevel))
    }
  }, [selectedLevel])

  // Countdown timer
  useEffect(() => {
    if (examMode === 'exam' && !examSubmitted && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitExam()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [examMode, examSubmitted])

  // Reset timer when starting new exam
  useEffect(() => {
    if (examMode === 'exam' && !examSubmitted && timeRemaining === 90 * 60) {
      const tryout = getSelectedTryout()
      if (tryout) {
        setTimeRemaining(tryout.duration * 60)
      }
    }
  }, [examMode, examSubmitted])

  // Format time helper
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartTryout = (tryoutId: string) => {
    setSelectedTryout(tryoutId)
    setExamMode('form')
  }

  const handleStartExam = () => {
    if (!userName.trim()) {
      setFormError('Nama wajib diisi')
      return
    }
    if (!userSchool.trim()) {
      setFormError('Asal sekolah/universitas wajib diisi')
      return
    }
    setFormError('')
    setCurrentQuestion(0)
    setAnswers({})
    setExamSubmitted(false)
    setExamMode('exam')
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNavigate = (direction: 'prev' | 'next' | 'jump') => {
    const tryout = getSelectedTryout()
    if (!tryout) return

    const questions = mockQuestions[tryout.id] || []

    if (direction === 'prev' && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    } else if (direction === 'next' && currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestion(index)
  }

  const calculateScore = () => {
    const tryout = getSelectedTryout()
    if (!tryout) return { score: 0, correct: 0, wrong: 0, empty: 0 }

    const questions = mockQuestions[tryout.id] || []
    let correct = 0
    let wrong = 0
    let empty = 0

    questions.forEach(q => {
      const userAnswer = answers[q.id]
      if (!userAnswer) {
        empty++
      } else if (userAnswer === q.correctAnswer) {
        correct++
      } else {
        wrong++
      }
    })

    const score = correct * 1 + wrong * (-1) + empty * 0

    return { score, correct, wrong, empty }
  }

  const handleSubmitExam = () => {
    const result = calculateScore()
    setExamSubmitted(true)
    setExamMode('result')
  }

  const handleBack = () => {
    // Clear timer if exists
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setExamMode('landing')
    setSelectedTryout(null)
    setUserName('')
    setUserSchool('')
    setFormError('')
    setCurrentQuestion(0)
    setAnswers({})
    setExamSubmitted(false)
    setTimeRemaining(90 * 60)
  }

  const handleResetExam = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setExamSubmitted(false)
    setTimeRemaining(90 * 60)
  }

  const getSelectedTryout = () => {
    return mockTryouts.find(t => t.id === selectedTryout)
  }

  // Render landing page
  if (examMode === 'landing') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <img
                  src="/logo.svg"
                  alt="Tryout Online"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold">Tryout Online Gratis</h1>
                <p className="text-sm text-muted-foreground">Latihan ujian online SD, SMP, SMA, dan UTBK</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Filter Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Pilih Jenjang Pendidikan</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedLevel === 'All' ? 'default' : 'outline'}
                onClick={() => setSelectedLevel('All')}
              >
                Semua
              </Button>
              <Button
                variant={selectedLevel === 'SD' ? 'default' : 'outline'}
                onClick={() => setSelectedLevel('SD')}
              >
                SD
              </Button>
              <Button
                variant={selectedLevel === 'SMP' ? 'default' : 'outline'}
                onClick={() => setSelectedLevel('SMP')}
              >
                SMP
              </Button>
              <Button
                variant={selectedLevel === 'SMA' ? 'default' : 'outline'}
                onClick={() => setSelectedLevel('SMA')}
              >
                SMA
              </Button>
              <Button
                variant={selectedLevel === 'UTBK' ? 'default' : 'outline'}
                onClick={() => setSelectedLevel('UTBK')}
              >
                UTBK
              </Button>
            </div>
          </div>

          {/* Tryout Grid */}
          {filteredTryouts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Tidak ada tryout untuk jenjang ini</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTryouts.map((tryout) => (
                <Card key={tryout.id} className="flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={tryout.level === 'UTBK' ? 'default' : 'secondary'}>
                        {tryout.level}
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-2">{tryout.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{tryout.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{tryout.duration} menit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{tryout.questionCount} soal</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handleStartTryout(tryout.id)}
                    >
                      Mulai Tryout
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t bg-card mt-auto">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-sm text-muted-foreground">
              © 2024 Tryout Online Gratis. Platform latihan ujian online gratis untuk semua jenjang.
            </p>
          </div>
        </footer>
      </div>
    )
  }

  // Render form mode
  if (examMode === 'form') {
    const tryout = getSelectedTryout()
    if (!tryout) {
      return <div className="min-h-screen flex items-center justify-center">Tryout tidak ditemukan</div>
    }

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <Card className="mb-4 border-primary/20 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="default">{tryout.level}</Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {tryout.duration} menit
                      </div>
                    </div>
                    <CardTitle className="mb-2">{tryout.title}</CardTitle>
                    <CardDescription>{tryout.description}</CardDescription>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="w-4 h-4" />
                        <span>{tryout.questionCount} soal pilihan ganda</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <CardTitle>Isi Data Diri</CardTitle>
                <CardDescription>
                  Lengkapi data diri Anda sebelum memulai ujian
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {formError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nama Lengkap <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Masukkan nama lengkap"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school">
                    Asal Sekolah/Universitas <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="school"
                    placeholder="Masukkan nama sekolah atau universitas"
                    value={userSchool}
                    onChange={(e) => setUserSchool(e.target.value)}
                  />
                </div>

                <Alert>
                  <Play className="h-4 w-4" />
                  <AlertDescription>
                    Pastikan koneksi internet stabil sebelum memulai ujian. Timer akan berjalan otomatis setelah Anda mengklik tombol "Mulai Ujian".
                  </AlertDescription>
                </Alert>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleStartExam}
                >
                  Mulai Ujian
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-card mt-auto">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-sm text-muted-foreground">
              © 2024 Tryout Online Gratis. Platform latihan ujian online gratis untuk semua jenjang.
            </p>
          </div>
        </footer>
      </div>
    )
  }

  // Render exam mode
  if (examMode === 'exam') {
    const tryout = getSelectedTryout()
    if (!tryout) {
      return <div className="min-h-screen flex items-center justify-center">Tryout tidak ditemukan</div>
    }

    const questions = mockQuestions[tryout.id] || []
    const currentQ = questions[currentQuestion]

    if (!currentQ) {
      return <div className="min-h-screen flex items-center justify-center">Soal tidak ditemukan</div>
    }

    const currentAnswer = answers[currentQ.id]

    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header with timer */}
        <header className="border-b bg-card sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Keluar
              </Button>

              <div className="text-center">
                <div className="text-sm font-medium">{tryout.title}</div>
                <div className="text-xs text-muted-foreground">{userName}</div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className={`text-2xl font-bold font-mono ${timeRemaining < 300 ? 'text-destructive' : ''}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Question Area */}
            <div className="lg:col-span-3">
              <Card className="mb-4">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="text-lg">
                      Soal {currentQ.questionNumber}
                    </Badge>
                    <Badge variant="secondary">
                      {currentQuestion + 1} dari {questions.length}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Question Text */}
                  <div className="prose max-w-none">
                    <p className="text-lg leading-relaxed">{currentQ.questionText}</p>
                  </div>

                  {/* Question Image (optional) */}
                  {currentQ.questionImage && (
                    <div className="border rounded-lg p-4 bg-muted/50">
                      <img
                        src={currentQ.questionImage}
                        alt="Soal"
                        className="max-w-full h-auto mx-auto"
                      />
                    </div>
                  )}

                  {/* Answer Options */}
                  <RadioGroup
                    value={currentAnswer || ''}
                    onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
                    className="space-y-3"
                  >
                    <div className={`p-4 border rounded-lg transition-all ${currentAnswer === 'A' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="A" id="optionA" />
                        <Label htmlFor="optionA" className="flex-1 cursor-pointer font-medium">
                          A. {currentQ.optionA}
                        </Label>
                      </div>
                    </div>

                    <div className={`p-4 border rounded-lg transition-all ${currentAnswer === 'B' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="B" id="optionB" />
                        <Label htmlFor="optionB" className="flex-1 cursor-pointer font-medium">
                          B. {currentQ.optionB}
                        </Label>
                      </div>
                    </div>

                    <div className={`p-4 border rounded-lg transition-all ${currentAnswer === 'C' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="C" id="optionC" />
                        <Label htmlFor="optionC" className="flex-1 cursor-pointer font-medium">
                          C. {currentQ.optionC}
                        </Label>
                      </div>
                    </div>

                    <div className={`p-4 border rounded-lg transition-all ${currentAnswer === 'D' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="D" id="optionD" />
                        <Label htmlFor="optionD" className="flex-1 cursor-pointer font-medium">
                          D. {currentQ.optionD}
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>

                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => handleNavigate('prev')}
                    disabled={currentQuestion === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Sebelumnya
                  </Button>

                  <div className="flex gap-2">
                    {currentQuestion === questions.length - 1 ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Selesai & Submit
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Submit</AlertDialogTitle>
                            <AlertDialogDescription>
                              Anda yakin ingin menyelesaikan ujian? Jawaban tidak dapat diubah setelah submit.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSubmitExam}>
                              Submit Jawaban
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button onClick={() => handleNavigate('next')} className="gap-2">
                        Selanjutnya
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Sidebar - Question Navigation */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="text-base">Navigasi Soal</CardTitle>
                  <CardDescription>
                    Klik nomor untuk loncat ke soal
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="grid grid-cols-5 gap-2">
                      {questions.map((q, index) => {
                        const isAnswered = !!answers[q.id]
                        const isCurrent = index === currentQuestion

                        return (
                          <Button
                            key={q.id}
                            variant={isCurrent ? 'default' : isAnswered ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => handleJumpToQuestion(index)}
                            className="relative"
                          >
                            {index + 1}
                            {isAnswered && (
                              <CheckCircle2 className="absolute -top-1 -right-1 w-3 h-3 text-primary" />
                            )}
                          </Button>
                        )
                      })}
                    </div>

                    <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-primary rounded" />
                        <span>Soal saat ini</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-secondary rounded" />
                        <span>Sudah dijawab</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border rounded" />
                        <span>Belum dijawab</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Dijawab:</span>
                        <span className="font-medium">{Object.keys(answers).length}/{questions.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Belum:</span>
                        <span className="font-medium">{questions.length - Object.keys(answers).length}</span>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Render result mode
  if (examMode === 'result') {
    const tryout = getSelectedTryout()
    if (!tryout) {
      return <div className="min-h-screen flex items-center justify-center">Tryout tidak ditemukan</div>
    }

    const questions = mockQuestions[tryout.id] || []
    const { score, correct, wrong, empty } = calculateScore()
    const totalQuestions = questions.length

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Kembali ke Beranda
              </Button>
              <Badge variant="outline">{tryout.level}</Badge>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Score Card */}
          <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Hasil Tryout</CardTitle>
              <CardDescription>{tryout.title}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="p-6 bg-card rounded-lg border">
                  <div className="text-4xl font-bold text-primary mb-2">{score}</div>
                  <div className="text-sm text-muted-foreground">Total Skor</div>
                </div>

                <div className="p-6 bg-card rounded-lg border">
                  <div className="text-4xl font-bold text-green-600 mb-2">{correct}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Check className="w-3 h-3 text-green-600" />
                    Benar
                  </div>
                </div>

                <div className="p-6 bg-card rounded-lg border">
                  <div className="text-4xl font-bold text-red-600 mb-2">{wrong}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <X className="w-3 h-3 text-red-600" />
                    Salah
                  </div>
                </div>

                <div className="p-6 bg-card rounded-lg border">
                  <div className="text-4xl font-bold text-gray-600 mb-2">{empty}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Circle className="w-3 h-3 text-gray-600" />
                    Kosong
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t text-center">
                <div className="text-sm text-muted-foreground">
                  Peserta: <span className="font-medium">{userName}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Sekolah: <span className="font-medium">{userSchool}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  handleResetExam()
                  setExamMode('exam')
                }}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Ulangi Tryout
              </Button>
            </CardFooter>
          </Card>

          {/* Questions with Pembahasan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Pembahasan Soal
              </CardTitle>
              <CardDescription>
                Lihat pembahasan lengkap untuk setiap soal
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                {questions.map((q, index) => {
                  const userAnswer = answers[q.id]
                  const isCorrect = userAnswer === q.correctAnswer

                  return (
                    <div key={q.id} className="border rounded-lg overflow-hidden">
                      {/* Question Header */}
                      <div
                        className={`p-4 border-b ${
                          !userAnswer
                            ? 'bg-gray-50'
                            : isCorrect
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant={isCorrect ? 'default' : 'destructive'}>
                            Soal {q.questionNumber}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              !userAnswer
                                ? 'bg-gray-100 text-gray-600'
                                : isCorrect
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }
                          >
                            {!userAnswer ? 'Tidak dijawab' : isCorrect ? 'Benar' : 'Salah'}
                          </Badge>
                        </div>

                        <p className="text-base leading-relaxed">{q.questionText}</p>
                      </div>

                      {/* Answer Options */}
                      <div className="p-4 space-y-2 bg-muted/30">
                        <div className={`grid grid-cols-2 gap-2 ${userAnswer ? 'md:grid-cols-4' : ''}`}>
                          {['A', 'B', 'C', 'D'].map((option) => {
                            const optionText = q[`option${option}` as keyof Question] as string
                            const isUserAnswer = userAnswer === option
                            const isCorrectAnswer = q.correctAnswer === option

                            return (
                              <div
                                key={option}
                                className={`p-3 rounded border text-sm ${
                                  isCorrectAnswer
                                    ? 'bg-green-100 border-green-500 text-green-800'
                                    : isUserAnswer
                                    ? 'bg-red-100 border-red-500 text-red-800'
                                    : 'bg-white'
                                }`}
                              >
                                <div className="font-medium mb-1">{option}.</div>
                                <div>{optionText}</div>
                                {isCorrectAnswer && (
                                  <div className="text-xs text-green-700 mt-1 font-medium">
                                    ✓ Jawaban Benar
                                  </div>
                                )}
                                {isUserAnswer && !isCorrectAnswer && (
                                  <div className="text-xs text-red-700 mt-1 font-medium">
                                    ✗ Jawaban Anda
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Explanation */}
                      <div className="p-4 border-t bg-blue-50/50">
                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          Pembahasan
                        </h4>
                        <p className="text-sm text-blue-950 leading-relaxed whitespace-pre-wrap">
                          {q.explanationText}
                        </p>
                        {q.explanationImage && (
                          <div className="mt-3 border rounded-lg p-3 bg-white">
                            <img
                              src={q.explanationImage}
                              alt="Pembahasan"
                              className="max-w-full h-auto"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="border-t bg-card mt-auto">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-sm text-muted-foreground">
              © 2024 Tryout Online Gratis. Platform latihan ujian online gratis untuk semua jenjang.
            </p>
          </div>
        </footer>
      </div>
    )
  }

  return null
}
