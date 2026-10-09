import crypto from 'crypto';

export function generateAuditHash(payload: Record<string, unknown>, previousHash: string | null): string {
  const hash = crypto.createHash('sha256');
  
  // Create a deterministic representation of the payload
  // Sort keys to ensure consistent hashing
  const sortedPayload = Object.keys(payload)
    .sort()
    .reduce((acc, key) => {
      acc[key] = payload[key];
      return acc;
    }, {} as Record<string, unknown>);

  const dataString = JSON.stringify({
    payload: sortedPayload,
    previousHash,
  });

  hash.update(dataString);
  return hash.digest('hex');
}
