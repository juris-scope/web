import React from 'react';

// Icons
const IconScale = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M3 12l9-9 9 9M3 12h18"/><circle cx="12" cy="12" r="3"/></svg>;
const IconShield = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconUsers = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconAward = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>;
const IconTarget = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const IconHeart = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IconCheck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>;
const IconBriefcase = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;

export default function AboutPage() {
  const services = [
    {
      title: 'Contract Analysis & Review',
      description: 'Deep AI-powered analysis of contracts to identify risks, liabilities, and compliance issues',
      icon: '📋',
      features: ['Risk scoring', 'Clause extraction', 'Anomaly detection', 'Compliance checking']
    },
    {
      title: 'Legal Document Drafting',
      description: 'Intelligent drafting assistance for creating professional legal documents from templates',
      icon: '✍️',
      features: ['Smart templates', 'Custom clauses', 'Multi-language', 'Version control']
    },
    {
      title: 'Employment Contracts',
      description: 'Comprehensive employment agreement creation with all necessary terms and protections',
      icon: '👔',
      features: ['Role-specific terms', 'Compensation clauses', 'Termination terms', 'IP protection']
    },
    {
      title: 'Non-Disclosure Agreements',
      description: 'Secure confidentiality agreements tailored to protect your sensitive information',
      icon: '🔒',
      features: ['Mutual/Unilateral', 'Custom definitions', 'Duration terms', 'Remedies clauses']
    },
    {
      title: 'Service Agreements',
      description: 'Professional service contracts defining scope, deliverables, and payment terms',
      icon: '🤝',
      features: ['Scope definition', 'Payment terms', 'SLA clauses', 'Termination rights']
    },
    {
      title: 'Partnership Deeds',
      description: 'Comprehensive partnership agreements for business collaborations',
      icon: '🤝',
      features: ['Profit sharing', 'Decision rights', 'Exit clauses', 'Dispute resolution']
    },
    {
      title: 'Lease Agreements',
      description: 'Residential and commercial lease contracts with clear terms and conditions',
      icon: '🏢',
      features: ['Rent terms', 'Maintenance duties', 'Security deposits', 'Renewal options']
    },
    {
      title: 'Loan Agreements',
      description: 'Detailed loan documentation with repayment schedules and interest terms',
      icon: '💰',
      features: ['Loan terms', 'Interest rates', 'Repayment schedule', 'Default clauses']
    }
  ];

  const values = [
    {
      icon: <IconShield />,
      title: 'Accuracy & Precision',
      description: 'Our AI models are trained on thousands of legal documents to ensure maximum accuracy'
    },
    {
      icon: <IconUsers />,
      title: 'User-Centric Design',
      description: 'Built with lawyers and legal professionals in mind, making complex analysis simple'
    },
    {
      icon: <IconHeart />,
      title: 'Commitment to Quality',
      description: 'We continuously improve our algorithms based on user feedback and legal standards'
    },
    {
      icon: <IconTarget />,
      title: 'Innovation First',
      description: 'Leveraging cutting-edge AI technology to stay ahead of legal tech evolution'
    }
  ];

  const team = [
    { name: 'Legal AI Team', role: 'Machine Learning Engineers', count: '12+' },
    { name: 'Legal Advisors', role: 'Legal Domain Experts', count: '8+' },
    { name: 'Product Team', role: 'UX/UI Designers', count: '5+' },
    { name: 'Support Team', role: 'Customer Success', count: '10+' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">

        <div className="max-w-7xl mx-auto text-center text-white">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl mb-6 border border-white/20">
            <IconScale />
          </div>
          <h1 className="text-5xl lg:text-6xl text-black mb-6 leading-tight text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)] tracking-tight">
            About JuriScope
          </h1>
          <p className="text-xl text-black/95 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
            We're revolutionizing legal document analysis and drafting with artificial intelligence, making legal work faster, smarter, and more accessible.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-900 rounded-full text-sm font-bold">
                OUR MISSION
              </div>
              <h2 className="text-4xl font-black text-gray-900">
                Making Legal Intelligence Accessible to Everyone
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                At JuriScope, we believe that everyone deserves access to sophisticated legal analysis tools. Our mission is to democratize legal technology by providing AI-powered contract analysis and drafting capabilities that were previously available only to large law firms.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We're building a future where legal documents are transparent, risks are identified automatically, and drafting is as simple as filling out a form.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-12 shadow-2xl">
                <div className="space-y-6">
                  {[
                    { icon: '🎯', text: 'Empower legal professionals with AI' },
                    { icon: '⚡', text: 'Reduce document review time by 80%' },
                    { icon: '🛡️', text: 'Identify risks before they become problems' },
                    { icon: '🌍', text: 'Make legal services globally accessible' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-md">
                      <div className="text-3xl">{item.icon}</div>
                      <div className="font-medium text-gray-900">{item.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-900 rounded-full text-sm font-bold mb-4">
              CORE VALUES
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">What Drives Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our values guide every decision we make and every feature we build
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-900 rounded-full text-sm font-bold mb-4">
              OUR SERVICES
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Comprehensive Legal Document Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From analysis to drafting, we cover all your legal document needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all group">
                <div className="h-32 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                  <div className="space-y-2">
                    {service.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <IconCheck className="w-3 h-3" />
                        </div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-bold mb-4">
              OUR TEAM
            </div>
            <h2 className="text-4xl font-black mb-4">Built by Experts, For Everyone</h2>
            <p className="text-xl text-white/85 max-w-3xl mx-auto">
              Our diverse team combines legal expertise with cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconBriefcase />
                </div>
                <div className="text-3xl font-black mb-2">{member.count}</div>
                <div className="text-lg font-bold mb-1">{member.name}</div>
                <div className="text-sm text-white/70">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-12 text-white shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black mb-4">Our Impact in Numbers</h2>
              <p className="text-xl text-white/85">Trusted by legal professionals worldwide</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: '50,000+', label: 'Contracts Analyzed', icon: '📊' },
                { value: '10,000+', label: 'Active Users', icon: '👥' },
                { value: '98%', label: 'Accuracy Rate', icon: '✅' },
                { value: '24/7', label: 'Availability', icon: '🌍' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-5xl mb-3">{stat.icon}</div>
                  <div className="text-4xl font-black mb-2 text-white/95">{stat.value}</div>
                  <div className="text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-6">
            Ready to Experience the Future of Legal Work?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of professionals who trust JuriScope for their legal document needs
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-blue-900 text-white rounded-xl font-bold text-lg hover:bg-blue-800 transition-all shadow-xl hover:scale-105 transform">
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-gray-100 text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
