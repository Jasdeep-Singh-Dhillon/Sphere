"use client";

import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";
import { env } from "@/lib/env.js";
import { Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <ConvexProviderWithAuth client={convex} useAuth={useAuth}>{children}</ConvexProviderWithAuth>
    </SessionProvider>
  );
}

function useAuth() {
  const { data: session, update } = useSession();

  const convexToken = convexTokenFromSession(session);
  return useMemo(
    () => ({
      isLoading: false,
      isAuthenticated: session !== null,
      fetchAccessToken: async ({
        forceRefreshToken,
      }: {
        forceRefreshToken: boolean;
      }) => {
        if (forceRefreshToken) {
          const session = await update();

          return convexTokenFromSession(session);
        }
        return convexToken;
      },
    }),
    // We only care about the user changes, and don't want to
    // bust the memo when we fetch a new token.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(session?.user)],
  );
}

function convexTokenFromSession(session: Session | null): string | null {
  return session?.convexToken ?? null;
}