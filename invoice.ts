type Reply = { status: number; body: Record<string, unknown> };

export function invoiceEndpoint(method: string, pathname: string, payload: unknown): Reply {
  if (pathname !== '/invoice') return { status: 404, body: { error: 'Not found' } };
  if (method !== 'POST') return { status: 405, body: { error: 'Use POST /invoice' } };
  const hammerPence = (payload as { hammerPence?: unknown } | null)?.hammerPence;
  if (typeof hammerPence !== 'number' || !Number.isSafeInteger(hammerPence) || hammerPence <= 0 || hammerPence > 100000000000) {
    return { status: 400, body: { error: 'hammerPence must be a positive integer no greater than 100000000000' } };
  }
  const premiumRate = 0.15;
  const totalPence = Math.round(hammerPence / (1 - premiumRate));
  return { status: 200, body: { currency: 'GBP', hammerPence, premiumPence: totalPence - hammerPence, totalPence } };
}
