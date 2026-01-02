'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import { Clock, FileText, Users, ArrowLeft, Play, CheckCircle2, Circle, Check, X, Eye, RotateCcw, Home, Award, AlertCircle } from 'lucide-react'

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

// Mock data
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
  const [timeRemaining, setTimeRemaining] = useState(90 * 60)
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
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <Award className="w-full h-full object-contain" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-card-foreground">Tryout Online Gratis</h1>
                  <p className="text-sm text-muted-foreground">Latihan ujian online SD, SMP, SMA, dan UTBK</p>
                </div>
              </div>
              <div className="text-muted-foreground text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span id="user-count">12,847</span> Peserta
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-card-foreground">Pilih Jenjang Pendidikan</h2>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTryouts.map((tryout) => (
              <Card key={tryout.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleStartTryout(tryout.id)}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-primary text-primary-foreground" variant="default">
                      {tryout.level}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2 text-card-foreground line-clamp-2">{tryout.title}</CardTitle>
                  <CardDescription className="text-muted-foreground text-sm line-clamp-2">{tryout.description}</CardDescription>
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
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Play className="w-5 h-5 mr-2" />
                    Mulai Tryout
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>

        <footer className="border-t bg-card mt-auto">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-sm text-muted-foreground">© 2024 Tryout Online Gratis. Platform latihan ujian online gratis untuk semua jenjang.</p>
          </div>
        </footer>
      </div>
    )
  }

  // Render form mode
  if (examMode === 'form') {
    const tryout = getSelectedTryout()
    if (!tryout) {
      return <div className="min-h-screen flex items-center justify-center bg-background">Tryout tidak ditemukan</div>
    }

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="gap-2 text-card-foreground hover:bg-secondary"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-primary text-primary-foreground" variant="default">
                    {tryout.level}
                  </Badge>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Clock className="w-5 h-5" />
                    <span>{tryout.duration} menit</span>
                  </div>
                </div>
                <CardTitle className="text-2xl mb-2 text-card-foreground">{tryout.title}</CardTitle>
                <CardDescription className="text-muted-foreground text-base">{tryout.description}</CardDescription>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <FileText className="w-5 h-5" />
                    <span>{tryout.questionCount} soal pilihan ganda</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 p-6">
                {formError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-5 w-5" />
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-medium text-card-foreground">
                    Nama Lengkap <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Masukkan nama lengkap"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school" className="text-base font-medium text-card-foreground">
                    Asal Sekolah/Universitas <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="school"
                    placeholder="Masukkan nama sekolah atau universitas"
                    value={userSchool}
                    onChange={(e) => setUserSchool(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                <Alert>
                  <Play className="h-5 w-5 text-card-foreground" />
                  <AlertDescription className="text-muted-foreground text-base">
                    Pastikan koneksi internet stabil sebelum memulai ujian. Timer akan berjalan otomatis setelah Anda mengklik tombol "Mulai Ujian".
                  </AlertDescription>
                </Alert>
              </CardContent>

              <CardFooter className="flex justify-center p-6">
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-4"
                  onClick={handleStartExam}
                >
                  <Play className="w-6 h-6 mr-2" />
                  Mulai Ujian
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  // Render exam mode
  if (examMode === 'exam') {
    const tryout = getSelectedTryout()
    if (!tryout) {
      return <div className="min-h-screen flex items-center justify-center bg-background">Tryout tidak ditemukan</div>
    }

    const questions = mockQuestions[tryout.id] || []
    const currentQ = questions[currentQuestion]

    if (!currentQ) {
      return <div className="min-h-screen flex items-center justify-center bg-background">Soal tidak ditemukan</div>
    }

    const currentAnswer = answers[currentQ.id]

    return (
      <div className="min-h-screen bg-background">
        {/* Header with timer */}
        <header className="border-b bg-card shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="gap-2 text-card-foreground hover:bg-secondary"
              >
                <Home className="w-5 h-5" />
                Keluar
              </Button>

              <div className="text-center text-muted-foreground text-sm">
                <div className="font-semibold text-card-foreground">{tryout.title}</div>
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{userName}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-7 h-7 text-muted-foreground" />
                <span className="text-4xl font-bold font-mono text-card-foreground">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Question Area */}
            <div className="lg:col-span-3">
              <Card className="border">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="default" className="bg-primary text-primary-foreground text-lg px-4 py-2 font-semibold">
                      Soal {currentQ.questionNumber}
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground px-4 py-2 text-base">
                      {currentQuestion + 1} dari {questions.length}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 p-6">
                  {/* Question Text */}
                  <div className="prose max-w-none">
                    <p className="text-xl leading-relaxed text-card-foreground">{currentQ.questionText}</p>
                  </div>

                  {/* Question Image (optional) */}
                  {currentQ.questionImage && (
                    <div className="border rounded-lg p-4 bg-secondary">
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
                    <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                      <RadioGroupItem value="A" id="optionA" />
                      <Label htmlFor="optionA" className="flex-1 cursor-pointer font-medium text-card-foreground text-base">
                        A. {currentQ.optionA}
                      </Label>
                    </div>

                    <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                      <RadioGroupItem value="B" id="optionB" />
                      <Label htmlFor="optionB" className="flex-1 cursor-pointer font-medium text-card-foreground text-base">
                        B. {currentQ.optionB}
                      </Label>
                    </div>

                    <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                      <RadioGroupItem value="C" id="optionC" />
                      <Label htmlFor="optionC" className="flex-1 cursor-pointer font-medium text-card-foreground text-base">
                        C. {currentQ.optionC}
                      </Label>
                    </div>

                    <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                      <RadioGroupItem value="D" id="optionD" />
                      <Label htmlFor="optionD" className="flex-1 cursor-pointer font-medium text-card-foreground text-base">
                        D. {currentQ.optionD}
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>

                <CardFooter className="flex justify-between p-6">
                  <Button
                    variant="outline"
                    onClick={() => handleNavigate('prev')}
                    disabled={currentQuestion === 0}
                    className="text-base py-3 px-6 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Sebelumnya
                  </Button>

                  <div className="flex gap-2">
                    {currentQuestion === questions.length - 1 ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3 px-6">
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            Selesai & Submit
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card border-border">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Konfirmasi Submit</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-300 text-base">
                              Anda yakin ingin menyelesaikan ujian? Jawaban tidak dapat diubah setelah submit.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-secondary text-secondary-foreground hover:bg-secondary/80">Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSubmitExam} className="bg-primary text-primary-foreground hover:bg-primary/90">Submit Jawaban</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button onClick={() => handleNavigate('next')} className="text-base py-3 px-6">
                        Selanjutnya
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Sidebar - Question Navigation */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border">
                <CardHeader>
                  <CardTitle className="text-lg text-card-foreground mb-2">Navigasi Soal</CardTitle>
                  <CardDescription className="text-muted-foreground text-sm">
                    Klik nomor untuk loncat ke soal
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="grid grid-cols-4 gap-2 p-4">
                      {questions.map((q, index) => {
                        const isAnswered = !!answers[q.id]
                        const isCurrent = index === currentQuestion

                        return (
                          <Button
                            key={q.id}
                            variant={isCurrent ? 'default' : isAnswered ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => handleJumpToQuestion(index)}
                            className={`relative text-sm py-3 ${isCurrent ? 'scale-105' : ''}`}
                          >
                            {index + 1}
                            {isAnswered && (
                              <CheckCircle2 className="absolute -top-1 -right-1 w-4 h-4 text-green-500" />
                            )}
                          </Button>
                        )
                      })}
                    </div>

                    <div className="mt-4 space-y-2 p-4 pt-4 border-t">
                      <div className="flex justify-between text-sm text-card-foreground">
                        <span>Dijawab:</span>
                        <span className="font-semibold text-card-foreground">{Object.keys(answers).length}</span>
                      </div>
                      <div className="flex justify-between text-sm text-card-foreground">
                        <span>Belum:</span>
                        <span className="font-semibold text-card-foreground">{questions.length - Object.keys(answers).length}</span>
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
      return <div className="min-h-screen flex items-center justify-center bg-background">Tryout tidak ditemukan</div>
    }

    const questions = mockQuestions[tryout.id] || []
    const { score, correct, wrong, empty } = calculateScore()
    const totalQuestions = questions.length
    const percentage = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="gap-2 text-card-foreground hover:bg-secondary"
              >
                <Home className="w-5 h-5" />
                Kembali ke Beranda
              </Button>
              <Badge variant="outline" className="bg-secondary text-secondary-foreground text-base px-4 py-2">
                {tryout.level}
              </Badge>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Score Card */}
          <Card className="mb-8 border">
            <CardHeader className="text-center py-8">
              <CardTitle className="text-3xl mb-3 text-card-foreground">Hasil Tryout</CardTitle>
              <CardDescription className="text-muted-foreground text-lg">{tryout.title}</CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-secondary p-6 rounded-lg text-center">
                  <div className="text-5xl font-bold mb-3 text-card-foreground">{score}</div>
                  <div className="text-sm text-muted-foreground">Total Skor</div>
                </div>

                <div className="bg-secondary p-6 rounded-lg text-center">
                  <div className="text-5xl font-bold mb-3 text-green-600">{correct}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Benar
                  </div>
                </div>

                <div className="bg-secondary p-6 rounded-lg text-center">
                  <div className="text-5xl font-bold mb-3 text-red-600">{wrong}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <X className="w-4 h-4 text-red-500" />
                    Salah
                  </div>
                </div>

                <div className="bg-secondary p-6 rounded-lg text-center">
                  <div className="text-5xl font-bold mb-3 text-muted-foreground">{empty}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Circle className="w-4 h-4 text-muted-500" />
                    Kosong
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t text-center">
                <div className="text-sm text-muted-foreground mb-2">Persentase Keberhasilan</div>
                <div className="text-6xl font-bold mb-3 text-card-foreground">{percentage}%</div>
                <div className="text-base text-muted-foreground">
                  {percentage >= 90 ? '🏆 Luar Biasa! (Sangat Baik)' :
                   percentage >= 75 ? '👏 Bagus Sekali! (Baik)' :
                   percentage >= 60 ? '✨ Cukup Bagus (Sedang)' :
                   percentage >= 50 ? '📚 Perlu Latihan (Kurang)' :
                   '📖 Jangan Menyerah! (Kurang)'}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="text-sm text-muted-foreground">Peserta</div>
                  <div className="text-card-foreground text-base font-medium">{userName}</div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-muted-foreground">Asal Sekolah</div>
                  <div className="text-card-foreground text-base font-medium">{userSchool}</div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center gap-4 p-6">
              <Button
                variant="outline"
                onClick={() => {
                  handleResetExam()
                  setExamMode('exam')
                }}
                className="text-base py-3 px-6"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Ulangi Tryout
              </Button>
              <Button
                variant="default"
                onClick={handleBack}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-base py-3 px-6"
              >
                <Home className="w-5 h-5 mr-2" />
                Kembali ke Beranda
              </Button>
            </CardFooter>
          </Card>

          {/* Questions with Pembahasan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-card-foreground text-2xl">
                <Eye className="w-7 h-7" />
                Pembahasan Soal
              </CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                Lihat pembahasan lengkap untuk setiap soal
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                {questions.map((q, index) => {
                  const userAnswer = answers[q.id]
                  const isCorrect = userAnswer === q.correctAnswer

                  return (
                    <div key={q.id} className="border rounded-lg">
                      {/* Question Header */}
                      <div
                        className={`p-5 border ${
                          !userAnswer
                            ? 'bg-card'
                            : isCorrect
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant={isCorrect ? 'default' : 'destructive'} className={`text-base px-4 py-2 font-semibold ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                            Soal {q.questionNumber}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-sm px-3 py-1 font-medium border-2 ${
                              !userAnswer
                                ? 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                                : isCorrect
                                ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                : 'bg-red-500/20 text-red-300 border-red-500/30'
                            }`}
                          >
                            {!userAnswer ? 'Tidak dijawab' : isCorrect ? 'Benar' : 'Salah'}
                          </Badge>
                        </div>

                        <p className="text-lg leading-relaxed text-card-foreground">{q.questionText}</p>
                      </div>

                      {/* Answer Options */}
                      <div className="p-5 space-y-2 bg-secondary">
                        <div className="grid grid-cols-2 gap-2">
                          {['A', 'B', 'C', 'D'].map((option) => {
                            const optionText = q[`option${option}` as keyof Question] as string
                            const isUserAnswer = userAnswer === option
                            const isCorrectAnswer = q.correctAnswer === option

                            return (
                              <div
                                key={option}
                                className={`p-4 rounded border text-sm ${
                                  isCorrectAnswer
                                    ? 'bg-green-500 border-green-200 text-green-200'
                                    : isUserAnswer
                                    ? 'bg-red-500 border-red-200 text-red-200'
                                    : 'bg-card border-border text-muted-foreground'
                                }`}
                              >
                                <div className="font-medium mb-1 text-base">{option}.</div>
                                <div>{optionText}</div>
                                {isCorrectAnswer && (
                                  <div className="text-xs text-green-300 mt-1 font-medium">
                                    ✓ Jawaban Benar
                                  </div>
                                )}
                                {isUserAnswer && !isCorrectAnswer && (
                                  <div className="text-xs text-red-300 mt-1 font-medium">
                                    ✗ Jawaban Anda
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Explanation */}
                      <div className="bg-secondary p-5 border border-border">
                        <h4 className="font-semibold text-lg mb-2 text-card-foreground flex items-center gap-2">
                          <Eye className="w-5 h-5" />
                          Pembahasan
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {q.explanationText}
                        </p>
                        {q.explanationImage && (
                          <div className="mt-3 border rounded-lg p-4 bg-card">
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
      </div>
    )
  }

  return null
}
