import React, { useState } from 'react';

// Icons
const IconScale = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M3 12l9-9 9 9M3 12h18"/><circle cx="12" cy="12" r="3"/></svg>;
const IconDocument = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IconPen = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;
const IconShield = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconBrain = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1 3 3.87V15a4 4 0 0 1-3.87 4H8.87A4 4 0 0 1 5 15v-4.13A4 4 0 0 1 8 7V6a4 4 0 0 1 4-4z"/><path d="M12 2v20"/></svg>;
const IconCheck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>;
const IconArrowRight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

// Header removed per request

// Dashboard Page
const DashboardPage = ({ onNavigate }) => {
  const testimonials = [
    { name: "Priya Sharma", role: "Corporate Lawyer", text: "JuriScope has revolutionized how we review contracts. What used to take hours now takes minutes!" },
    { name: "Rajesh Kumar", role: "Legal Consultant", text: "The AI-powered risk detection is incredibly accurate. It's caught issues we might have missed." },
    { name: "Anita Desai", role: "Contract Manager", text: "The drafting assistant is phenomenal. It understands context and produces professional documents." },
    { name: "Vikram Mehta", role: "Startup Founder", text: "As a non-lawyer, JuriScope helps me understand complex legal documents with ease." }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          </div>
        </div>

        <div className="relative z-10 w-full px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
              ⚡ Powered by Advanced AI
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              Legal Analysis
              <span className="block bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Transform complex legal documents into actionable insights with AI-powered contract analysis, risk assessment, and intelligent drafting.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => onNavigate('analysis')}
                className="px-8 py-4 bg-white text-blue-900 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-2xl shadow-blue-900/50 hover:scale-105 transform flex items-center gap-2"
              >
                Start Analysis <IconArrowRight />
              </button>
              <button 
                onClick={() => onNavigate('drafting')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2"
              >
                Try Drafting <IconPen />
              </button>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative">
            <div className="relative bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <IconCheck />
                  </div>
                  <div>
                    <div className="text-white font-bold">Contract Analyzed</div>
                    <div className="text-blue-200 text-sm">98% Confidence Score</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <IconShield />
                  </div>
                  <div>
                    <div className="text-white font-bold">3 Risk Factors Found</div>
                    <div className="text-blue-200 text-sm">Moderate Risk Level</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <IconBrain />
                  </div>
                  <div>
                    <div className="text-white font-bold">AI Recommendations</div>
                    <div className="text-blue-200 text-sm">5 Improvements Suggested</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-400 rounded-2xl opacity-50 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-400 rounded-full opacity-30 animate-pulse delay-500"></div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
            <div className="w-1.5 h-3 bg-white rounded-full mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Features Section - Alternating Layout */}
      <section className="py-20 px-6">
        <div className="w-full space-y-32">
          {/* Feature 1 - Card Left, Text Right */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                  <IconShield />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Risk Assessment</h3>
                <p className="text-gray-600 mb-6">
                  Our AI analyzes every clause, identifying potential risks and liability concerns with military-grade precision.
                </p>
                <ul className="space-y-3">
                  {['Automated risk scoring', 'Clause-level analysis', 'Liability detection', 'Compliance checks'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <IconCheck />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-900 rounded-full text-sm font-bold">
                RISK INTELLIGENCE
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                Protect Your Interests Before You Sign
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Don't let hidden risks catch you off guard. Our AI scans contracts for unfavorable terms, unlimited liabilities, and compliance issues—giving you the confidence to negotiate better deals.
              </p>
              <button 
                onClick={() => onNavigate('analysis')}
                className="px-6 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center gap-2"
              >
                Try Risk Analysis <IconArrowRight />
              </button>
            </div>
          </div>

          {/* Feature 2 - Text Left, Card Right */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 lg:order-1">
              <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-900 rounded-full text-sm font-bold">
                AI DRAFTING
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                Draft Professional Documents in Minutes
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Say goodbye to starting from scratch. Our intelligent drafting assistant creates customized legal documents tailored to your specific needs, saving you hours of work.
              </p>
              <button 
                onClick={() => onNavigate('drafting')}
                className="px-6 py-3 bg-indigo-900 text-white rounded-xl font-bold hover:bg-indigo-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center gap-2"
              >
                Start Drafting <IconPen />
              </button>
            </div>
            <div className="relative group lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl transform -rotate-3 group-hover:-rotate-6 transition-transform"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-900 to-purple-700 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                  <IconPen />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Intelligent Document Creation</h3>
                <p className="text-gray-600 mb-6">
                  Generate contracts, agreements, and legal documents with AI that understands context and legal language.
                </p>
                <ul className="space-y-3">
                  {['Template customization', 'Multi-language support', 'Clause suggestions', 'Format optimization'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <IconCheck />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Feature 3 - Card Left, Text Right */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-teal-600 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-green-700 to-teal-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                  <IconBrain />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Anomaly Detection Engine</h3>
                <p className="text-gray-600 mb-6">
                  Our advanced ML algorithms detect unusual patterns and deviations that human reviewers might miss.
                </p>
                <ul className="space-y-3">
                  {['Pattern recognition', 'Deviation alerts', 'Contextual analysis', 'Smart highlighting'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <IconCheck />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-green-100 text-green-900 rounded-full text-sm font-bold">
                ANOMALY DETECTION
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                Catch What Others Miss
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Unusual clauses hiding in plain sight? Our anomaly detection spots inconsistencies, outliers, and suspicious terms that don't match industry standards—protecting you from hidden traps.
              </p>
              <button 
                onClick={() => onNavigate('analysis')}
                className="px-6 py-3 bg-green-700 text-white rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center gap-2"
              >
                Explore Detection <IconArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
        <div className="w-full">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-bold mb-4">
              ABOUT JURISCOPE
            </div>
            <h2 className="text-4xl lg:text-5xl font-black mb-6">Trusted by Legal Professionals Worldwide</h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              We're on a mission to make legal technology accessible, intelligent, and indispensable for everyone who works with contracts.
            </p>
          </div>

          {/* Testimonials Carousel */}
          <div className="relative overflow-hidden">
            <div className="flex gap-6 animate-scroll-continuous pb-8">
              {[...testimonials, ...testimonials].map((testimonial, i) => (
                <div key={i} className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="w-5 h-5 text-yellow-400">⭐</div>
                    ))}
                  </div>
                  <p className="text-blue-100 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-blue-300">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {[
              { value: '50K+', label: 'Contracts Analyzed' },
              { value: '98%', label: 'Accuracy Rate' },
              { value: '10K+', label: 'Active Users' },
              { value: '24/7', label: 'AI Availability' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-black bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="w-full text-center bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-12 text-white shadow-2xl">
          <h2 className="text-4xl font-black mb-6">Ready to Transform Your Legal Workflow?</h2>
          <p className="text-xl text-blue-200 mb-8">
            Join thousands of legal professionals who trust JuriScope for smarter, faster contract analysis.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => onNavigate('analysis')}
              className="px-8 py-4 bg-white text-blue-900 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:scale-105 transform"
            >
              Get Started Free
            </button>
            <button 
              onClick={() => onNavigate('about')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all border border-white/20"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes scroll-continuous {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-continuous {
          animation: scroll-continuous 30s linear infinite;
        }
        .animate-scroll-continuous:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

// Main App Component
export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'dashboard' && <DashboardPage onNavigate={setCurrentPage} />}
      {currentPage === 'analysis' && (
        <div className="max-w-screen mx-auto px-6 py-12">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Analysis Page</h2>
            <p className="text-gray-600">This is your existing analysis page. Replace this section with your analysis component.</p>
          </div>
        </div>
      )}
      {currentPage === 'drafting' && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Drafting Page</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        </div>
      )}
      {currentPage === 'previous' && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Previous Drafts</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        </div>
      )}
      {currentPage === 'about' && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About Us</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        </div>
      )}
    </div>
  );
}