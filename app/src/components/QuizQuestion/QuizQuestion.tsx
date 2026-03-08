'use client';

import { useState } from 'react';
import styles from './QuizQuestion.module.css';
import { CheckCircle2, XCircle } from 'lucide-react';

export interface QuizQuestionData {
    id: string;
    question: string;
    subtitle?: string;
    options: string[];
    correctIndex: number;
}

interface QuizQuestionProps {
    data: QuizQuestionData;
    onComplete?: (correct: boolean) => void;
}

export default function QuizQuestion({ data, onComplete }: QuizQuestionProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const isCorrect = selectedIndex === data.correctIndex;

    const handleSubmit = () => {
        if (selectedIndex === null) return;
        setSubmitted(true);
        onComplete?.(isCorrect);
    };

    const handleRetry = () => {
        setSelectedIndex(null);
        setSubmitted(false);
    };

    return (
        <div className={styles.card}>
            <div className={styles.questionBlock}>
                <h3 className={styles.questionText}>{data.question}</h3>
                <p className={styles.subtitle}>{data.subtitle || 'Select the correct answer.'}</p>
            </div>

            <div className={styles.options}>
                {data.options.map((option, index) => {
                    let optionClass = styles.option;
                    if (submitted && index === data.correctIndex) {
                        optionClass += ` ${styles.correct}`;
                    } else if (submitted && index === selectedIndex && !isCorrect) {
                        optionClass += ` ${styles.wrong}`;
                    } else if (!submitted && index === selectedIndex) {
                        optionClass += ` ${styles.selected}`;
                    }

                    return (
                        <label key={index} className={optionClass}>
                            <span className={styles.radio}>
                                <input
                                    type="radio"
                                    name={`quiz-${data.id}`}
                                    checked={selectedIndex === index}
                                    onChange={() => !submitted && setSelectedIndex(index)}
                                    disabled={submitted}
                                />
                                <span className={styles.radioCircle}></span>
                            </span>
                            <span className={styles.optionText}>{option}</span>
                            {submitted && index === data.correctIndex && (
                                <CheckCircle2 size={18} className={styles.correctIcon} />
                            )}
                            {submitted && index === selectedIndex && !isCorrect && index !== data.correctIndex && (
                                <XCircle size={18} className={styles.wrongIcon} />
                            )}
                        </label>
                    );
                })}
            </div>

            <div className={styles.actions}>
                {!submitted ? (
                    <button
                        className={styles.submitBtn}
                        disabled={selectedIndex === null}
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                ) : (
                    <div className={styles.resultRow}>
                        <span className={isCorrect ? styles.resultCorrect : styles.resultWrong}>
                            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                        </span>
                        {!isCorrect && (
                            <button className={styles.retryBtn} onClick={handleRetry}>
                                Try Again
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
