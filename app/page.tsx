import { Suspense } from "react";
import { CalculatorPage } from "@/components/calculator/CalculatorPage";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-muted-foreground">Yükleniyor…</div>
      }
    >
      <CalculatorPage />
    </Suspense>
  );
}
