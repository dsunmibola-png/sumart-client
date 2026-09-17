import {
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const features = [
    "Secure Paystack checkout",
    "Simple product discovery",
    "Order status tracking",
    "Easy account management",
  ];

  const values = [
    {
      title: "Simplicity First",
      description:
        "We remove unnecessary friction and make the shopping journey easy to understand.",
      icon: Target,
      iconClass: "text-green-600",
      backgroundClass: "bg-green-50",
    },
    {
      title: "Secure by Design",
      description:
        "Payments and account flows are designed with security and trust in mind.",
      icon: ShieldCheck,
      iconClass: "text-blue-600",
      backgroundClass: "bg-blue-50",
    },
    {
      title: "Reliable Experience",
      description:
        "From checkout to delivery updates, customers stay informed throughout the order journey.",
      icon: Truck,
      iconClass: "text-purple-600",
      backgroundClass: "bg-purple-50",
    },
    {
      title: "Customer Focused",
      description:
        "Every part of SUMART is designed around making shopping more convenient for customers.",
      icon: HeartHandshake,
      iconClass: "text-amber-600",
      backgroundClass: "bg-amber-50",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-green-500/10 blur-3xl sm:h-96 sm:w-96" />

        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl sm:h-96 sm:w-96" />

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-20">
          {/* Hero Content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs font-bold text-green-400 sm:px-4 sm:text-sm">
              <Sparkles size={15} />
              About SUMART
            </div>

            <h1 className="mt-5 text-3xl font-extrabold leading-[1.1] tracking-tight sm:mt-6 sm:text-5xl lg:text-6xl">
              Shopping built to feel
              <span className="mt-1 block text-green-400 sm:mt-2">
                simple, smart and reliable.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:mt-6 sm:text-lg sm:leading-8">
              SUMART is designed around one idea: make online
              shopping easier. From discovering products to secure
              checkout and order tracking, every part of the
              experience is built with simplicity in mind.
            </p>

            <Link
              to="/shop"
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-green-400 sm:mt-8 sm:px-6 sm:py-3.5"
            >
              Explore the Store
              <ArrowRight size={17} />
            </Link>
          </div>

          {/* Experience Card */}
          <div className="relative">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl sm:rounded-[36px] sm:p-8 lg:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-slate-950 sm:h-16 sm:w-16 sm:rounded-2xl">
                <ShoppingBag
                  size={23}
                  className="sm:h-7 sm:w-7"
                />
              </div>

              <h2 className="mt-5 text-xl font-bold sm:mt-7 sm:text-2xl">
                Smart Shopping Starts Here
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400 sm:mt-4 sm:text-base sm:leading-7">
                SUMART brings products, payments and order
                management together in one seamless shopping
                experience.
              </p>

              <div className="mt-5 grid gap-3 sm:mt-7 sm:gap-4">
                {features.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-xs font-medium text-slate-300 sm:text-sm"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500/10">
                      <CheckCircle2
                        size={15}
                        className="text-green-400"
                      />
                    </span>

                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-10 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
            {/* Mission Content */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-600 sm:text-sm">
                Our Mission
              </p>

              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950 sm:mt-4 sm:text-4xl">
                Better shopping through better experiences.
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-600 sm:mt-5 sm:text-base sm:leading-8">
                We want SUMART to feel effortless. Customers
                should be able to browse, choose, pay and track
                their purchases without unnecessary complexity.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-8">
                That means focusing on clear design, useful
                products, secure payments and a shopping flow
                that works from start to finish.
              </p>
            </div>

            {/* Values */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              {values.map(
                ({
                  title,
                  description,
                  icon: Icon,
                  iconClass,
                  backgroundClass,
                }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:rounded-3xl sm:p-6"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${backgroundClass}`}
                    >
                      <Icon
                        size={20}
                        className={iconClass}
                      />
                    </div>

                    <h3 className="mt-3 text-sm font-bold leading-5 text-slate-900 sm:mt-5 sm:text-lg">
                      {title}
                    </h3>

                    <p className="mt-2 line-clamp-4 text-xs leading-5 text-slate-500 sm:mt-3 sm:line-clamp-none sm:text-sm sm:leading-6">
                      {description}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-[#f7f9f8] py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6 sm:mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-600">
              Why SUMART
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-slate-950 sm:text-3xl">
              Built for convenient shopping
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 sm:text-center">
              <Search
                size={21}
                className="text-green-600 sm:mx-auto sm:h-5.75 sm:w-5.75"
              />

              <p className="mt-3 text-base font-extrabold text-slate-950 sm:mt-4 sm:text-xl">
                Easy
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Product discovery
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 sm:text-center">
              <ShoppingBag
                size={21}
                className="text-blue-600 sm:mx-auto sm:h-5.75 sm:w-5.75"
              />

              <p className="mt-3 text-base font-extrabold text-slate-950 sm:mt-4 sm:text-xl">
                Simple
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Shopping experience
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 sm:text-center">
              <ShieldCheck
                size={21}
                className="text-purple-600 sm:mx-auto sm:h-5.75 sm:w-5.75"
              />

              <p className="mt-3 text-base font-extrabold text-slate-950 sm:mt-4 sm:text-xl">
                Secure
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Paystack payments
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 sm:text-center">
              <HeartHandshake
                size={21}
                className="text-amber-600 sm:mx-auto sm:h-5.75 sm:w-5.75"
              />

              <p className="mt-3 text-base font-extrabold text-slate-950 sm:mt-4 sm:text-xl">
                Anytime
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Shopping access
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-10 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl rounded-3xl bg-green-600 px-5 py-8 text-white sm:rounded-[36px] sm:px-10 sm:py-10 lg:flex lg:items-center lg:justify-between lg:px-14 lg:py-12">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-4xl">
              Ready to start shopping?
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-green-100 sm:mt-3 sm:text-base">
              Explore SUMART and discover products designed to
              make everyday shopping easier.
            </p>
          </div>

          <Link
            to="/shop"
            className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-green-700 transition hover:bg-green-50 sm:mt-7 sm:w-fit sm:py-3.5 lg:mt-0"
          >
            Shop Now
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default About;