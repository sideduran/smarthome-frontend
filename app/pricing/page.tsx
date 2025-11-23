"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, X, Home, Zap, Shield, Award } from "lucide-react"

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Starter",
      icon: Home,
      description: "Perfect for small apartments or getting started with smart home",
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        { text: "Up to 5 devices", included: true },
        { text: "Basic automation rules", included: true },
        { text: "Mobile app access", included: true },
        { text: "24/7 device monitoring", included: true },
        { text: "Voice assistant integration", included: false },
        { text: "Advanced analytics", included: false },
        { text: "Priority support", included: false },
        { text: "Custom scenes", included: false },
      ],
      popular: false,
      cta: "Get Started",
      ctaVariant: "outline" as const,
    },
    {
      name: "Smart Home",
      icon: Zap,
      description: "Ideal for most homes with comprehensive smart features",
      monthlyPrice: 14.99,
      annualPrice: 149.99,
      features: [
        { text: "Up to 25 devices", included: true },
        { text: "Advanced automation rules", included: true },
        { text: "Mobile app access", included: true },
        { text: "24/7 device monitoring", included: true },
        { text: "Voice assistant integration", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Priority support", included: false },
        { text: "Unlimited custom scenes", included: true },
      ],
      popular: true,
      cta: "Start Free Trial",
      ctaVariant: "primary" as const,
    },
    {
      name: "Premium",
      icon: Shield,
      description: "For power users who want the ultimate smart home experience",
      monthlyPrice: 29.99,
      annualPrice: 299.99,
      features: [
        { text: "Unlimited devices", included: true },
        { text: "Advanced automation rules", included: true },
        { text: "Mobile app access", included: true },
        { text: "24/7 device monitoring", included: true },
        { text: "Voice assistant integration", included: true },
        { text: "Advanced analytics & AI insights", included: true },
        { text: "Priority support", included: true },
        { text: "Unlimited custom scenes", included: true },
      ],
      popular: false,
      cta: "Start Free Trial",
      ctaVariant: "outline" as const,
    },
  ]

  const enterpriseFeatures = [
    "Unlimited devices and locations",
    "Dedicated account manager",
    "Custom integrations and API access",
    "Advanced security and compliance",
    "SLA guarantee",
    "On-site installation support",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl">Smart Home</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Choose the perfect plan for your smart home. All plans include a 30-day free trial.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-16">
          <span className={`text-lg ${!isAnnual ? "text-gray-900 font-semibold" : "text-gray-500"}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative inline-flex h-8 w-14 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                isAnnual ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
          <span className={`text-lg ${isAnnual ? "text-gray-900 font-semibold" : "text-gray-500"}`}>
            Annual
          </span>
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            Save 17%
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan) => {
            const Icon = plan.icon
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
            const period = isAnnual ? "/year" : "/month"

            return (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-2xl ${
                  plan.popular ? "ring-4 ring-blue-600 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${plan.popular ? "bg-blue-100" : "bg-gray-100"}`}>
                      <Icon className={`h-8 w-8 ${plan.popular ? "text-blue-600" : "text-gray-600"}`} />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6 min-h-[3rem]">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">
                      ${price}
                    </span>
                    <span className="text-gray-600 ml-2">{period}</span>
                    {isAnnual && price > 0 && (
                      <div className="text-sm text-gray-500 mt-1">
                        ${(price / 12).toFixed(2)}/month billed annually
                      </div>
                    )}
                  </div>

                  <button
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all mb-8 ${
                      plan.ctaVariant === "primary"
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                        : "bg-white border-2 border-gray-300 text-gray-900 hover:border-blue-600 hover:text-blue-600"
                    }`}
                  >
                    {plan.cta}
                  </button>

                  <div className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mr-3 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Enterprise Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-12 text-white">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full">
              <Award className="h-12 w-12" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4">Enterprise</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Custom solutions for large organizations, property management, and commercial buildings
          </p>

          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
            {enterpriseFeatures.map((feature, index) => (
              <div key={index} className="flex items-center">
                <Check className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl">
            Contact Sales
          </button>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 text-left max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Can I change plans later?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately,
                and we'll prorate any billing adjustments.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                What happens after my free trial?
              </h3>
              <p className="text-gray-600">
                Your 30-day free trial gives you full access to all features of your chosen plan. After the
                trial ends, you'll be charged based on your selected billing cycle. Cancel anytime during the trial.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                What counts as a device?
              </h3>
              <p className="text-gray-600">
                A device is any connected smart home product, such as a light bulb, thermostat, camera, or sensor.
                Hubs and bridges don't count toward your device limit.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 30-day money-back guarantee on all paid plans. If you're not satisfied,
                contact support for a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-gray-50 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Smart Home. All rights reserved.</p>
            <div className="mt-4 space-x-6">
              <Link href="#" className="hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-gray-900 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-gray-900 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

