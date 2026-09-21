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
  }
];
export const implementedTools = tools.filter((t) => t.implemented);
export const categories = [...new Set(tools.map((t) => t.category))];
export function bySlug(slug: string) { return tools.find((t) => t.slug === slug); }
