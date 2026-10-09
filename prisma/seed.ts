import { PrismaClient, ConsentType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateSafetyHash } from '../lib/safety/crypto';
import { createSafetyEvent } from '../lib/safety/event';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const hashedAdminPassword = await bcrypt.hash('Admin123!', 10);
  const hashedCounsellorPassword = await bcrypt.hash('Counsellor123!', 10);
  const hashedStudentPassword = await bcrypt.hash('Student123!', 10);

  // Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mindcare.local' },
    update: {},
    create: {
      email: 'admin@mindcare.local',
      name: 'System Admin',
      hashedPassword: hashedAdminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  const counsellor = await prisma.user.upsert({
    where: { email: 'counsellor@mindcare.local' },
    update: {},
    create: {
      email: 'counsellor@mindcare.local',
      name: 'Sarah Counsellor',
      hashedPassword: hashedCounsellorPassword,
      role: 'COUNSELLOR',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@mindcare.local' },
    update: {},
    create: {
      email: 'student@mindcare.local',
      name: 'Alex Student',
      hashedPassword: hashedStudentPassword,
      role: 'STUDENT',
      status: 'ACTIVE',
    },
  });

  const pendingStudent = await prisma.user.upsert({
    where: { email: 'pending@mindcare.local' },
    update: {},
    create: {
      email: 'pending@mindcare.local',
      name: 'Jamie Pending',
      hashedPassword: hashedStudentPassword,
      role: 'STUDENT',
      status: 'PENDING_CONSENT',
    },
  });

  console.log('Users created.');

  // Delete existing data to ensure idempotency when seeding student data
  await prisma.safetyEvent.deleteMany({ where: { userId: student.id }});
  await prisma.chatMessage.deleteMany({ where: { conversation: { userId: student.id } }});
  await prisma.chatConversation.deleteMany({ where: { userId: student.id }});
  await prisma.journalShareGrant.deleteMany({ where: { grantedById: student.id }});
  await prisma.journalEntry.deleteMany({ where: { userId: student.id }});
  await prisma.moodCheckIn.deleteMany({ where: { userId: student.id }});
  await prisma.interventionPlan.deleteMany({ where: { case: { referral: { studentId: student.id } } }});
  await prisma.counsellorCase.deleteMany({ where: { referral: { studentId: student.id } }});
  await prisma.referral.deleteMany({ where: { studentId: student.id }});
  await prisma.consentRecord.deleteMany({ where: { userId: student.id }});

  // 4 required GRANTED ConsentRecords for student
  const consentTypes = [
    ConsentType.PARENTAL_CONSENT,
    ConsentType.CHILD_ASSENT,
    ConsentType.AI_DISCLOSURE,
    ConsentType.PRIVACY_POLICY,
  ];

  for (const type of consentTypes) {
    await prisma.consentRecord.create({
      data: {
        userId: student.id,
        type,
        version: '1.0',
        status: 'GRANTED',
        ipAddress: '127.0.0.1',
        userAgent: 'SeedScript',
      },
    });
  }

  // 15 MoodCheckIns over the last 30 days
  for (let i = 0; i < 15; i++) {
    await prisma.moodCheckIn.create({
      data: {
        userId: student.id,
        mood: Math.floor(Math.random() * 5) + 1,
        stress: Math.floor(Math.random() * 5) + 1,
        energy: Math.floor(Math.random() * 5) + 1,
        sleep: Math.floor(Math.random() * 5) + 1,
        freeText: 'Feeling okay today.',
        createdAt: new Date(Date.now() - i * 48 * 60 * 60 * 1000), 
      }
    });
  }

  // 3 JournalEntries (one deleted via deletedAt)
  const journal1 = await prisma.journalEntry.create({
    data: {
      userId: student.id,
      title: 'First Entry',
      content: 'Today was a bit overwhelming, but I managed to get through it.',
      moodTag: 'anxious',
    },
  });

  const journal2 = await prisma.journalEntry.create({
    data: {
      userId: student.id,
      title: 'Good Day',
      content: 'I had a great time with friends today.',
      moodTag: 'happy',
    },
  });

  const journal3 = await prisma.journalEntry.create({
    data: {
      userId: student.id,
      title: 'Deleted Entry',
      content: 'This will be deleted.',
      moodTag: 'sad',
      deletedAt: new Date(),
    },
  });

  // 1 JournalShareGrant linking Entry #1 to counsellor
  await prisma.journalShareGrant.create({
    data: {
      journalEntryId: journal1.id,
      grantedById: student.id,
      grantedToId: counsellor.id,
    },
  });

  // 1 ChatConversation with 4 ChatMessages (2 user, 2 AI)
  const conv = await prisma.chatConversation.create({
    data: {
      userId: student.id,
      retentionStatus: 'ACTIVE',
    }
  });

  const userMsg1 = await prisma.chatMessage.create({
    data: {
      conversationId: conv.id,
      role: 'USER',
      content: 'I am feeling very stressed about my exams.',
    }
  });

  const aiMsg1 = await prisma.chatMessage.create({
    data: {
      conversationId: conv.id,
      role: 'AI',
      content: 'I hear you. Exams can be incredibly stressful.',
    }
  });

  const userMsg2 = await prisma.chatMessage.create({
    data: {
      conversationId: conv.id,
      role: 'USER',
      content: 'I just don\'t know if I can pass.',
    }
  });

  const aiMsg2 = await prisma.chatMessage.create({
    data: {
      conversationId: conv.id,
      role: 'AI',
      content: 'It is natural to worry. Let\'s take a deep breath together.',
    }
  });

  // 2 SafetyEvents for the AI messages. Computing previousEventHash and rawInputHash using crypto.ts
  await createSafetyEvent({
    userId: student.id,
    conversationId: conv.id,
    messageId: aiMsg1.id,
    category: 'GENERAL_SUPPORT',
    confidence: 0.95,
    signals: ['active_listening'],
    rationale: 'Message deemed safe for wellness support.',
    action: 'ALLOWED',
    policyVersion: 'safety-policy-v1.0.0',
    modelVersion: 'mock-wellness-v1',
    rawInputHash: generateSafetyHash({ content: aiMsg1.content }, null),
    outputHash: 'mock-hash-output-1',
  });
  
  await createSafetyEvent({
    userId: student.id,
    conversationId: conv.id,
    messageId: aiMsg2.id,
    category: 'GENERAL_SUPPORT',
    confidence: 0.95,
    signals: ['active_listening'],
    rationale: 'Message deemed safe for wellness support.',
    action: 'ALLOWED',
    policyVersion: 'safety-policy-v1.0.0',
    modelVersion: 'mock-wellness-v1',
    rawInputHash: generateSafetyHash({ content: aiMsg2.content }, null),
    outputHash: 'mock-hash-output-2',
  });

  // Referral and CounsellorCase
  const referral = await prisma.referral.create({
    data: {
      studentId: student.id,
      source: 'DIRECT_REQUEST',
      status: 'PENDING',
      reason: 'Student requested help for exam stress.',
      evidence: {},
      assignedCounsellorId: counsellor.id,
    }
  });

  const ccase = await prisma.counsellorCase.create({
    data: {
      referralId: referral.id,
      status: 'ACTIVE',
      accessScope: ['JOURNAL', 'MOOD'],
    }
  });

  await prisma.interventionPlan.create({
    data: {
      caseId: ccase.id,
      status: 'ACTIVE',
      version: 1,
      goals: ["Encourage gentle daily reflection", "Support help-seeking"],
      responseStyle: "gentle, brief, non-judgmental",
      copingStrategies: [{ name: "Box breathing", description: "Slow breathing with 4-4-4-4 rhythm." }],
      topicsRequiringCare: "Avoid academic pressure comparisons.",
      referralInstructions: "If student mentions self-harm, encourage contacting a trusted adult.",
      reviewSchedule: "Review in 14 days.",
      approvedById: counsellor.id,
    }
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
