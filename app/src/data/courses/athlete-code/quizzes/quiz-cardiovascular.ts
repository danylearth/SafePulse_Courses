import type { QuizQuestionData } from '@/components/QuizQuestion/QuizQuestion';

export const quizData: QuizQuestionData[] = [
  {
    id: 'cardio-q1',
    question: 'What does HRV (Heart Rate Variability) measure?',
    subtitle: 'Select the correct answer.',
    options: [
      'The total number of heartbeats per minute',
      'The variation in time intervals between consecutive heartbeats, indicating autonomic nervous system balance',
      'Blood pressure levels',
      'Oxygen saturation in the blood',
    ],
    correctIndex: 1,
  },
  {
    id: 'cardio-q2',
    question: 'Why are enhanced athletes at increased cardiovascular risk?',
    subtitle: 'Select the most comprehensive answer.',
    options: [
      'They train less than natural athletes',
      'Enhancement can shift the ANS toward sympathetic dominance: higher HR, elevated adrenaline, increased cardiac workload',
      'They have lower blood pressure',
      'Enhancement has no effect on cardiovascular function',
    ],
    correctIndex: 1,
  },
  {
    id: 'cardio-q3',
    question: 'What are early warning signs of cardiovascular overload?',
    subtitle: 'Select the correct answer.',
    options: [
      'Increased energy and improved performance',
      'HRV drop, elevated resting HR, rising blood pressure, poor HR recovery, low morning readiness',
      'Better sleep quality',
      'Decreased appetite',
    ],
    correctIndex: 1,
  },
  {
    id: 'cardio-q4',
    question: 'What is the primary purpose of daily cardiovascular monitoring for enhanced athletes?',
    subtitle: 'Select the correct answer.',
    options: [
      'To share metrics on social media',
      'To detect early signs of overload and adjust training before problems escalate',
      'To increase training volume regardless of recovery',
      'To eliminate all rest days',
    ],
    correctIndex: 1,
  },
];
