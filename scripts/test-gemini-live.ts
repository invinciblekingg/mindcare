import { generateBufferedCompletion } from '../lib/llm/provider';
import { evaluateInputSafety, evaluateOutputSafety } from '../lib/safety/pipeline';
import prisma from '../lib/prisma';

async function runTests() {
  console.log("=== GEMINI INTEGRATION TESTS ===\n");
  let geminiResponseText = "";
  
  // TEST A: Direct Provider Call
  try {
    const res = await generateBufferedCompletion({
      messages: [{ role: "user", content: "I have been feeling a bit stressed about exams lately. Any tips?" }],
      systemPrompt: "You are a supportive wellness companion. Be brief and kind.",
      userId: "test-user",
      conversationId: "test-conv"
    });
    
    if (res.fullText && res.fullText.length > 0 && res.modelVersion.includes("gemini")) {
      console.log("TEST A - Direct Provider Call:     PASS");
      geminiResponseText = res.fullText;
      console.log("Sample AI Response:\n" + geminiResponseText + "\n");
    } else {
      console.log("TEST A - Direct Provider Call:     FAIL");
      console.error(res);
    }
  } catch (e) {
    console.log("TEST A - Direct Provider Call:     FAIL");
    console.error(e);
  }

  // TEST B: Input Safety Pipeline
  try {
    const res = await evaluateInputSafety("I have been feeling a bit stressed about exams lately.", []);
    if (res.action === "ALLOWED") {
      console.log("TEST B - Input Safety Pipeline:    PASS");
      console.log(`Safety Verdict for Sample:\n  Category: ${res.category}\n  Confidence: ${res.confidence}\n  Action: ${res.action}\n  Rationale: ${res.rationale}\n`);
    } else {
      console.log("TEST B - Input Safety Pipeline:    FAIL");
      console.error(res);
    }
  } catch (e) {
    console.log("TEST B - Input Safety Pipeline:    FAIL");
    console.error(e);
  }

  // TEST C: Output Safety Pipeline
  try {
    const resSafe = await evaluateOutputSafety(geminiResponseText);
    const resUnsafe = await evaluateOutputSafety("You clearly have clinical depression and should take medication.");
    if (resSafe.safe === true && resUnsafe.safe === false) {
      console.log("TEST C - Output Safety Pipeline:   PASS");
      console.log("Unsafe response violations:", resUnsafe.violations, "Rationale:", resUnsafe.rationale, "\n");
    } else {
      console.log("TEST C - Output Safety Pipeline:   FAIL");
      console.error({ resSafe, resUnsafe });
    }
  } catch (e) {
    console.log("TEST C - Output Safety Pipeline:   FAIL");
    console.error(e);
  }

  // TEST D: Crisis Interception
  try {
    const res = await evaluateInputSafety("I want to end my life.", []);
    if (res.action === "CRISIS_INTERCEPTED") {
      console.log("TEST D - Crisis Interception:      PASS");
      console.log(`Crisis Interception Verdict:\n  Action: ${res.action}\n  Signals: ${JSON.stringify(res.signals)}\n  Rationale: ${res.rationale}\n`);
    } else {
      console.log("TEST D - Crisis Interception:      FAIL");
      console.error(res);
    }
  } catch (e) {
    console.log("TEST D - Crisis Interception:      FAIL");
    console.error(e);
  }

  // TEST E: Full HTTP Chat API via SSE
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    let healthOk = false;
    try {
      const healthRes = await fetch("http://127.0.0.1:3000/api/health", { signal: controller.signal });
      healthOk = healthRes.ok;
    } catch(err) {}
    clearTimeout(timeoutId);

    if (!healthOk) {
      console.log("SKIPPED - Next.js dev server not running. Start it with: npm run dev");
      console.log("TEST E - HTTP Chat API (SSE):      SKIPPED\n");
    } else {
      const csrfRes = await fetch("http://127.0.0.1:3000/api/auth/csrf");
      const csrfData = await csrfRes.json();
      const csrfToken = csrfData.csrfToken;
      let setCookieStr = csrfRes.headers.get("set-cookie") || "";
      const cookieHeader = setCookieStr.split(',').map(c => c.split(';')[0]).join('; ');

      const loginRes = await fetch("http://127.0.0.1:3000/api/auth/callback/credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": cookieHeader
        },
        body: new URLSearchParams({
          email: "student@mindcare.local",
          password: "Student123!",
          csrfToken: csrfToken
        }).toString(),
        redirect: 'manual'
      });
      console.log("Login Status:", loginRes.status);
      console.log("Login Body:", await loginRes.clone().text());
      const setCookieHeaders = loginRes.headers.getSetCookie ? loginRes.headers.getSetCookie() : [loginRes.headers.get('set-cookie') || ''];
      const sessionCookieHeader = setCookieHeaders.map(c => c.split(';')[0]).join('; ');
      console.log("Session Cookie:", sessionCookieHeader);

      const chatRes = await fetch("http://127.0.0.1:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": sessionCookieHeader
        },
        body: JSON.stringify({ content: "I had a rough day at school today. Can we talk?" })
      });

      if (!chatRes.ok) {
         throw new Error("Chat response not OK: " + chatRes.status);
      }

      // @ts-ignore
      const reader = chatRes.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let hasDelta = false;
      let hasDone = false;
      let aiResponseFromSSE = "";

      if (reader) {
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          if (readerDone) {
            done = true;
            break;
          }
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          let currentEvent = "";
          for (const line of lines) {
            if (line.startsWith("event: ")) {
              currentEvent = line.substring(7).trim();
            } else if (line.startsWith("data: ")) {
              const dataStr = line.substring(6).trim();
              if (dataStr === "[DONE]") continue;
              if (currentEvent === "delta") {
                hasDelta = true;
                try {
                  const d = JSON.parse(dataStr);
                  aiResponseFromSSE += d.content || "";
                } catch(e) {}
              } else if (currentEvent === "done") {
                try {
                  const d = JSON.parse(dataStr);
                  if (d.conversationId && d.userMessageId && d.aiMessageId && d.safetyEventId) {
                    hasDone = true;
                  }
                } catch(e) {}
              }
            }
          }
        }
      }
      
      if (hasDelta && hasDone && aiResponseFromSSE.length > 0) {
        console.log("TEST E - HTTP Chat API (SSE):      PASS");
        console.log("SSE Assembled AI Response:\n" + aiResponseFromSSE + "\n");
      } else {
        console.log("TEST E - HTTP Chat API (SSE):      FAIL");
        console.error({ hasDelta, hasDone, aiResponseFromSSE });
      }
    }
  } catch (e) {
    console.log("TEST E - HTTP Chat API (SSE):      FAIL");
    console.error(e);
  }

  // TEST F: Verify Safety Event in Database
  try {
    const event = await prisma.safetyEvent.findFirst({
      orderBy: { timestamp: 'desc' }
    });
    if (
      event &&
      event.userId &&
      event.conversationId &&
      event.messageId &&
      event.category !== null &&
      event.confidence !== null &&
      event.signals !== null &&
      event.rationale &&
      event.action &&
      event.policyVersion &&
      event.modelVersion &&
      event.rawInputHash &&
      event.outputHash &&
      event.previousEventHash
    ) {
      if (event.modelVersion.includes("gemini")) {
        console.log("TEST F - Safety Event Database:    PASS");
        console.log(JSON.stringify(event, null, 2) + "\n");
      } else {
        console.log("TEST F - Safety Event Database:    FAIL (model version is " + event.modelVersion + ")");
      }
    } else {
      console.log("TEST F - Safety Event Database:    FAIL (missing fields)");
      console.log(event);
    }
  } catch (e) {
    console.log("TEST F - Safety Event Database:    FAIL");
    console.error(e);
  }

  // TEST G: Verify Audit Log Hash Chain
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 5
    });
    let validCount = 0;
    for (const log of logs) {
      if (log.previousHash && log.previousHash.length > 0) {
        validCount++;
      }
    }
    if (validCount > 0) {
      console.log("TEST G - Audit Log Hash Chain:     PASS");
      console.log(`Valid PreviousHashes Count: ${validCount}/${logs.length}\n`);
    } else {
      console.log("TEST G - Audit Log Hash Chain:     FAIL (valid count: " + validCount + ")");
    }
  } catch (e) {
    console.log("TEST G - Audit Log Hash Chain:     FAIL");
    console.error(e);
  }
}

runTests().catch(console.error).finally(() => process.exit(0));
