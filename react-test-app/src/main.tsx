import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import AppShell from "./AppShell";
import "../App.css";
import "bootstrap/dist/css/bootstrap.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl="/"
    >
      <AppShell />
    </ClerkProvider>
  </StrictMode>,
);
