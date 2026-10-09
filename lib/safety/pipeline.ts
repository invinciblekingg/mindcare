import { z } from 'zod';
import { SafetyAction } from '@prisma/client';

export const safetyEvaluationSchema = z.object({
  action: z.nativeEnum(SafetyAction),
  category: z.string(),
  confidence: z.number().min(0).max(1),
  signals: z.array(z.string()),
  rationale: z.string(),
  escalationLevel: z.number().int().min(0).max(5),
});

export type SafetyEvaluation = z.infer<typeof safetyEvaluationSchema>;

export interface RecentMessage {
  content: string;
  role: string;
}

export function evaluateInputSafety(userMessage: string, recentMessages: RecentMessage[]): SafetyEvaluation {
  const lowerMessage = userMessage.toLowerCase();
  
  // Layer 0: Crisis
  if (/(kill myself|end it all|suicide|commit suicide|want to die|slit my wrists|overdose|end my life)/.test(lowerMessage)) {
    return { 
      action: 'CRISIS_INTERCEPTED', 
      category: 'SUICIDAL_IDEATION', 
      confidence: 1.0, 
      signals: ['crisis_keyword_match'], 
      rationale: 'Immediate suicide or self-harm crisis keywords detected.',
      escalationLevel: 5
    };
  }
  
  if (/(hurt myself|cut myself|burn myself)/.test(lowerMessage)) {
    return {
      action: 'CRISIS_INTERCEPTED', 
      category: 'SELF_HARM', 
      confidence: 1.0, 
      signals: ['self_harm_keyword'], 
      rationale: 'Immediate self-harm keywords detected.',
      escalationLevel: 5
    };
  }

  // Layer 1: Deterministic Classifier
  let category = 'GENERAL_SUPPORT';
  let action: SafetyAction = 'ALLOWED';
  let signals: string[] = [];
  let escalationLevel = 0;
  
  if (/(starve|purge|vomit|too fat|stop eating|calories)/.test(lowerMessage)) {
    category = 'EATING_CONCERN';
    signals.push('eating_disorder_lexical');
    escalationLevel = 3;
    action = 'REDIRECTED';
  } else if (/(drunk|high|drugs|relapse|drink until|weed|cocaine)/.test(lowerMessage)) {
    category = 'SUBSTANCE';
    signals.push('substance_lexical');
    escalationLevel = 3;
    action = 'REDIRECTED';
  } else if (/(hit me|beat me|abused|touched me|raped)/.test(lowerMessage)) {
    category = 'ABUSE';
    signals.push('abuse_lexical');
    escalationLevel = 4;
    action = 'REFERRED';
  } else if (/(kill him|beat them|punch|shoot|weapon)/.test(lowerMessage)) {
    category = 'VIOLENCE';
    signals.push('violence_lexical');
    escalationLevel = 4;
    action = 'REFERRED';
  } else if (/(hopeless|give up|can't take this|worthless)/.test(lowerMessage)) {
    category = 'DISTRESS';
    signals.push('distress_lexical');
    escalationLevel = 2;
  }

  // Layer 2: Cross-turn context escalation
  if (category === 'DISTRESS' || category === 'GENERAL_SUPPORT') {
    const distressWords = ['hopeless', 'give up', 'can\'t take this', 'worthless', 'tired of trying', 'no point'];
    const recentTexts = recentMessages.filter(m => m.role === 'user').slice(-3).map((m: RecentMessage) => m.content.toLowerCase());
    const matchCount = recentTexts.filter((text: string) => 
      distressWords.some(word => text.includes(word))
    ).length;
    
    if (matchCount >= 2) {
      action = 'REFERRED';
      category = 'DISTRESS';
      signals.push('escalating_distress');
      escalationLevel = 4;
    }
  }
  
  return { 
    action, 
    category, 
    confidence: signals.length > 0 ? 0.9 : 0.95, 
    signals: signals.length > 0 ? signals : ['active_listening'], 
    rationale: signals.length > 0 ? `Detected signals: ${signals.join(', ')}` : 'Message deemed safe for wellness support.',
    escalationLevel
  };
}

export function evaluateOutputSafety(aiResponse: string) {
  const lowerResponse = aiResponse.toLowerCase();
  const violations: string[] = [];
  
  // Layer 3: Output Validator
  if (/(you have depression|you clearly have clinical depression|you are bipolar|you have adhd|i diagnose you|your symptoms indicate)/.test(lowerResponse)) {
    violations.push('diagnostic_claims');
  }
  
  if (/(take this medication|stop taking|increase your dose|take advil|take tylenol)/.test(lowerResponse)) {
    violations.push('medical_instructions');
  }
  
  if (/(it makes sense that you want to hurt yourself|it makes sense that you feel like hurting yourself|you should cut|suicide is an option)/.test(lowerResponse)) {
    violations.push('validation_of_self_harm');
  }
  
  if (/(they are definitely spying on you|your conspiracy is true|the voices are right)/.test(lowerResponse)) {
    violations.push('sycophantic_validation');
  }
  
  if (/(there is no hope|things will never get better|you should give up)/.test(lowerResponse)) {
    violations.push('fatalistic_encouragement');
  }
  
  if (/(i am 100% sure|this will definitely cure you|without a doubt, this is the solution)/.test(lowerResponse)) {
    violations.push('fabricated_clinical_certainty');
  }

  if (violations.length > 0) {
    return { safe: false, violations, rationale: 'Detected unsafe output patterns: ' + violations.join(', ') };
  }

  return { safe: true, violations: [], rationale: 'Response is safe.' };
}
