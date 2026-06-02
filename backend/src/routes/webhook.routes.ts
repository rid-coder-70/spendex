import { Router, Request, Response } from 'express';

const router = Router();

/**
 * POST /api/webhooks/transactions
 * Receives external transaction events from payment providers.
 * Verifies webhook secret before processing.
 */
router.post('/transactions', (req: Request, res: Response) => {
  const webhookSecret = req.headers['x-webhook-secret'];
  const expectedSecret = process.env.WEBHOOK_SECRET;

  // Verify the webhook secret
  if (!webhookSecret || webhookSecret !== expectedSecret) {
    return res.status(401).json({ error: 'Invalid webhook secret' });
  }

  const { event, data } = req.body;

  if (!event || !data) {
    return res.status(400).json({ error: 'Missing event or data field' });
  }

  // Handle different event types
  switch (event) {
    case 'transaction.created':
      console.log('[Webhook] New transaction received:', data);
      // TODO: Save to DB and trigger notification pipeline
      break;

    case 'transaction.updated':
      console.log('[Webhook] Transaction updated:', data);
      // TODO: Update existing transaction record
      break;

    case 'subscription.detected':
      console.log('[Webhook] New subscription detected:', data);
      // TODO: Add to subscriptions table
      break;

    default:
      console.log('[Webhook] Unknown event type:', event);
  }

  // Always respond quickly to the webhook provider
  return res.status(200).json({
    received: true,
    event,
    timestamp: new Date().toISOString(),
  });
});

export default router;
