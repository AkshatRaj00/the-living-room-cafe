import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h3 className="text-xl font-black mb-4">The Living Room Cafe</h3>
          <p className="text-gray-400">Restaurant • Cafe • Caterers</p>
          <p className="text-gray-400 mt-2">Raipur, Chhattisgarh</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-black mb-4">Quick Links</h3>
          <div className="space-y-2">
            <Link href="/" className="block text-gray-400 hover:text-white transition">Home</Link>
            <Link href="/menu" className="block text-gray-400 hover:text-white transition">Menu</Link>
            <Link href="/track" className="block text-gray-400 hover:text-white transition">Track Order</Link>
            <Link href="/my-orders" className="block text-gray-400 hover:text-white transition">My Orders</Link>
            <Link href="/catering" className="block text-gray-400 hover:text-white transition">Catering</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-black mb-4">Contact</h3>
          <p className="text-gray-400">Phone: +91 98765 43210</p>
          <p className="text-gray-400">Email: info@thelivingroomcafe.in</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
        <p>&copy; 2026 The Living Room Cafe. All rights reserved.</p>
      </div>
    </footer>
  )
}
