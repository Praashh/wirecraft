import { Suspense } from "react";
import type { Metadata } from "next";
import { Workbench } from "~/components/ide/Workbench";

export const metadata: Metadata = {
  title: "Workbench",
  description:
    "Open the Wirecraft workbench — describe your hardware project and get firmware, wiring diagrams, parts and assembly steps instantly.",
  openGraph: {
    title: "Workbench | Wirecraft",
    description: "Describe your hardware project and get firmware, wiring, parts and steps instantly.",
  },
};

export default function AppPage() {
  return (
    <Suspense fallback={<div className="p-8 font-mono text-sm text-muted">Warming up the bench…</div>}>
      <Workbench />
    </Suspense>
  );
}
