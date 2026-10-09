import { JournalEntry } from '@/types';

export const SAMPLE_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'jrn_001',
    userId: 'usr_student_maya',
    title: 'The heavy feeling before 3rd period chemistry',
    content: `Today in the morning hall I felt that tight flutter in my chest again. Everyone else seemed to be laughing and talking effortlessly about the lab report, and I felt like I was watching from behind a glass screen.

I tried the 4-4-4 box breathing technique we talked about with MindCare and Ms. Henderson. Inhale 4, hold 4, out 4, hold 4. It didn’t completely stop the tightness, but it kept me from spiraling into thinking I would fail the entire semester. 

After class, Mrs. Gable mentioned that my lab analysis was clear and thoughtful. Reminding myself: the anxious prediction is not always the truth.`,
    moodTags: ['Anxious', 'Grounded', 'Chemistry'],
    privacy: 'SHARED_WITH_COUNSELLOR',
    sharedAt: '2026-10-08T15:30:00Z',
    isDraft: false,
    createdAt: '2026-10-08T15:20:00Z',
    updatedAt: '2026-10-08T15:30:00Z',
    wordCount: 118,
  },
  {
    id: 'jrn_002',
    userId: 'usr_student_maya',
    title: 'Group chat quietness and feeling invisible',
    content: `Nobody responded to my message in the art project chat for almost 6 hours, but then they were posting memes in the main server. Immediately my brain told me: 'they dislike you, you shouldn’t have said anything'.

I decided to close Discord for the evening instead of constantly checking if someone saw it. I drew two pages in my sketchbook instead with watercolours. It felt so much quieter in my head.

Writing this here privately because I don't want anyone at school to think I am being dramatic, but it genuinely stung.`,
    moodTags: ['Lonely', 'Frustrated', 'Art'],
    privacy: 'PRIVATE',
    isDraft: false,
    createdAt: '2026-10-05T20:10:00Z',
    updatedAt: '2026-10-05T20:45:00Z',
    wordCount: 104,
  },
  {
    id: 'jrn_003',
    userId: 'usr_student_maya',
    title: 'Saturday walk with Bailey and autumn air',
    content: `Taking Bailey (my golden retriever) through the pine trail when the late afternoon sun was hitting the leaves. For the first time in two weeks, my shoulders dropped away from my ears.

No test prep, no expectations. Just the sound of leaves crunching under paws. I want to remember this sensation for when Monday mornings feel heavy. Even on bad weeks, 30 minutes outside can reset my baseline.`,
    moodTags: ['Calm', 'Grateful', 'Nature'],
    privacy: 'SHARED_WITH_COUNSELLOR',
    sharedAt: '2026-10-03T18:00:00Z',
    isDraft: false,
    createdAt: '2026-10-03T17:50:00Z',
    updatedAt: '2026-10-03T18:00:00Z',
    wordCount: 82,
  },
  {
    id: 'jrn_004',
    userId: 'usr_student_maya',
    title: 'Why is asking for help so scary?',
    content: `Mom asked me if everything was okay because I stayed in my room until dinner yesterday. I just mumbled 'yeah, just tired' instead of saying I was overwhelmed with the college prep meeting.

I want to be able to tell her without feeling like I’m disappointing her or creating drama. Next week with Ms. Henderson, I want to roleplay how to bring this up casually at dinner.`,
    moodTags: ['Overwhelmed', 'Hopeful'],
    privacy: 'SHARED_WITH_COUNSELLOR',
    sharedAt: '2026-09-28T19:00:00Z',
    isDraft: false,
    createdAt: '2026-09-28T18:40:00Z',
    updatedAt: '2026-09-28T19:00:00Z',
    wordCount: 77,
  },
  {
    id: 'jrn_005',
    userId: 'usr_student_maya',
    title: 'Draft: Reflection on setting boundaries with Chloe',
    content: `When Chloe asked me to do her half of the history poster slides again, I almost said yes automatically just to keep the peace. But I paused and said: 'I can only finish slides 1 to 4 because I have track practice tonight.' She was slightly annoyed, but the world didn't end.`,
    moodTags: ['Proud', 'Grounded'],
    privacy: 'PRIVATE',
    isDraft: true,
    createdAt: '2026-09-22T21:15:00Z',
    updatedAt: '2026-09-22T21:30:00Z',
    wordCount: 56,
  },
];
