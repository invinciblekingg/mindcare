import crypto from 'crypto';

export function generateSafetyHash(payload: object, previousHash: string | null): string {
  const data = JSON.stringify(payload) + (previousHash || '');
  return crypto.createHash('sha256').update(data).digest('hex');
}
