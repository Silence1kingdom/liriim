import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { doc, updateDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  if (!stripeSecret || stripeSecret === 'your_stripe_sk') {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 });
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: '2025-02-24.acacia' });

  try {
    const buf = await req.text();
    const sig = req.headers.get('stripe-signature') || '';

    let event: Stripe.Event;
    if (webhookSecret && webhookSecret !== 'your_stripe_whsec') {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } else {
      event = JSON.parse(buf);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (userId) {
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
      }
    }

    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice;
      const subId = invoice.subscription as string;
      const userSnap = await getDocs(query(collection(db, 'users'), where('stripeSubscriptionId', '==', subId)));
      userSnap.forEach(async (d) => {
        await updateDoc(doc(db, 'users', d.id), { isPremium: false });
      });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
