import { api } from "convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { auth } from "~/auth";
import Header from "~/components/home/header";
import { env } from "~/env";

const stripe = new Stripe(env.STRIPE_KEY);
const convexClient = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  let status = "failed";
  let failedMessage = "Failed to process subscription. Please try again";
  const sessionId = (await searchParams).session_id ?? "";
  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (!session.customer) {
        failedMessage = "Payment failed due to an unknown error";
        return;
      }

      if (session.payment_status === "paid") {
        status = session.status ?? "";
        const data = await auth.api.getSession({
          headers: await headers(),
        });
        if (!data?.user) return redirect("/login");
        convexClient.mutation(api.users.setSubscribed, {
          userid: data.user.id,
          customerid: session.customer.toString(),
        });
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  return (
    <>
      <div className="gradient h-dvh min-h-screen">
        <Header className="row-span-1 w-full" />
        <div className="flex justify-center items-center w-full my-52">
          <h1 className="text-4xl text-center font-extrabold p-12 rounded-2xl shadow-2xl bg-background/60 max-w-md hover:shadow-secondary/70">
            {status === "failed" || !status
              ? failedMessage
              : "Subscription Successful"}
          </h1>
        </div>
      </div>
    </>
  );
}
