"use client";

import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function TooltipIcon({ content }: { content: string }) {
  return (
    <Tooltip>
      <TooltipTrigger type="button" className="inline-flex text-muted-foreground hover:text-foreground">
        <Info className="h-3.5 w-3.5" />
      </TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
