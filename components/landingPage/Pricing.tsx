import { Button } from "@/components/ui";
import { PRICES } from "./data";

export default function Pricing() {
  return (
    <section className="text-center px-4 md:px-0">
      <h1 className="text-[2.5rem] font-semibold">Flexible Pricing Plans</h1>
      <p className="text-muted-foreground mt-2">
        Choose the plan that best suits your needs.
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {PRICES.map((price, idx) => (
          <div
            key={idx}
            className={`flex flex-col justify-between h-full px-8 py-10 rounded-3xl border-2 ${
              price.isPrimary
                ? "bg-foreground text-background dark:bg-muted"
                : "bg-background text-foreground"
            } border-border`}
          >
            <div className="space-y-4">
              <p className="text-lg font-medium">{price.title}</p>

              <p>
                <span className="text-[3rem] font-semibold">
                  ₹{price.price}
                </span>
                <span className="text-base">/month</span>
              </p>

              <p className="text-muted-foreground">{price.desc}</p>

              <ul
                className={`border-t pt-4 space-y-2 text-left ${
                  price.isPrimary
                    ? "border-muted-foreground text-muted-foreground"
                    : "border-border"
                }`}
              >
                {price.features.map((feature, idx) => (
                  <li key={idx}>• {feature}</li>
                ))}
              </ul>
            </div>

            <Button
              variant="default"
              className={`rounded-full py-6 text-lg font-medium mt-8 ${
                price.isPrimary
                  ? "bg-background text-foreground hover:bg-muted"
                  : ""
              }`}
            >
              {price.button}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
