import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { SignInForm } from "@/components/signin-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function NavigationSection() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src="/favicon.ico" alt="App logo" />
            <AvatarFallback className="rounded-lg">S</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-medium">Spentra</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost">Sign In</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-110 p-8">
              <DialogTitle>
                <VisuallyHidden>Sign in to Spentra</VisuallyHidden>
              </DialogTitle>
              <DialogDescription>
                <VisuallyHidden>
                  Use your email or continue with social login to sign in to Spentra.
                </VisuallyHidden>
              </DialogDescription>
              <SignInForm />
            </DialogContent>
          </Dialog>

          <Link href="/signup">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
