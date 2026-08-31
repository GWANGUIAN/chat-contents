import type { QuizQuestion } from './quiz-types'

/** 최초 실행 시 제공되는 기본 상식문제 10개(객관식/주관식 혼합). */
export const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    kind: 'choice',
    prompt: '대한민국의 수도는 어디일까요?',
    options: ['서울', '부산', '인천', '대전'],
    correctOptionIndex: 0,
  },
  {
    id: 'q2',
    kind: 'short',
    prompt: '미국의 수도는 어디일까요?',
    acceptedAnswers: ['워싱턴 D.C.', '워싱턴DC', '워싱턴', '워싱턴 디씨'],
  },
  {
    id: 'q3',
    kind: 'choice',
    prompt: '세계에서 가장 높은 산은 무엇일까요?',
    options: ['에베레스트산', 'K2', '킬리만자로산', '몽블랑산'],
    correctOptionIndex: 0,
  },
  {
    id: 'q4',
    kind: 'choice',
    prompt: '물의 화학식은 무엇일까요?',
    options: ['H2O', 'CO2', 'NaCl', 'O2'],
    correctOptionIndex: 0,
  },
  {
    id: 'q5',
    kind: 'short',
    prompt: '이순신 장군이 학익진 전법으로 왜군을 크게 물리친 해전의 이름은?',
    acceptedAnswers: ['한산도대첩', '한산도 대첩', '한산대첩'],
  },
  {
    id: 'q6',
    kind: 'choice',
    prompt: '사람 몸에서 가장 큰 장기는 무엇일까요?',
    options: ['피부', '간', '폐', '심장'],
    correctOptionIndex: 0,
  },
  {
    id: 'q7',
    kind: 'short',
    prompt: '세계에서 가장 긴 강의 이름은?',
    acceptedAnswers: ['나일강', '나일 강'],
  },
  {
    id: 'q8',
    kind: 'choice',
    prompt: '훈민정음을 창제한 조선의 왕은 누구일까요?',
    options: ['세종대왕', '태종', '정조', '영조'],
    correctOptionIndex: 0,
  },
  {
    id: 'q9',
    kind: 'short',
    prompt: '태양을 제외하고 지구에서 가장 가까운 항성의 이름은?',
    acceptedAnswers: ['프록시마 센타우리', '프록시마센타우리'],
  },
  {
    id: 'q10',
    kind: 'choice',
    prompt: '2002년 한일 월드컵에서 대한민국 축구 국가대표팀이 기록한 최고 성적은?',
    options: ['4강', '8강', '16강', '우승'],
    correctOptionIndex: 0,
  },
]
