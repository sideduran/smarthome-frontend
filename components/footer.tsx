"use client"

export default function Footer() {
  const footerLinks = ["Features", "Pricing", "Support", "Sign In"]

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">S</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Smart Home</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
              Control your entire home from one place. Experience the future of smart living with our all-in-one IoT
              platform.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8 justify-start md:justify-end">
            {footerLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8">
          <p className="text-gray-500 text-sm text-center">© 2025 Smart Home. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
