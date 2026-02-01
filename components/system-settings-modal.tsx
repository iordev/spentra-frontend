"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function SystemSettingsModal({ triggerButton }: { triggerButton?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>System Settings</DialogTitle>
          <DialogDescription>Configure your system preferences here.</DialogDescription>
        </DialogHeader>

        {/* Your settings content */}
        <div className="flex flex-col gap-4 mt-4">
          <Button variant="outline">Example Setting 1</Button>
          <Button variant="outline">Example Setting 2</Button>
        </div>

        {/* Close button in top-right */}
        <DialogClose asChild>
          <button className="absolute top-3 right-3 p-1 hover:bg-muted rounded-md">
            <X className="w-4 h-4" />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
