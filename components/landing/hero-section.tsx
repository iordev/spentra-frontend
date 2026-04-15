import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative px-4 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
          Take Control of Your Money
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Track expenses, manage budgets, and achieve your financial goals with Spentra's
          intelligent expense tracking platform.
        </p>
        <Link href="/signup">
          <Button size="lg" className="font-semibold">
            Start Here <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
