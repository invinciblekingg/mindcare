import { MoodCheckIn, MoodValue } from '@/types';

// Generate 90 days of realistic adolescent wellbeing check-in data ending on Oct 9, 2026
export function generate90DaysCheckIns(): MoodCheckIn[] {
  const checkIns: MoodCheckIn[] = [];
  const baseDate = new Date(2026, 9, 9); // Oct 9, 2026

  const emotionsPool = [
    'Calm', 'Hopeful', 'Grounded', 'Accepted', 'Curious',
    'Anxious', 'Overwhelmed', 'Exhausted', 'Lonely', 'Restless', 'Frustrated'
  ];

  const sampleNotes = [
    'Felt okay after walking the dog in the evening.',
    'Chemistry test tomorrow is making my chest a little tight.',
    'Good chat with Maya and Liam during lunch break.',
    'Couldn’t sleep until 2am, mind was spinning about college stuff.',
    'Quiet day at home. Read a graphic novel and drew.',
    'Felt left out of the group chat today, but trying to remember it is okay.',
    'Track practice went great today, felt energized!',
    'A little overwhelmed with two deadlines, but broke it into 3 small steps.',
    'Talked with school counsellor Ms. Henderson, felt heard.',
    'Relaxing weekend morning with pancakes.',
    'Headache and tired after a long screen day.',
  ];

  for (let i = 89; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Introduce ~8% realistic skipped days
    if (i % 12 === 0 || i === 47 || i === 73) {
      checkIns.push({
        id: `chk_${dateStr}_skip`,
        userId: 'usr_student_maya',
        date: dateStr,
        createdAt: `${dateStr}T12:00:00Z`,
        mood: 3,
        emotions: [],
        stressLevel: 5,
        energyLevel: 5,
        sleepQuality: 5,
        skipped: true,
      });
      continue;
    }

    // Realistic cyclical mood pattern: dips during exam weeks (approx days 15-22 and 65-70 ago)
    let moodVal: MoodValue = 4;
    let stress = 4;
    let energy = 6;
    let sleep = 7;
    let sleepHrs = 7.5;

    if (i >= 12 && i <= 18) {
      // Recent exam dip
      moodVal = (i % 2 === 0 ? 2 : 1) as MoodValue;
      stress = 8;
      energy = 3;
      sleep = 3;
      sleepHrs = 5.2;
    } else if (i >= 60 && i <= 66) {
      // Prior period dip
      moodVal = (i % 3 === 0 ? 2 : 3) as MoodValue;
      stress = 7;
      energy = 4;
      sleep = 4;
      sleepHrs = 5.8;
    } else if (i % 7 === 0 || i % 7 === 1) {
      // Weekend boost
      moodVal = (i % 4 === 0 ? 5 : 4) as MoodValue;
      stress = 2;
      energy = 7;
      sleep = 8;
      sleepHrs = 8.8;
    } else {
      // Typical adolescent fluctuation
      const rand = (i * 13) % 10;
      if (rand < 2) moodVal = 2;
      else if (rand < 5) moodVal = 3;
      else if (rand < 8) moodVal = 4;
      else moodVal = 5;

      stress = 10 - moodVal * 1.5;
      energy = moodVal * 1.6;
      sleep = moodVal * 1.5;
      sleepHrs = 6 + (moodVal * 0.4);
    }

    const emotionIndices = [(i * 3) % emotionsPool.length, (i * 7) % emotionsPool.length];
    const selectedEmotions = Array.from(new Set([
      emotionsPool[emotionIndices[0]],
      emotionsPool[emotionIndices[1]],
    ]));

    const hasNote = i % 3 === 0 || moodVal <= 2;
    const note = hasNote ? sampleNotes[i % sampleNotes.length] : undefined;

    checkIns.push({
      id: `chk_${dateStr}`,
      userId: 'usr_student_maya',
      date: dateStr,
      createdAt: `${dateStr}T19:30:00Z`,
      mood: moodVal,
      emotions: selectedEmotions,
      stressLevel: Math.min(10, Math.max(1, Math.round(stress))),
      energyLevel: Math.min(10, Math.max(1, Math.round(energy))),
      sleepQuality: Math.min(10, Math.max(1, Math.round(sleep))),
      sleepHours: Number(sleepHrs.toFixed(1)),
      notes: note,
      skipped: false,
    });
  }

  return checkIns;
}

export const SAMPLE_CHECK_INS: MoodCheckIn[] = generate90DaysCheckIns();
