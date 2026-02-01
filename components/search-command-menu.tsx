"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

// Example data with title and link
const commands = [
  {
    group: "Suggestions",
    items: [
      { title: "Expense Management", href: "/financial/expense-management" },
      { title: "Income Management", href: "/financial/income-management" },
      { title: "Budget Management", href: "/financial/budget-management" },
      { title: "Report Management", href: "/financial/report-management" },
    ],
  },
  {
    group: "Access Control",
    items: [
      { title: "User Management", href: "/access-control/user-management" },
      { title: "Role Management", href: "/access-control/role-management" },
      { title: "Permission Management", href: "/access-control/permission-management" },
      { title: "Access Key Management", href: "/access-control/access-key-management" },
    ],
  },
  {
    group: "Master Data",
    items: [
      { title: "Expense Category", href: "/master-data/expense-category" },
      { title: "Income Source", href: "/master-data/income-source" },
      { title: "Payment Method", href: "/master-data/payment-method" },
      { title: "Bank", href: "/master-data/bank" },
    ],
  },
  {
    group: "Financials",
    items: [
      { title: "Expense Management", href: "/financial/expense-management" },
      { title: "Income Management", href: "/financial/income-management" },
      { title: "Budget Management", href: "/financial/budget-management" },
      { title: "Report Management", href: "/financial/report-management" },
    ],
  },
];

const SearchCommandMenu = () => {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  // Keyboard shortcut (⌘K / Ctrl+K)
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      {/* HEADER BUTTON */}
      <Button
        variant={isMobile ? "ghost" : "outline"}
        onClick={() => setOpen(true)}
        className="
          h-9
          w-9 lg:w-64
          px-0 lg:px-3
          justify-center lg:justify-start
          text-muted-foreground
        "
      >
        <Search className="h-4 w-4 lg:mr-2" />
        <span className="hidden lg:inline">Search Spentra</span>
      </Button>

      {/* COMMAND DIALOG */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {commands.map(group => (
            <CommandGroup key={group.group} heading={group.group}>
              {group.items.map(item => (
                <CommandItem key={item.title}>
                  <Link
                    href={item.href}
                    className="flex justify-between items-center w-full "
                    onClick={() => setOpen(false)}
                  >
                    <span>{item.title}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchCommandMenu;
