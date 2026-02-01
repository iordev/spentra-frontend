"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SystemSettingsModal } from "./system-settings-modal";

export function SystemSettingsButton() {
  return (
    <SystemSettingsModal
      triggerButton={
        <Button variant="ghost" size="icon" aria-label="System settings">
          <Settings className="h-4 w-4" />
        </Button>
      }
    />
  );
}
