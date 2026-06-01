import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const stripeSecret = process.env.STRIPE_SECRET_KEY;

export async function GET(req: Request) {
  if (!stripeSecret || stripeSecret === 'your_stripe_sk') {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  try {
    const stripe = new Stripe(stripeSecret, { apiVersion: '2025-02-24.acacia' });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const userId = session.metadata?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'No userId in session' }, { status: 400 });
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    await updateDoc(doc(db, 'users', userId), {
      isPremium: true,
      premiumExpiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
    });

    await setDoc(doc(db, 'payments', session.id), {
      userId,
      amount: session.amount_total || 0,
      currency: session.currency || 'usd',
      status: 'completed',
      createdAt: Date.now(),
      stripeSessionId: session.id,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Verify session error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
