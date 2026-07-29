import Link from "next/link";

export default function Home() {
  return (
    <>
      <main>
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <p className="inline-block px-3 py-1 rounded-full text-xs font-semibold badge">
            The Ultimate Fantasy Football Experience
          </p>
          <h2 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight">
            Create your dream squad, challenge your friends,
            and rise to the top with <span className="text-primary">EliteXI</span>.
          </h2>
          <p className="mt-6 text-lg text-muted max-w-3xl">
            Pick your players, manage your club, make smart transfers, and
            compete in exciting tournaments - all in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/auth" className="px-6 py-3 rounded-lg bg-primary text-white font-semibold">Start Your Journey</Link>
          </div>
        </section>

        <section id="benefits" className="max-w-6xl mx-auto px-6 pb-16">
          <h3 className="text-2xl font-bold">Why Use EliteXI</h3>
          <p className="text-muted mt-2">Simple to start, fun to play, and built for competition.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <article className="bg-card p-6 rounded-xl border border-card">
              <h4 className="text-lg font-bold">Build Your Squad</h4>
              <p className="text-muted mt-2">Create your team with top players and shape your perfect starting eleven.</p>
            </article>
            <article className="bg-card p-6 rounded-xl border border-card">
              <h4 className="text-lg font-bold">Smart Transfers</h4>
              <p className="text-muted mt-2">Buy, sell, and trade players at the right moment to stay ahead.</p>
            </article>
            <article className="bg-card p-6 rounded-xl border border-card">
              <h4 className="text-lg font-bold">Live Competition</h4>
              <p className="text-muted mt-2">Play matches, join tournaments, and keep climbing the leaderboard.</p>
            </article>
            <article className="bg-card p-6 rounded-xl border border-card">
              <h4 className="text-lg font-bold">Easy Club Control</h4>
              <p className="text-muted mt-2">Manage your club in a clean dashboard with no complexity.</p>
            </article>
            <article className="bg-card p-6 rounded-xl border border-card">
              <h4 className="text-lg font-bold">Fair & Competitive</h4>
              <p className="text-muted mt-2">Balanced gameplay and transparent rankings keep every season exciting.</p>
            </article>
            <article className="bg-card p-6 rounded-xl border border-card">
              <h4 className="text-lg font-bold">Made for Everyone</h4>
              <p className="text-muted mt-2">Whether you are casual or competitive, EliteXI is easy to enjoy.</p>
            </article>
          </div>
        </section>

        <section id="how" className="max-w-6xl mx-auto px-6 pb-20">
          <div className="bg-surface border border-card rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div>
                <p className="text-primary font-bold text-lg">1. Create Your Account</p>
                <p className="text-muted mt-2">Sign up in seconds and enter the world of EliteXI.</p>
              </div>
              <div>
                <p className="text-secondary font-bold text-lg">2. Build and Manage</p>
                <p className="text-muted mt-2">Choose players, make transfers, and set your squad strategy.</p>
              </div>
              <div>
                <p className="text-yellow-400 font-bold text-lg">3. Compete and Win</p>
                <p className="text-muted mt-2">Play matches, join tournaments, and chase the #1 ranking.</p>
              </div>
            </div>
            <div className="mt-10">
              <Link href="/auth" className="inline-block px-6 py-3 rounded-lg bg-primary text-white font-semibold">
                Join EliteXI Now
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
