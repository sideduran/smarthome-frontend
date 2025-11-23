"use client"

import { Card } from "@/components/ui/card"

const steps = [
  {
    number: "1",
    title: "Connect Your Devices",
    description: "Add your smart devices to the platform. Support for all major brands and protocols.",
    icon: "🔌",
    color: "from-blue-100 to-blue-50",
    borderColor: "border-blue-200",
  },
  {
    number: "2",
    title: "Organize by Rooms",
    description: "Group your devices by room for easy navigation and faster control.",
    icon: "🏠",
    color: "from-purple-100 to-purple-50",
    borderColor: "border-purple-200",
  },
  {
    number: "3",
    title: "Control & Automate",
    description: "Control everything from one dashboard and create automations to fit your lifestyle.",
    icon: "⚡",
    color: "from-green-100 to-green-50",
    borderColor: "border-green-200",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 text-balance">How Smart Home Works</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get started in three simple steps and take control of your home
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line - Hidden on Mobile */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-1 bg-gradient-to-r from-blue-300 to-transparent"></div>
              )}

              <Card
                className={`bg-gradient-to-br ${step.color} ${step.borderColor} border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative z-10`}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200">
                      <span className="text-2xl font-bold text-blue-600">{step.number}</span>
                    </div>
                    <span className="text-4xl">{step.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{step.description}</p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
