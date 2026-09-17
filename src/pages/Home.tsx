import {
  BadgeCheck,
  Headphones,
  ShieldCheck,
  Truck,
} from "lucide-react";

import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";

const Home = () => {
  const benefits = [
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Reliable delivery across Nigeria",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payment",
      description: "Protected Paystack checkout",
    },
    {
      icon: BadgeCheck,
      title: "Quality Products",
      description: "Products selected with care",
    },
    {
      icon: Headphones,
      title: "Customer Support",
      description: "We're here when you need us",
    },
  ];

  return (
    <main className="bg-white">
      <Hero />

      {/* Trust Bar */}
      <section className="border-y border-slate-200 bg-white">
       <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-slate-200 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="flex min-w-0 flex-col items-start gap-3 bg-white px-4 py-5 sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:py-7 lg:px-7"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700">
                  <Icon size={20} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {benefit.title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Categories />

      <FeaturedProducts />
    </main>
  );
};

export default Home;