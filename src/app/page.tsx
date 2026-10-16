import Link from "next/link";
import { Clock, MapPin, Shield, Smartphone } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Fast & Reliable Dispatch in{" "}
              <span className="text-green-300">Warri & Effurun</span>
            </h1>
            <p className="text-lg md:text-xl text-green-100 mb-8">
              Book a rider in minutes. Track your package in real time. Get it
              delivered same day across Delta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center bg-white text-green-700 font-semibold px-6 py-3.5 rounded-lg hover:bg-green-50 transition"
              >
                Book a Delivery
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center border-2 border-white/40 text-white font-semibold px-6 py-3.5 rounded-lg hover:bg-white/10 transition"
              >
                Login to Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Why choose DLVdispatch?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Same-Day Delivery</h3>
            <p className="text-gray-600 text-sm">
              Book now and get your package delivered within hours across Warri
              and Effurun.
            </p>
          </div>
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Live Tracking</h3>
            <p className="text-gray-600 text-sm">
              Follow your order status from pickup to delivery in real time.
            </p>
          </div>
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Trusted Riders</h3>
            <p className="text-gray-600 text-sm">
              Verified local riders. Your packages are in safe hands.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            How it works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Book Online", desc: "Enter pickup & drop-off details" },
              { step: "2", title: "We Assign a Rider", desc: "Nearest available rider is matched" },
              { step: "3", title: "Track Progress", desc: "Watch status updates live" },
              { step: "4", title: "Get Delivered", desc: "Package arrives safely" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="card p-8 md:p-12 bg-green-50 border-green-100">
          <Smartphone className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Ready to send a package?</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Join customers in Warri and Effurun who trust DLVdispatch for fast
            local deliveries.
          </p>
          <Link href="/register" className="btn-primary inline-flex">
            Create Free Account
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>
            © {new Date().getFullYear()} DLVdispatch. Serving Warri, Effurun &
            Delta State.
          </p>
        </div>
      </footer>
    </div>
  );
}
