"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Control Lights",
    description: "Control your lights from anywhere. Set brightness, color, and schedules for the perfect ambiance.",
    icon: "💡",
    color: "from-blue-100 to-blue-50",
    borderColor: "border-blue-200",
  },
  {
    title: "Smart Temperature",
    description: "Set and adjust your home temperature intelligently. Learn your preferences and save energy.",
    icon: "🌡️",
    color: "from-orange-100 to-orange-50",
    borderColor: "border-orange-200",
  },
  {
    title: "Security Monitoring",
    description: "Monitor doors, locks, and cameras in real-time. Get instant alerts for any unusual activity.",
    icon: "🔒",
    color: "from-green-100 to-green-50",
    borderColor: "border-green-200",
  },
  {
    title: "Automations",
    description: "Create schedules and automations to simplify your life. Let your home work for you.",
    icon: "⚙️",
    color: "from-purple-100 to-purple-50",
    borderColor: "border-purple-200",
  },
]

export default function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 text-balance">Powerful Features</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Everything you need to manage your smart home efficiently and securely
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`bg-gradient-to-br ${feature.color} ${feature.borderColor} border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-4xl">{feature.icon}</span>
                </div>
                <CardTitle className="text-lg text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
