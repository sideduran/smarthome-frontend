"use client"

import Link from "next/link"
import { Home, Mail, Phone, MessageCircle, Book, HelpCircle, Search } from "lucide-react"
import { useState } from "react"

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const supportCategories = [
    {
      icon: Book,
      title: "Getting Started",
      description: "Learn the basics of setting up your smart home",
      articles: [
        "How to connect your first device",
        "Understanding automation rules",
        "Setting up your mobile app",
        "Voice assistant integration guide",
      ],
    },
    {
      icon: HelpCircle,
      title: "Troubleshooting",
      description: "Common issues and their solutions",
      articles: [
        "Device won't connect to WiFi",
        "Automation not triggering",
        "App login issues",
        "Resetting your devices",
      ],
    },
    {
      icon: MessageCircle,
      title: "Account & Billing",
      description: "Manage your subscription and account",
      articles: [
        "How to upgrade your plan",
        "Billing and payment questions",
        "Managing multiple locations",
        "Canceling your subscription",
      ],
    },
  ]

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      availability: "Available 24/7",
      action: "Start Chat",
      color: "blue",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us an email",
      availability: "Response within 24 hours",
      action: "Send Email",
      color: "green",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call our support line",
      availability: "Mon-Fri, 9AM-6PM EST",
      action: "Call Now",
      color: "purple",
    },
  ]

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking the 'Forgot Password' link on the login page. We'll send you a reset link via email.",
    },
    {
      question: "Which devices are compatible?",
      answer: "Smart Home supports thousands of devices including Philips Hue, Nest, Ring, Amazon Echo, Google Home, and many more. Check our compatibility page for the full list.",
    },
    {
      question: "Can I use Smart Home without an internet connection?",
      answer: "While most features require an internet connection, basic automation rules stored locally on your hub will continue to work during internet outages.",
    },
    {
      question: "How secure is my data?",
      answer: "We use bank-level encryption (256-bit SSL) to protect your data. All communications between your devices and our servers are encrypted, and we never sell your data to third parties.",
    },
    {
      question: "Can I share access with family members?",
      answer: "Yes! You can invite family members to your home and control their permission levels. Each member gets their own login credentials.",
    },
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
                href="/pricing"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Pricing
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Search our knowledge base or contact our support team
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg"
            />
          </div>
        </div>

        {/* Support Categories */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {supportCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-all"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-6 text-center">
                    {category.description}
                  </p>
                  <ul className="space-y-3">
                    {category.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                        >
                          {article}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>

        {/* Contact Methods */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Contact Our Support Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => {
              const Icon = method.icon
              const colorClasses = {
                blue: "bg-blue-100 text-blue-600",
                green: "bg-green-100 text-green-600",
                purple: "bg-purple-100 text-purple-600",
              }
              const buttonClasses = {
                blue: "bg-blue-600 hover:bg-blue-700",
                green: "bg-green-600 hover:bg-green-700",
                purple: "bg-purple-600 hover:bg-purple-700",
              }
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-all text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full ${colorClasses[method.color as keyof typeof colorClasses]}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 mb-2">{method.description}</p>
                  <p className="text-sm text-gray-500 mb-6">
                    {method.availability}
                  </p>
                  <button
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
                      buttonClasses[method.color as keyof typeof buttonClasses]
                    }`}
                  >
                    {method.action}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our support team is available 24/7 to assist you with any questions or issues
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl">
              Visit Help Center
            </button>
            <button className="bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-800 transition-all border-2 border-white/20">
              Schedule a Call
            </button>
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

