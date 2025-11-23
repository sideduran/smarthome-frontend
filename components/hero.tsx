"use client"

import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight text-balance">
              Control Your Home, Anywhere
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Smart Home is your all-in-one IoT platform to control and monitor your entire home. Manage your lights,
              thermostats, and security devices all from one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-base h-12">Get Started</Button>
            </div>
          </div>

          {/* Right Side - Enhanced Dashboard Mockup */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* Decorative background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-3xl blur-3xl opacity-30"></div>

              {/* Dashboard container */}
              <div className="relative bg-white rounded-2xl p-8 shadow-2xl border border-gray-200">
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                </div>

                <div className="space-y-4">
                  {/* Device Card 1 */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Living Room Lights</p>
                        <p className="text-xs text-gray-500 mt-1">💡 100% brightness</p>
                      </div>
                      <div className="w-12 h-6 bg-blue-600 rounded-full shadow-md"></div>
                    </div>
                  </div>

                  {/* Device Card 2 */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-4 border border-orange-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Thermostat</p>
                        <p className="text-xs text-gray-500 mt-1">🌡️ Heating</p>
                      </div>
                      <div className="text-2xl font-bold text-orange-600">72°</div>
                    </div>
                  </div>

                  {/* Device Card 3 */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Front Door Lock</p>
                        <p className="text-xs text-gray-500 mt-1">🔒 Secured</p>
                      </div>
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
