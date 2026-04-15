import { BarChart3, Lock, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";

export function FeaturesSection() {
  return (
    <section className="px-4 py-20 md:py-32">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-foreground">Powerful Features</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: TrendingDown,
              title: "Smart Tracking",
              description:
                "Automatically categorize and track your expenses with intelligent analytics and insights.",
            },
            {
              icon: BarChart3,
              title: "Visual Insights",
              description:
                "Beautiful charts and reports to understand your spending patterns at a glance.",
            },
            {
              icon: Lock,
              title: "Secure & Private",
              description:
                "Your financial data is encrypted and protected with enterprise-grade security.",
            },
          ].map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Card
                key={index}
                className="p-6 border border-border bg-card hover:border-primary transition-colors"
              >
                <Icon className="w-8 h-8 text-primary mb-4" />

                <h3 className="text-xl font-semibold mb-3 text-card-foreground">{feature.title}</h3>

                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
