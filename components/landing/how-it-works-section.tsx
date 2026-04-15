export function HowItWorksSection() {
  return (
    <section className="px-4 py-20 md:py-32 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-foreground">How It Works</h2>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              step: 1,
              title: "Sign Up",
              description: "Create your account in seconds with just an email.",
            },
            {
              step: 2,
              title: "Connect Accounts",
              description: "Link your bank accounts securely for automatic tracking.",
            },
            {
              step: 3,
              title: "Get Insights",
              description: "Receive personalized recommendations for your spending.",
            },
            {
              step: 4,
              title: "Save Money",
              description: "Achieve your financial goals with smart budgeting tools.",
            },
          ].map(item => (
            <div key={item.step} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-4">
                {item.step}
              </div>

              <h3 className="text-lg font-semibold mb-2 text-foreground">{item.title}</h3>

              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
