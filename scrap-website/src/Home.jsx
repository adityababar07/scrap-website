import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-base-200">

      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-base-content">
          Buy & Sell Scrap Easily
        </h1>

        <p className="mt-6 text-lg text-base-content/70 max-w-2xl mx-auto">
          A smart marketplace where you can buy recyclable materials
          or sell your scrap at the best price. Fast, transparent,
          and environmentally responsible.
        </p>

        <div className="mt-10 flex justify-center gap-6">
          <Link
            to="/buy"
            className="btn btn-neutral px-8"
          >
            Buy Scrap
          </Link>

          <Link
            to="/sell"
            className="btn btn-outline px-8"
          >
            Sell Scrap
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-base-100 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">

          <div>
            <h3 className="text-xl font-semibold text-primary">Best Prices</h3>
            <p className="mt-3 text-base-content/70">
              Compare rates and get the best value for your scrap materials.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-primary">Verified Buyers & Sellers</h3>
            <p className="mt-3 text-base-content/70">
              Secure and trusted marketplace with verified users.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-primary">Eco-Friendly Impact</h3>
            <p className="mt-3 text-base-content/70">
              Promote recycling and contribute to a cleaner environment.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Home;
