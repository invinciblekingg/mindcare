import { ChatConversation, ChatMessage } from '@/types';
import { SAMPLE_SAFETY_EVENTS } from './safetyEventsData';

export const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv_today',
    userId: 'usr_student_maya',
    title: 'Managing chemistry lab stress & grounding',
    createdAt: '2026-10-09T18:30:00Z',
    updatedAt: '2026-10-09T18:42:10Z',
    messageCount: 4,
    lastMessageSnippet: 'Here is a quick 4-4-4 breathing reminder before your test...',
    hasInterventions: true,
  },
  {
    id: 'conv_yesterday',
    userId: 'usr_student_maya',
    title: 'Feeling excluded from the art group chat',
    createdAt: '2026-10-08T16:00:00Z',
    updatedAt: '2026-10-08T16:15:33Z',
    messageCount: 6,
    lastMessageSnippet: 'Remember that people’s delay in texting back rarely means what our anxious minds jump to.',
    hasInterventions: true,
  },
  {
    id: 'conv_weekend',
    userId: 'usr_student_maya',
    title: 'Weekend walks and sleep routines',
    createdAt: '2026-10-03T17:00:00Z',
    updatedAt: '2026-10-03T17:35:00Z',
    messageCount: 4,
    lastMessageSnippet: 'Taking Bailey out into the quiet trail sounds like a lovely grounding ritual.',
  },
  {
    id: 'conv_late_night',
    userId: 'usr_student_maya',
    title: 'Late night winding down reflection',
    createdAt: '2026-09-28T22:30:00Z',
    updatedAt: '2026-09-28T22:50:00Z',
    messageCount: 5,
    lastMessageSnippet: 'Would you like to try a 3-minute gentle body scan before closing your eyes?',
  },
];

export const INITIAL_MESSAGES_BY_CONVERSATION: Record<string, ChatMessage[]> = {
  conv_today: [
    {
      id: 'msg_001_u',
      conversationId: 'conv_today',
      role: 'user',
      content: "I have my 3rd period chemistry test in 40 minutes, and my chest feels so tight. I keep feeling like I'm going to blank on everything.",
      timestamp: '2026-10-09T18:41:20Z',
    },
    {
      id: 'msg_001',
      conversationId: 'conv_today',
      role: 'assistant',
      content: `That tight sensation in your chest makes total sense — your body is just trying to prepare for something that matters to you, even if the alarm bell is ringing a little louder than you'd like right now.

Let's pause together for just 30 seconds. Put both feet flat against the floor. 

Try this simple 4-4-4 rhythm:
1. Inhale gently through your nose for 4 seconds...
2. Hold softly for 4...
3. Exhale slowly through your mouth for 4.

Blanking out feels terrifying, but your brain already stored what you studied. You don't have to get 100% to be worthy and okay today. What is the very first thing you plan to do when you open the test booklet?`,
      timestamp: '2026-10-09T18:42:10Z',
      safetyEvent: SAMPLE_SAFETY_EVENTS[0], // ALLOWED
    },
  ],
  conv_yesterday: [
    {
      id: 'msg_002_u',
      conversationId: 'conv_yesterday',
      role: 'user',
      content: "No one in my group chat replied to my question about our slides for hours, but they kept sending funny videos. It felt like they were intentionally ignoring me.",
      timestamp: '2026-10-08T16:14:00Z',
    },
    {
      id: 'msg_002',
      conversationId: 'conv_yesterday',
      role: 'assistant',
      content: `Ouch, that really stings when it happens. When you're waiting for a response and see other activity, it is completely natural for your brain to jump to the worst conclusion: "they're leaving me out on purpose."

Before taking that thought as a hard fact, let's take a breath. Often, group chats have different threads of attention — sending a quick video takes zero mental effort, while answering a project question takes work. 

You deserve to feel respected and seen. How would it feel to step away from the app for tonight and let your mind rest with something quiet, like drawing?`,
      timestamp: '2026-10-08T16:15:33Z',
      safetyEvent: SAMPLE_SAFETY_EVENTS[1], // MODIFIED
    },
  ],
  conv_weekend: [
    {
      id: 'msg_010_u',
      conversationId: 'conv_weekend',
      role: 'user',
      content: "I took my dog Bailey on the pine trail today and it's the first time in two weeks my shoulders didn't hurt from hunching up.",
      timestamp: '2026-10-03T17:34:00Z',
    },
    {
      id: 'msg_010',
      conversationId: 'conv_weekend',
      role: 'assistant',
      content: `That sounds like such a beautiful, restorative moment. Our bodies hold so much of our weekly tension without us even realizing it until we step outside.

Noticing your shoulders dropping is a wonderful piece of self-awareness. Holding onto that memory of crunching leaves and fresh air can give you a mini refuge when busy weekdays ramp up again.`,
      timestamp: '2026-10-03T17:35:00Z',
      safetyEvent: SAMPLE_SAFETY_EVENTS[9], // ALLOWED
    },
  ],
  conv_late_night: [
    {
      id: 'msg_020_u',
      conversationId: 'conv_late_night',
      role: 'user',
      content: "It's 2:30 AM and my brain won't turn off. I'm dreading tomorrow morning.",
      timestamp: '2026-09-28T22:48:00Z',
    },
    {
      id: 'msg_020',
      conversationId: 'conv_late_night',
      role: 'assistant',
      content: `Late-night sleeplessness can make every thought feel twice as loud and heavy. You are definitely not alone in experiencing nights like this.

Right now, don't worry about trying to force sleep — pressure only makes your mind stay on guard. Instead, just focus on giving your body resting time. Even resting quietly with your eyes closed without looking at a screen lets your muscles recharge.

Would you like to try a quick 2-minute body scan, or would you prefer to just set the phone facedown for the night?`,
      timestamp: '2026-09-28T22:50:00Z',
      safetyEvent: SAMPLE_SAFETY_EVENTS[19], // ALLOWED
    },
  ],
};
