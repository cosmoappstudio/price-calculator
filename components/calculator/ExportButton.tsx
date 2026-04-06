"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CalculatorInputs, PriceScenarioResult } from "@/types";
import { exportCalculatorToExcel } from "@/utils/export";

export function ExportButton({
  inputs,
  scenarios,
}: {
  inputs: CalculatorInputs;
  scenarios: PriceScenarioResult[];
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className="gap-2"
      onClick={() => exportCalculatorToExcel(inputs, scenarios)}
    >
      <Download className="h-4 w-4" />
      Excel indir
    </Button>
  );
}
