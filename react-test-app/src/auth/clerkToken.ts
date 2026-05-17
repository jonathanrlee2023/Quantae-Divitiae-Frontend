let clerkTokenGetter: (() => Promise<string | null>) | null = null;

export function setClerkTokenGetter(
  getter: (() => Promise<string | null>) | null,
) {
  clerkTokenGetter = getter;
}

export async function getClerkAuthToken(): Promise<string | null> {
  if (!clerkTokenGetter) return null;
  return clerkTokenGetter();
}
