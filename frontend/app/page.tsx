import Link from "next/link";
import { Search, Package, Utensils, Phone } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F4E4D7] to-[#E8D5C4]">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#F4E4D7]/95 z-10"></div>
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/cafe-interior-1.jpg')",
              backgroundAttachment: "fixed"
            }}
          ></div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 py-12 text-center">
          {/* Logo */}
          <div className="mb-4 flex justify-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white/50 overflow-hidden p-1">
              <img 
                src="/images/logo.jpg" 
                alt="Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black mb-3 text-white drop-shadow-2xl">
            The Living Room Cafe
          </h1>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-10 h-0.5 bg-white/60 rounded"></span>
            <p className="text-base md:text-lg text-white font-semibold">
              Restaurant • Cafe • Caterers
            </p>
            <span className="w-10 h-0.5 bg-white/60 rounded"></span>
          </div>
          
          <p className="text-xs text-white/90 mb-8 font-medium">
            Serving Raipur Since 2017
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link href="/menu">
              <button className="bg-white text-gray-900 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-100 w-full sm:w-auto shadow-xl transition-all transform hover:scale-105">
                🍽️ Order Food Online
              </button>
            </Link>
            <Link href="/catering">
              <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:from-green-700 hover:to-green-800 w-full sm:w-auto shadow-xl transition-all transform hover:scale-105">
                🎉 Book Catering
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/20">
              <div className="text-xl font-black text-white mb-0.5">9+</div>
              <div className="text-xs text-white/80">Years Serving</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/20">
              <div className="text-xl font-black text-white mb-0.5">200+</div>
              <div className="text-xs text-white/80">Menu Items</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/20">
              <div className="text-xl font-black text-white mb-0.5">10K+</div>
              <div className="text-xs text-white/80">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="max-w-7xl mx-auto px-4 py-12 -mt-8 relative z-30">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Track Order */}
          <Link href="/track" className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border-2 border-green-200 hover:border-green-500">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search size={24} className="text-green-600" />
            </div>
            <h3 className="text-lg font-black text-center mb-2 text-gray-900">Track Order</h3>
            <p className="text-gray-600 text-center text-xs">Check your order status</p>
          </Link>

          {/* My Orders */}
          <Link href="/my-orders" className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border-2 border-blue-200 hover:border-blue-500">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package size={24} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-black text-center mb-2 text-gray-900">My Orders</h3>
            <p className="text-gray-600 text-center text-xs">View order history</p>
          </Link>

          {/* Browse Menu */}
          <Link href="/menu" className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border-2 border-orange-200 hover:border-orange-500">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Utensils size={24} className="text-orange-600" />
            </div>
            <h3 className="text-lg font-black text-center mb-2 text-gray-900">Browse Menu</h3>
            <p className="text-gray-600 text-center text-xs">200+ delicious dishes</p>
          </Link>

          {/* Catering */}
          <Link href="/catering" className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border-2 border-purple-200 hover:border-purple-500">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Phone size={24} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-black text-center mb-2 text-gray-900">Catering</h3>
            <p className="text-gray-600 text-center text-xs">Book for events</p>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-black text-center mb-2 text-gray-900">Our Services</h2>
        <p className="text-center text-gray-600 mb-8 text-sm">Experience the best of dining, delivery & catering</p>
        
        <div className="grid md:grid-cols-3 gap-5">
          <div className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🍽️</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Dine-In</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Experience our vibrant ambiance with colorful interiors perfect for families and friends.
            </p>
          </div>

          <div className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🚚</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Home Delivery</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Hot & fresh food delivered across Raipur. Order online and enjoy restaurant-quality meals.
            </p>
          </div>

          <div className="group bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-white">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎉</div>
            <h3 className="text-xl font-bold mb-2">Catering</h3>
            <p className="text-white/90 leading-relaxed text-sm">
              Weddings, parties & corporate events. We bring the celebration to you with customized menus.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-black text-center mb-8 text-gray-900">Our Space</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="relative h-64 rounded-xl overflow-hidden shadow-xl group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
            <img 
              src="/images/cafe-interior-1.jpg"
              alt="Cafe Interior"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute bottom-3 left-3 z-20 text-white">
              <h3 className="text-xl font-bold">Vibrant Interiors</h3>
              <p className="text-white/80 text-xs">Colorful & cozy seating</p>
            </div>
          </div>
          
          <div className="relative h-64 rounded-xl overflow-hidden shadow-xl group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
            <img 
              src="/images/cafe-interior-2.jpg"
              alt="Cafe Ambiance"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute bottom-3 left-3 z-20 text-white">
              <h3 className="text-xl font-bold">Perfect Ambiance</h3>
              <p className="text-white/80 text-xs">Modern & comfortable</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - CHOTI KARI */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 rounded-xl p-8 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-3">Ready to Order?</h2>
            <p className="text-base mb-6 opacity-90">
              Call us now or explore our delicious menu online
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="tel:+919285555002">
                <button className="bg-white text-green-700 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-100 w-full sm:w-auto shadow-lg transition-all">
                  📞 +91 9285555002
                </button>
              </a>
              <Link href="/menu">
                <button className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-900 w-full sm:w-auto shadow-lg transition-all">
                  View Full Menu →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Link - ADD BACK */}
      <div className="text-center py-6">
        <Link 
          href="/admin/login"
          className="text-gray-400 hover:text-gray-600 transition text-xs opacity-30 hover:opacity-100"
        >
          🔐 Staff Login
        </Link>
      </div>
    </div>
  );
}
