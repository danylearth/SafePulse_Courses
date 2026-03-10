import type { QuizQuestionData } from '@/components/QuizQuestion/QuizQuestion';

export const quizData: QuizQuestionData[] = [
  {
    id: 'activity-q1',
    question: 'What is the primary benefit of tracking physical activity and energy expenditure for athletes?',
    subtitle: 'Select the correct answer.',
    options: [
      'To count daily steps only',
      'To ensure training load matches recovery capacity and nutritional intake',
      'To compete with other athletes on activity metrics',
      'To reduce all physical activity',
    ],
    correctIndex: 1,
  },
  {
    id: 'activity-q2',
    question: 'Enhanced athletes experience amplified metabolic demands. What does this mean for energy monitoring?',
    subtitle: 'Select the most accurate answer.',
    options: [
      'They need to monitor less frequently than natural athletes',
      'Energy expenditure tracking becomes less relevant',
      'They require closer monitoring to prevent overreaching and ensure adequate fueling',
      'Metabolic rate is not affected by performance enhancement',
    ],
    correctIndex: 2,
  },
  {
    id: 'activity-q3',
    question: 'Which metric combination best reveals training-recovery balance?',
    subtitle: 'Select the correct answer.',
    options: [
      'Daily steps only',
      'Training load, energy expenditure, and recovery markers like HRV',
      'Social media engagement',
      'Body weight alone',
    ],
    correctIndex: 1,
  },
];
