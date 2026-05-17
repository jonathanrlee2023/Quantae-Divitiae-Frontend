import { useAuth } from "@clerk/react";
import { ReactNode, useEffect, useState } from "react";
import { setClerkTokenGetter } from "../../auth/clerkToken";
import { apiFetch } from "../../api/client";

export function ClerkTokenBridge({ children }: { children: ReactNode }) {
  const { getToken, isSignedIn } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      if (!isSignedIn) {
        setClerkTokenGetter(null);
        if (!cancelled) setIsReady(false);
        return;
      }

      setClerkTokenGetter(() => getToken());
      let token: string | null = null;
      for (let i = 0; i < 15 && !cancelled; i += 1) {
        token = await getToken();
        if (token) break;
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
      if (!token) {
        if (!cancelled) setIsReady(false);
        return;
      }

      try {
        await apiFetch("/me", { method: "GET" });
      } catch (err) {
        console.error("Failed to bootstrap /me", err);
      }

      if (!cancelled) setIsReady(true);
    };

    void bootstrap();
    return () => {
      cancelled = true;
      setClerkTokenGetter(null);
      setIsReady(false);
    };
  }, [getToken, isSignedIn]);

  if (!isSignedIn || !isReady) return null;
  return <>{children}</>;
}
