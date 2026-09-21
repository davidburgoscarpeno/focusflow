export interface ToolFaq { q: string; a: string }
export interface ToolExample { title: string; input?: string; output?: string; note?: string }
export interface Tool {
  slug: string; name: string; category: string; description: string;
  seoTitle: string; metaDescription: string; intro: string;
  howTo: string[]; examples: ToolExample[]; faqs: ToolFaq[];
  related: string[]; component: string; mode?: string; implemented: boolean; popular?: boolean;
}
export const tools: Tool[] = [
  {
    slug: 'pomodoro-timer',
    name: 'Pomodoro Timer',
    category: 'Timers',
    description: 'A clean Pomodoro timer: 25-minute focus blocks with short and long breaks.',
    seoTitle: 'Pomodoro Timer - Free Online Focus Timer | FocusFlow',
    metaDescription: 'Free online Pomodoro timer. 25-minute focus sessions with 5-minute short breaks and 15-minute long breaks. Customizable, no sign-up.',
    intro: 'Work in focused 25-minute blocks separated by short breaks. After four focus blocks, take a longer break. That is the whole method - this timer handles the bookkeeping.',
    howTo: ['Press Start to begin a focus block.', 'When it ends, the timer switches to a break automatically.', 'Every four focus blocks, the break is longer.', 'Adjust the durations to taste.'],
    examples: [{ title: 'Classic cycle', output: 'Focus 25 min, break 5 min. After 4 focus blocks: long break 15 min.' }],
    faqs: [
      { q: 'Does it keep running if I switch tabs?', a: 'Yes. The timer uses timestamps, not intervals alone, so it stays accurate in background tabs.' },
      { q: 'Do I need an account?', a: 'No. Nothing is stored or sent anywhere.' }
    ],
    related: [],
    component: 'PomodoroTool',
    implemented: true,
    popular: true
  },
  {
    slug: 'eisenhower-matrix',
    name: 'Eisenhower Matrix',
    category: 'Prioritize',
    description: 'Sort tasks into do, schedule, delegate and delete quadrants.',
    seoTitle: 'Eisenhower Matrix - Prioritize Tasks Online | FocusFlow',
    metaDescription: 'Free Eisenhower matrix tool. Sort tasks into do first, schedule, delegate and delete quadrants. Saved privately in your browser.',
    intro: 'Everything feels urgent until you map it. Sort your tasks by urgency and importance and the next action becomes obvious.',
    howTo: ['Add a task and pick its quadrant.', 'Work the Do first list.', 'Schedule the important-but-not-urgent tasks before they turn urgent.'],
    examples: [{ title: 'Prepare tomorrow presentation', output: 'Do first (urgent + important). Learn a new skill: Schedule.' }],
    faqs: [{ q: 'Where is my data stored?', a: 'Only in your browser local storage - no account, no upload.' }],
    related: ['habit-tracker', 'deadline-countdown', 'pomodoro-timer'],
    component: 'EisenhowerTool', implemented: true, popular: true
  },
  {
    slug: 'habit-tracker',
    name: 'Habit Tracker',
    category: 'Habits',
    description: 'Daily check-ins with automatic streak counting.',
    seoTitle: 'Habit Tracker - Build Streaks Online Free | FocusFlow',
    metaDescription: 'Free habit tracker. Check off daily habits and watch your streaks grow. Private: data stays in your browser.',
    intro: 'Streaks make habits stick. Check off each habit daily and the counter keeps your chain alive.',
    howTo: ['Add a habit.', 'Mark it done each day.', 'Protect the streak - it resets after a missed day.'],
    examples: [{ title: 'Read 20 minutes', output: 'Day 1, day 2... a 30-day chain in a month.' }],
    faqs: [{ q: 'What if I miss a day?', a: 'The streak resets to zero but total check-ins remain. The chain is a motivator, not a judge.' }],
    related: ['pomodoro-timer', 'eisenhower-matrix'],
    component: 'HabitTool', implemented: true, popular: true
  },
  {
    slug: 'deadline-countdown',
    name: 'Deadline Countdown',
    category: 'Time',
    description: 'Live countdown to any date and time.',
    seoTitle: 'Deadline Countdown - Days, Hours, Minutes Left | FocusFlow',
    metaDescription: 'Free deadline countdown. Live days, hours, minutes and seconds to any date. Works for passed deadlines too.',
    intro: 'How long until the launch, the exam, the trip? A live countdown in days, hours, minutes and seconds.',
    howTo: ['Pick the deadline date and time.', 'Watch the live countdown.', 'After it passes, it shows time since.'],
    examples: [{ title: 'Project due Friday 18:00', output: '2 days 4 hours 12 minutes left.' }],
    faqs: [],
    related: ['pomodoro-timer', 'eisenhower-matrix'],
    component: 'CountdownTool', implemented: true
  },
  {
    slug: 'box-breathing-timer',
    name: 'Box Breathing Timer',
    category: 'Calm',
    description: 'Guided 4-4-4-4 box breathing for instant calm and focus.',
    seoTitle: 'Box Breathing Timer - 4-4-4-4 Guided Breathing | FocusFlow',
    metaDescription: 'Free box breathing timer. Guided 4-4-4-4 breathing cycle to calm down and refocus in minutes.',
    intro: 'Four seconds in, four hold, four out, four hold. The technique Navy SEALs use to stay calm - and a fast reset before deep work.',
    howTo: ['Press start.', 'Follow the phase on screen.', 'Continue for 2-5 minutes.'],
    examples: [{ title: 'Before a presentation', output: 'Three minutes of box breathing lowers the heart rate.' }],
    faqs: [{ q: 'How often?', a: 'Any time you feel scattered. Many people do one round before each focus session.' }],
    related: ['pomodoro-timer', 'habit-tracker'],
    component: 'BreathingTool', implemented: true
  },
  {
    slug: 'time-blocking-planner',
    name: 'Time Blocking Planner',
    category: 'Plan',
    description: 'Turn your task list into a timed schedule with automatic breaks.',
    seoTitle: 'Time Blocking Planner - Schedule Your Day | FocusFlow',
    metaDescription: 'Free time blocking planner. Enter tasks and durations, get a timed schedule with automatic breaks every 50 minutes.',
    intro: 'A task list without times is a wish list. Assign minutes to each task and get a realistic schedule with breaks built in.',
    howTo: ['Set your start time.', 'Add tasks with their estimated minutes.', 'Follow the generated schedule - breaks are inserted every 50 minutes.'],
    examples: [{ title: 'Three 25-minute tasks from 9:00', output: '09:00 task 1, 09:25 task 2, 09:50 break, 10:00 task 3.' }],
    faqs: [{ q: 'Estimate too low?', a: 'Most people underestimate by 30-50%. After a week of time blocking, your estimates get honest.' }],
    related: ['pomodoro-timer', 'eisenhower-matrix', 'habit-tracker'],
    component: 'PlanTool', implemented: true
  }
];
export const implementedTools = tools.filter((t) => t.implemented);
export const categories = [...new Set(tools.map((t) => t.category))];
export function bySlug(slug: string) { return tools.find((t) => t.slug === slug); }
