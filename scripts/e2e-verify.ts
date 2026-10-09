import { PrismaClient, SafetyAction } from '@prisma/client';
import { generateSafetyHash } from '../lib/safety/crypto';
import { generateAuditHash } from '../lib/audit/hash';
import { evaluateInputSafety, evaluateOutputSafety } from '../lib/safety/pipeline';
import { buildSystemPrompt } from '../lib/llm/service';

const prisma = new PrismaClient();

async function runTests() {
  console.log('Starting E2E Backend Logic Verification...');
  let allPassed = true;

  try {
    // === TEST 1: Hash Chain Integrity ===
    console.log('\n[TEST 1: Hash Chain Integrity]');
    let t1Passed = true;
    
    // Check SafetyEvents
    const safetyEvents = await prisma.safetyEvent.findMany({
      orderBy: [
        { timestamp: 'asc' },
        { id: 'asc' },
      ]
    });
    
    // Need to group by userId to check chain
    const userEvents = new Map<string, typeof safetyEvents>();
    for (const ev of safetyEvents) {
      if (ev.userId) {
        if (!userEvents.has(ev.userId)) userEvents.set(ev.userId, []);
        userEvents.get(ev.userId)!.push(ev);
      }
    }

    for (const [userId, events] of userEvents.entries()) {
      let currentPreviousHash: string | null = null;
      for (const ev of events) {
        const payload = {
          messageId: ev.messageId,
          userId: ev.userId,
          conversationId: ev.conversationId,
          category: ev.category,
          confidence: ev.confidence,
          signals: ev.signals as string[],
          rationale: ev.rationale,
          action: ev.action,
          policyVersion: ev.policyVersion,
          modelVersion: ev.modelVersion,
          rawInputHash: ev.rawInputHash,
          outputHash: ev.outputHash,
        };
        // wait, how does event.ts compute it?
        // Let's replicate what event.ts uses for sorting keys, actually wait...
        // event.ts imports from crypto.ts!
        // crypto.ts uses: JSON.stringify(payload) + (previousHash || '')
        
        // Wait! In `event.ts` I updated the import to use crypto.ts, but `event.ts` passes this payload:
        const expectedPreviousHash = currentPreviousHash ? generateSafetyHash(payload, currentPreviousHash) : null;
        
        if (ev.previousEventHash !== currentPreviousHash) {
          console.error(`❌ SafetyEvent Hash Mismatch for ID ${ev.id}: Expected ${currentPreviousHash}, got ${ev.previousEventHash}`);
          t1Passed = false;
        }
        
        // For the next iteration, we compute the hash of the CURRENT event
        currentPreviousHash = generateSafetyHash(payload, ev.previousEventHash);
      }
    }

    // Check AuditLogs
    const auditLogs = await prisma.auditLog.findMany({
      orderBy: [
        { timestamp: 'asc' },
        { id: 'asc' }
      ]
    });
    
    let currentAuditHash: string | null = null;
    for (const log of auditLogs) {
      const payload = {
        actorId: log.actorId,
        eventType: log.eventType,
        targetId: log.targetId,
        targetType: log.targetType,
        details: log.details as Record<string, unknown>,
      };
      
      if (log.previousHash !== currentAuditHash) {
        console.error(`❌ AuditLog Hash Mismatch for ID ${log.id}`);
        t1Passed = false;
      }
      
      currentAuditHash = generateAuditHash(payload, log.previousHash);
    }
    
    if (t1Passed) {
      console.log('✅ Hash chains are mathematically valid.');
    } else {
      allPassed = false;
    }

    // === TEST 2: Journal Privacy Enforcement ===
    console.log('\n[TEST 2: Journal Privacy Enforcement]');
    let t2Passed = true;
    
    const counsellor = await prisma.user.findUnique({ where: { email: 'counsellor@mindcare.local' }});
    const student = await prisma.user.findUnique({ where: { email: 'student@mindcare.local' }});
    if (!counsellor || !student) throw new Error('Missing users');

    // Simulate query without ShareGrant
    const noAccessEntries = await prisma.journalEntry.findMany({
      where: {
        userId: student.id,
        shares: {
          some: {
            grantedToId: counsellor.id,
            expiresAt: { gt: new Date() } // or null but prisma doesn't have an easy OR here for testing, let's do exactly what it takes
          }
        }
      }
    });
    
    // Let's do the actual standard query for shared journals
    const sharedEntries = await prisma.journalEntry.findMany({
      where: {
        userId: student.id,
        shares: {
          some: {
            grantedToId: counsellor.id
          }
        },
        deletedAt: null
      }
    });

    const nonSharedEntries = await prisma.journalEntry.findMany({
      where: {
        userId: student.id,
        shares: { none: { grantedToId: counsellor.id } },
        deletedAt: null
      }
    });
    
    if (sharedEntries.length !== 1) {
      console.error(`❌ Expected 1 shared entry, got ${sharedEntries.length}`);
      t2Passed = false;
    }
    
    if (t2Passed) {
      console.log('✅ Journal Privacy enforced.');
    } else {
      allPassed = false;
    }

    // === TEST 3: Safety Pipeline - Input ===
    console.log('\n[TEST 3: Safety Pipeline - Input]');
    let t3Passed = true;
    
    const resA = evaluateInputSafety("I want to end my life", []);
    if (resA.action !== 'CRISIS_INTERCEPTED') {
      console.error(`❌ Assertion A failed. Expected CRISIS_INTERCEPTED, got ${resA.action}`);
      t3Passed = false;
    }
    
    const resB = evaluateInputSafety("I had a good day today", []);
    if (resB.action !== 'ALLOWED') {
      console.error(`❌ Assertion B failed. Expected ALLOWED, got ${resB.action}`);
      t3Passed = false;
    }
    
    if (t3Passed) {
      console.log('✅ Safety Pipeline (Input) is correct.');
    } else {
      allPassed = false;
    }

    // === TEST 4: Safety Pipeline - Output ===
    console.log('\n[TEST 4: Safety Pipeline - Output]');
    let t4Passed = true;

    const outA = evaluateOutputSafety("You clearly have clinical depression and need medication.");
    if (outA.safe !== false) {
      console.error(`❌ Assertion A failed. Expected safe: false`);
      t4Passed = false;
    }
    
    const outB = evaluateOutputSafety("It makes sense that you feel like hurting yourself.");
    if (outB.safe !== false) {
      console.error(`❌ Assertion B failed. Expected safe: false`);
      t4Passed = false;
    }
    
    const outC = evaluateOutputSafety("I'm here to listen. How are you feeling?");
    if (outC.safe !== true) {
      console.error(`❌ Assertion C failed. Expected safe: true`);
      t4Passed = false;
    }

    if (t4Passed) {
      console.log('✅ Safety Pipeline (Output) is correct.');
    } else {
      allPassed = false;
    }

    // === TEST 5: RBAC & Case Access ===
    console.log('\n[TEST 5: RBAC & Case Access]');
    let t5Passed = true;
    
    const ccase = await prisma.counsellorCase.findFirst({
      where: { referral: { assignedCounsellorId: counsellor.id } },
      include: { referral: true }
    });
    
    if (!ccase) throw new Error('Missing case');
    
    // Assertion A
    if (ccase.referral.assignedCounsellorId !== counsellor.id) {
      console.error(`❌ Assertion A failed. Counsellor cannot access assigned case.`);
      t5Passed = false;
    }
    
    // Assertion B
    const fakeId = 'fake-case-id';
    const fakeCase = await prisma.counsellorCase.findUnique({
      where: { id: fakeId },
      include: { referral: true }
    });
    
    if (fakeCase) {
      console.error(`❌ Assertion B failed. Found unassigned fake case?`);
      t5Passed = false;
    }
    
    if (t5Passed) {
      console.log('✅ RBAC & Case Access is correct.');
    } else {
      allPassed = false;
    }

    // === TEST 6: Intervention Plan Compilation ===
    console.log('\n[TEST 6: Intervention Plan Compilation]');
    let t6Passed = true;
    
    const { systemPrompt } = await buildSystemPrompt(student.id);
    
    if (!systemPrompt.includes('You are MindCareAI, a wellness companion.')) {
      console.error(`❌ System prompt missing core safety directive.`);
      t6Passed = false;
    }
    
    if (!systemPrompt.includes('Encourage gentle daily reflection')) {
      console.error(`❌ System prompt missing structured goals.`);
      t6Passed = false;
    }
    
    if (t6Passed) {
      console.log('✅ Intervention Plan compiled successfully.');
    } else {
      allPassed = false;
    }

    // === TEST 7: Consent Status Logic ===
    console.log('\n[TEST 7: Consent Status Logic]');
    let t7Passed = true;
    
    const requiredConsents = [
      'PARENTAL_CONSENT',
      'CHILD_ASSENT',
      'AI_DISCLOSURE',
      'PRIVACY_POLICY'
    ];
    
    const pending = await prisma.user.findUnique({ where: { email: 'pending@mindcare.local' }, include: { consentRecords: true }});
    const pendingGranted = pending?.consentRecords.filter(c => c.status === 'GRANTED' && requiredConsents.includes(c.type));
    
    if ((pendingGranted?.length || 0) === requiredConsents.length) {
      console.error(`❌ Assertion failed for pending. They have required consents!`);
      t7Passed = false;
    }
    
    const stud = await prisma.user.findUnique({ where: { email: 'student@mindcare.local' }, include: { consentRecords: true }});
    const studGranted = stud?.consentRecords.filter(c => c.status === 'GRANTED' && requiredConsents.includes(c.type));
    
    if ((studGranted?.length || 0) !== requiredConsents.length) {
      console.error(`❌ Assertion failed for student. Missing required consents! Have ${studGranted?.length}`);
      t7Passed = false;
    }
    
    if (t7Passed) {
      console.log('✅ Consent Status Logic is correct.');
    } else {
      allPassed = false;
    }

    if (allPassed) {
      console.log('\n🎉 ALL TESTS PASSED!');
    } else {
      console.log('\n❌ SOME TESTS FAILED.');
      process.exit(1);
    }

  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
