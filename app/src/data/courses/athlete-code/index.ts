export interface AthleteCodeLesson {
  id: string;
  title: string;
  type: 'article';
  duration: string;
  contentImport: () => Promise<{ content: string }>;
}

export interface AthleteCodeCourse {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  level: string;
  category: string;
  totalLessons: number;
  duration: string;
  coverColor: string;
  tags: string[];
  lessons: AthleteCodeLesson[];
}

function estimateReadTime(wordCount: number): string {
  const minutes = Math.max(1, Math.round(wordCount / 200));
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }
  return `${minutes}min`;
}

export const athleteCodeCourse: AthleteCodeCourse = {
  id: 'athlete-code',
  title: 'Enhanced Games Athlete Code',
  description: 'The complete guide to performance protection, enhancing drug guidelines, and harm reduction for Enhanced Games athletes.',
  longDescription: 'The Enhanced Games Athlete Code is a comprehensive manual covering PES safety, protocols, health monitoring, ethics, and harm reduction. This course provides athletes with evidence-based understanding of performance-enhancing substances, medical supervision frameworks, and responsible enhancement practices across tested and non-tested sports.',
  level: 'Intermediate',
  category: 'Education',
  totalLessons: 50,
  duration: '~25 hours',
  coverColor: 'linear-gradient(135deg, #f59e0b, #d97706)',
  tags: ['Athlete Code', 'Enhanced Games', 'PES', 'Harm Reduction', 'Protocols', 'Safety'],
  lessons: [
    {
      id: 'ac-l1',
      title: 'Glossary',
      type: 'article',
      duration: estimateReadTime(10),
      contentImport: () => import('./content/lesson-01-glossary'),
    },
    {
      id: 'ac-l2',
      title: 'Welcome & Guiding Ethos',
      type: 'article',
      duration: estimateReadTime(109),
      contentImport: () => import('./content/lesson-02-welcome-guiding-ethos'),
    },
    {
      id: 'ac-l3',
      title: 'Introduction',
      type: 'article',
      duration: estimateReadTime(297),
      contentImport: () => import('./content/lesson-03-introduction'),
    },
    {
      id: 'ac-l4',
      title: 'Rationale Behind PES Use in Enhanced Games',
      type: 'article',
      duration: estimateReadTime(635),
      contentImport: () => import('./content/lesson-04-rationale-behind-pes-use-in-enhanced-games'),
    },
    {
      id: 'ac-l5',
      title: 'Cheating, Fairness, and Performance Enhancement',
      type: 'article',
      duration: estimateReadTime(1665),
      contentImport: () => import('./content/lesson-05-cheating-fairness-and-performance-enhancement'),
    },
    {
      id: 'ac-l6',
      title: 'What Are Performance Enhancing Substances?',
      type: 'article',
      duration: estimateReadTime(154),
      contentImport: () => import('./content/lesson-06-what-are-performance-enhancing-substances'),
    },
    {
      id: 'ac-l7',
      title: 'Medical Use and Regulatory History of PESs',
      type: 'article',
      duration: estimateReadTime(1277),
      contentImport: () => import('./content/lesson-07-medical-use-and-regulatory-history-of-pess'),
    },
    {
      id: 'ac-l8',
      title: 'Risk vs Reward',
      type: 'article',
      duration: estimateReadTime(1592),
      contentImport: () => import('./content/lesson-08-risk-vs-reward'),
    },
    {
      id: 'ac-l9',
      title: 'Sleep Quality & Recovery Testing',
      type: 'article',
      duration: estimateReadTime(176),
      contentImport: () => import('./content/lesson-09-sleep-quality-recovery-testing'),
    },
    {
      id: 'ac-l10',
      title: 'Physical Activity & Energy Expenditure',
      type: 'article',
      duration: estimateReadTime(164),
      contentImport: () => import('./content/lesson-10-physical-activity-energy-expenditure'),
    },
    {
      id: 'ac-l11',
      title: 'Cardiovascular & Stress Monitoring',
      type: 'article',
      duration: estimateReadTime(144),
      contentImport: () => import('./content/lesson-11-cardiovascular-stress-monitoring'),
    },
    {
      id: 'ac-l12',
      title: 'Maximal Cardiorespiratory Fitness Test',
      type: 'article',
      duration: estimateReadTime(156),
      contentImport: () => import('./content/lesson-12-maximal-cardiorespiratory-fitness-test'),
    },
    {
      id: 'ac-l13',
      title: 'Strength & Power Diagnostics',
      type: 'article',
      duration: estimateReadTime(124),
      contentImport: () => import('./content/lesson-13-strength-power-diagnostics'),
    },
    {
      id: 'ac-l14',
      title: 'Quality of Life & Wellbeing',
      type: 'article',
      duration: estimateReadTime(84),
      contentImport: () => import('./content/lesson-14-quality-of-life-wellbeing'),
    },
    {
      id: 'ac-l15',
      title: 'Gene Expression Testing (Transcriptomics)',
      type: 'article',
      duration: estimateReadTime(96),
      contentImport: () => import('./content/lesson-15-gene-expression-testing-transcriptomics'),
    },
    {
      id: 'ac-l16',
      title: 'Proteomics',
      type: 'article',
      duration: estimateReadTime(77),
      contentImport: () => import('./content/lesson-16-proteomics'),
    },
    {
      id: 'ac-l17',
      title: 'Metabolomics',
      type: 'article',
      duration: estimateReadTime(94),
      contentImport: () => import('./content/lesson-17-metabolomics'),
    },
    {
      id: 'ac-l18',
      title: 'Final Summary',
      type: 'article',
      duration: estimateReadTime(330),
      contentImport: () => import('./content/lesson-18-final-summary'),
    },
    {
      id: 'ac-l19',
      title: 'Myths About Performance-Enhancing Substances',
      type: 'article',
      duration: estimateReadTime(1542),
      contentImport: () => import('./content/lesson-19-myths-about-performance-enhancing-substances'),
    },
    {
      id: 'ac-l20',
      title: 'Reappraising PES Harms and Risks',
      type: 'article',
      duration: estimateReadTime(456),
      contentImport: () => import('./content/lesson-20-reappraising-pes-harms-and-risks'),
    },
    {
      id: 'ac-l21',
      title: 'Comparison of IM vs SubQ Administration',
      type: 'article',
      duration: estimateReadTime(593),
      contentImport: () => import('./content/lesson-21-comparison-of-im-vs-subq-administration'),
    },
    {
      id: 'ac-l22',
      title: 'Post-Injection Guidance for Elite Athletes',
      type: 'article',
      duration: estimateReadTime(308),
      contentImport: () => import('./content/lesson-22-post-injection-guidance-for-elite-athletes'),
    },
    {
      id: 'ac-l23',
      title: 'PES Approved for Use by Enhanced Games',
      type: 'article',
      duration: estimateReadTime(4231),
      contentImport: () => import('./content/lesson-23-pes-approved-for-use-by-enhanced-games'),
    },
    {
      id: 'ac-l24',
      title: 'Responsibility of the Athlete',
      type: 'article',
      duration: estimateReadTime(478),
      contentImport: () => import('./content/lesson-24-responsibility-of-the-athlete'),
    },
    {
      id: 'ac-l25',
      title: 'Proposed Athlete Enhancement Protocols',
      type: 'article',
      duration: estimateReadTime(1092),
      contentImport: () => import('./content/lesson-25-proposed-athlete-enhancement-protocols'),
    },
    {
      id: 'ac-l26',
      title: 'Cluster 1: AAS - Weightlifting / Throwing / Power Sports',
      type: 'article',
      duration: estimateReadTime(81),
      contentImport: () => import('./content/lesson-26-cluster-1-aas-weightlifting-throwing-power-sports'),
    },
    {
      id: 'ac-l27',
      title: 'Cluster 2: AAS - Sprint / Middle-distance / Field Events',
      type: 'article',
      duration: estimateReadTime(63),
      contentImport: () => import('./content/lesson-27-cluster-2-aas-sprint-middle-distance-field-events'),
    },
    {
      id: 'ac-l28',
      title: 'Cluster 3: EPO & Blood-Doping - Endurance Sports',
      type: 'article',
      duration: estimateReadTime(80),
      contentImport: () => import('./content/lesson-28-cluster-3-epo-blood-doping-endurance-sports'),
    },
    {
      id: 'ac-l29',
      title: 'Cluster 4: Metabolic Modulators',
      type: 'article',
      duration: estimateReadTime(66),
      contentImport: () => import('./content/lesson-29-cluster-4-metabolic-modulators'),
    },
    {
      id: 'ac-l30',
      title: 'Cluster 5: Stimulants - Sprint / Combat / Team Sports',
      type: 'article',
      duration: estimateReadTime(130),
      contentImport: () => import('./content/lesson-30-cluster-5-stimulants-sprint-combat-team-sports'),
    },
    {
      id: 'ac-l31',
      title: 'Cluster 7: Beta-Blockers - Precision / Calmness Sports',
      type: 'article',
      duration: estimateReadTime(47),
      contentImport: () => import('./content/lesson-31-cluster-7-beta-blockers-precision-calmness-sports'),
    },
    {
      id: 'ac-l32',
      title: 'Cluster 8: Historical / Systematic Doping Programs',
      type: 'article',
      duration: estimateReadTime(171),
      contentImport: () => import('./content/lesson-32-cluster-8-historical-systematic-doping-programs'),
    },
    {
      id: 'ac-l33',
      title: 'Athlete Assessment, Health Optimisation, and Intervention Pathway',
      type: 'article',
      duration: estimateReadTime(644),
      contentImport: () => import('./content/lesson-33-athlete-assessment-health-optimisation-and-intervention-path'),
    },
    {
      id: 'ac-l34',
      title: 'Parallels and Distinctions: HRT vs PES in Women',
      type: 'article',
      duration: estimateReadTime(191),
      contentImport: () => import('./content/lesson-34-parallels-and-distinctions-hrt-vs-pes-in-women'),
    },
    {
      id: 'ac-l35',
      title: 'Risks, Evidence Gaps, and Harm-Minimisation Priorities',
      type: 'article',
      duration: estimateReadTime(295),
      contentImport: () => import('./content/lesson-35-risks-evidence-gaps-and-harm-minimisation-priorities'),
    },
    {
      id: 'ac-l36',
      title: 'Contraindications to HRT',
      type: 'article',
      duration: estimateReadTime(116),
      contentImport: () => import('./content/lesson-36-contraindications-to-hrt'),
    },
    {
      id: 'ac-l37',
      title: 'Fertility and PES in Female Athletes',
      type: 'article',
      duration: estimateReadTime(489),
      contentImport: () => import('./content/lesson-37-fertility-and-pes-in-female-athletes'),
    },
    {
      id: 'ac-l38',
      title: 'Virilisation in Female Athletes',
      type: 'article',
      duration: estimateReadTime(298),
      contentImport: () => import('./content/lesson-38-virilisation-in-female-athletes'),
    },
    {
      id: 'ac-l39',
      title: 'Definitions of Menopause, Perimenopause, and Postmenopause',
      type: 'article',
      duration: estimateReadTime(106),
      contentImport: () => import('./content/lesson-39-definitions-of-menopause-perimenopause-and-postmenopause'),
    },
    {
      id: 'ac-l40',
      title: 'Female Athletes and Contraception',
      type: 'article',
      duration: estimateReadTime(194),
      contentImport: () => import('./content/lesson-40-female-athletes-and-contraception'),
    },
    {
      id: 'ac-l41',
      title: 'Interaction Considerations in Enhanced Environments',
      type: 'article',
      duration: estimateReadTime(1404),
      contentImport: () => import('./content/lesson-41-interaction-considerations-in-enhanced-environments'),
    },
    {
      id: 'ac-l42',
      title: 'Athlete Case Vignettes',
      type: 'article',
      duration: estimateReadTime(1437),
      contentImport: () => import('./content/lesson-42-athlete-case-vignettes'),
    },
    {
      id: 'ac-l43',
      title: 'Psychological Support and Wellbeing',
      type: 'article',
      duration: estimateReadTime(137),
      contentImport: () => import('./content/lesson-43-psychological-support-and-wellbeing'),
    },
    {
      id: 'ac-l44',
      title: 'Continuous Research and Improvement',
      type: 'article',
      duration: estimateReadTime(281),
      contentImport: () => import('./content/lesson-44-continuous-research-and-improvement'),
    },
    {
      id: 'ac-l45',
      title: 'Medical Supervision including Emergency Response',
      type: 'article',
      duration: estimateReadTime(916),
      contentImport: () => import('./content/lesson-45-medical-supervision-including-emergency-response'),
    },
    {
      id: 'ac-l46',
      title: 'Practical Health Risk Reduction',
      type: 'article',
      duration: estimateReadTime(70),
      contentImport: () => import('./content/lesson-46-practical-health-risk-reduction'),
    },
    {
      id: 'ac-l47',
      title: 'Ethical Framework',
      type: 'article',
      duration: estimateReadTime(584),
      contentImport: () => import('./content/lesson-47-ethical-framework'),
    },
    {
      id: 'ac-l48',
      title: 'Male - Frequently Asked Questions',
      type: 'article',
      duration: estimateReadTime(867),
      contentImport: () => import('./content/lesson-48-male-frequently-asked-questions'),
    },
    {
      id: 'ac-l49',
      title: 'Female Question and Answer',
      type: 'article',
      duration: estimateReadTime(1355),
      contentImport: () => import('./content/lesson-49-female-question-and-answer'),
    },
    {
      id: 'ac-l50',
      title: 'What to do if?',
      type: 'article',
      duration: estimateReadTime(3881),
      contentImport: () => import('./content/lesson-50-what-to-do-if'),
    },
  ],
};
