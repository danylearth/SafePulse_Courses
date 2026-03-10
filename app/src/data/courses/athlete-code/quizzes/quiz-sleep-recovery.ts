import type { QuizQuestionData } from '@/components/QuizQuestion/QuizQuestion';

export const quizData: QuizQuestionData[] = [
  {
    id: 'sleep-q1',
    question: 'Which sleep stage is primarily responsible for muscle repair and growth hormone release?',
    subtitle: 'Select the correct answer.',
    options: [
      'REM sleep',
      'Deep sleep',
      'Light sleep',
      'Sleep onset phase',
    ],
    correctIndex: 1,
  },
  {
    id: 'sleep-q2',
    question: 'What are the primary consequences of poor sleep quality for enhanced athletes?',
    subtitle: 'Select the most comprehensive answer.',
    options: [
      'Only reduced energy levels',
      'Reduced strength, slower recovery, higher inflammation, and impaired learning',
      'Only mood instability',
      'Slightly lower performance with no significant health impacts',
    ],
    correctIndex: 1,
  },
  {
    id: 'sleep-q3',
    question: 'Why is sleep monitoring especially critical for enhanced athletes?',
    subtitle: 'Select the correct answer.',
    options: [
      'Enhancement has no effect on sleep patterns',
      'Enhanced athletes have lower metabolic rates',
      'Enhancement increases adrenaline, metabolic rate, and neural drive, which can destabilize sleep',
      'Sleep is less important when using performance-enhancing substances',
    ],
    correctIndex: 2,
  },
  {
    id: 'sleep-q4',
    question: 'What does HRV (Heart Rate Variability) during sleep indicate?',
    subtitle: 'Select the correct answer.',
    options: [
      'Total hours of sleep achieved',
      'Quality of nervous system recovery and stress adaptation',
      'Number of dreams experienced',
      'Muscle growth rate',
    ],
    correctIndex: 1,
  },
];
