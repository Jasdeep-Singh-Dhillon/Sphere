import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";
import { auth } from "~/auth";
import { env } from "~/env";

const stripe = new Stripe(env.STRIPE_KEY);

export async function POST(req: NextRequest) {
  const { priceId } = await req.json();
  const data = await auth.api.getSession({
    headers: req.headers,
  });
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: data?.user.email,
      success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("referer")}`,
    });
    console.log(session.customer);
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 },
    );
  }
}
