import { api } from "convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "~/auth";
import { env } from "~/env";

const stripe = new Stripe(env.STRIPE_KEY);
const convexClient = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session.customer)
      return NextResponse.json(
        { error: "Payment failed due to an unknown error" },
        { status: 400 },
      );
    if (session.payment_status === "paid") {
      const data = await auth.api.getSession({
        headers: req.headers,
      });
      if (!data?.user) return NextResponse.redirect("/login");
      convexClient.mutation(api.users.setSubscribed, {
        userid: data.user.id,
        customerid: session.customer.toString(),
      });
      return NextResponse.json({ session });
    }
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
