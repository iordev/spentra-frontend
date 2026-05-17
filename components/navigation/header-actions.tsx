"use client";

import dynamic from "next/dynamic";
import { Separator } from "@/components/ui/separator";
import SearchCommandMenu from "@/components/navigation/search-command-menu";

const ModeToggle = dynamic(
  () => import("@/components/navigation/mode-toggle").then(m => ({ default: m.ModeToggle })),
  { ssr: false }
);

const SystemSettingsButton = dynamic(
  () =>
    import("@/components/navigation/system-settings-button").then(m => ({
      default: m.SystemSettingsButton,
    })),
  { ssr: false }
);

export function HeaderActions() {
  return (
    <div className="flex items-center gap-2 px-3 flex-1 justify-end">
      <SearchCommandMenu />
      <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
      <ModeToggle />
      <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
      <SystemSettingsButton />
    </div>
  );
}
