import React from 'react';
import {
    Users, Clock, Calendar, DollarSign, BarChart3,
    Shield, Zap, Globe, Heart, ArrowRight,
    CheckCircle2, PlayCircle, Star, Building2, Briefcase
} from 'lucide-react';

const Home = ({ setCurrentPage }) => {
    const modules = [
        { id: 'employees', title: 'Core HR', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 'dashboard', title: 'Onboarding', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50' },
        { id: 'attendance', title: 'Attendance', icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { id: 'payroll', title: 'Payroll Management', icon: DollarSign, color: 'text-rose-500', bg: 'bg-rose-50' },
        { id: 'dashboard', title: 'Recruitment', icon: Globe, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        { id: 'leaves', title: 'Leave Management', icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-50' },
        { id: 'dashboard', title: 'Performance', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' },
        { id: 'dashboard', title: 'Task Management', icon: CheckCircle2, color: 'text-cyan-500', bg: 'bg-cyan-50' }
    ];

    return (
        <div className="bg-white min-h-screen overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-40 bg-gradient-to-br from-neutral-50 via-white to-primary-50">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="animate-slide-in">
                        <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                            <Star size={14} className="mr-2" />
                            #1 HR Platform in 2026
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-neutral-900 leading-tight mb-8">
                            Empower Your <span className="text-primary-500">People</span>, Elevate Your Business.
                        </h1>
                        <p className="text-xl text-neutral-500 mb-10 leading-relaxed max-w-lg">
                            The only HR platform you'll ever need. Automate payroll, track attendance, and manage talent in one beautiful space.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => setCurrentPage('dashboard')}
                                className="px-10 py-5 bg-neutral-900 text-white font-bold rounded-2xl shadow-xl hover:bg-neutral-800 transition-all hover-translate-y-1 flex items-center"
                            >
                                Go to Dashboard <ArrowRight size={20} className="ml-2" />
                            </button>
                            <button className="px-10 py-5 bg-white text-neutral-900 font-bold rounded-2xl border border-neutral-200 hover-bg-neutral-50 transition-all hover-translate-y-1 flex items-center">
                                <PlayCircle size={20} className="mr-2 text-primary-500" /> Watch Demo
                            </button>
                        </div>
                    </div>
                    <div className="relative animate-fade-in group">
                        <div className="absolute -inset-4 bg-primary-500-10 rounded-3rem blur-3xl group-hover-bg-primary-500 transition-all duration-1000"></div>
                        <img
                            src="/hrms_hero_illustration.png"
                            alt="Hero Illustration"
                            className="relative z-10 w-full h-auto rounded-2-5rem shadow-2xl border-8 border-white group-hover-scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>
            </section>

            {/* Modules Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black text-neutral-900 mb-4">Comprehensive HR Modules</h2>
                        <p className="text-neutral-500 font-bold uppercase tracking-widest text-sm">Everything you need to scale your team successfully</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {modules.map((m, i) => {
                            const Icon = m.icon;
                            return (
                                <div
                                    key={i}
                                    onClick={() => setCurrentPage(m.id)}
                                    className="group p-8 rounded-2rem border border-neutral-100 hover-border-primary-100 hover-bg-neutral-50 transition-all cursor-pointer text-center"
                                >
                                    <div className={`w-16 h-16 ${m.bg} ${m.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover-scale-110 group-hover-rotate-3 transition-transform`}>
                                        <Icon size={32} />
                                    </div>
                                    <h3 className="font-bold text-neutral-900">{m.title}</h3>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* HR Simplified Section */}
            <section className="py-24 bg-neutral-50">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1 animate-fade-in relative group">
                        <div className="absolute -inset-4 bg-primary-500-10 rounded-full blur-3xl opacity-0 group-hover-opacity-100 transition-opacity"></div>
                        <img
                            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1000"
                            alt="Simplified HR Management"
                            className="relative z-10 w-full h-auto rounded-3rem shadow-2xl border-4 border-white"
                        />
                    </div>
                    <div className="order-1 lg:order-2">
                        <div className="text-primary-500 font-black text-xs uppercase tracking-widest mb-4">
                            HR MANAGEMENT SIMPLIFIED
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-neutral-900 leading-tight mb-6">
                            Adapt to new realities, work <span className="text-primary-500">faster</span> and smarter.
                        </h2>
                        <p className="text-lg text-neutral-500 mb-10 leading-relaxed font-medium">
                            Determine a defined future of work for your organization with a strong, flexible, global HR solution that grows with you.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Easy access to docs",
                                "Scalable database",
                                "Smart HR workflows",
                                "Process automation"
                            ].map((bullet, i) => (
                                <div key={i} className="flex items-center space-x-3 bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm hover-shadow-md transition-all hover-translate-y-1">
                                    <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <span className="font-extrabold text-neutral-900 text-sm">{bullet}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Showcase */}
            <section className="py-24 bg-neutral-900 text-white rounded-4rem mx-6 mb-24 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-500-5 mix-blend-screen pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="relative order-2 lg:order-1">
                        <div className="absolute -inset-10 bg-primary-500-20 rounded-full blur-100px"></div>
                        <img
                            src="/hrms_dashboard_mockup.png"
                            alt="Dashboard Mockup"
                            className="relative z-10 w-full h-auto rounded-3xl shadow-2xl border-4 border-white-10"
                        />
                    </div>
                    <div className="order-1 lg:order-2">
                        <h2 className="text-4xl lg:text-5xl font-black mb-8 leading-tight">
                            One Unified Dashboard. <br />
                            <span className="text-primary-500 underline decoration-primary-200">Zero Complexity.</span>
                        </h2>
                        <div className="space-y-6">
                            {[
                                { t: 'Smart Analytics', d: 'Real-time insights into employee performance and engagement.' },
                                { t: 'Automated Compliance', d: 'Never worry about tax laws or labour regulations again.' },
                                { t: 'Global Payroll', d: 'Pay your team across 50+ countries in local currencies instantly.' }
                            ].map((f, i) => (
                                <div key={i} className="flex items-start space-x-4">
                                    <div className="mt-1 p-1 bg-primary-500 rounded-full"><CheckCircle2 size={16} /></div>
                                    <div>
                                        <h4 className="font-bold text-xl mb-1">{f.t}</h4>
                                        <p className="text-neutral-400 font-medium">{f.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By - Sliding Carousel */}
            <section className="py-20 bg-white border-y border-neutral-100 overflow-hidden">
                <div className="animate-infinite-scroll flex items-center">
                    {[
                        { name: 'FedEx', logo: '/logos/fedex.png' },
                        { name: 'Coca-Cola', logo: '/logos/cocacola.png' },
                        { name: 'Amazon', logo: '/logos/amazon.png' },
                        { name: 'Domino\'s', logo: '/logos/dominos.png' },
                        { name: 'Olympics', logo: '/logos/olympics.png' },
                        { name: 'Fanta', logo: '/logos/fanta.png' },
                        { name: 'Lacoste', logo: '/logos/lacoste.png' },
                        { name: 'H&M', logo: '/logos/hm.png' },
                        { name: 'Hilton', logo: '/logos/hilton.png' }
                    ].map((company, i) => (
                        <div key={i} className="flex items-center mx-20 opacity-60 hover:opacity-100 transition-all cursor-default">
                            <img src={company.logo} alt={company.name} className="h-12 w-auto object-contain" />
                        </div>
                    ))}
                    {/* Duplicate for infinite loop */}
                    {[
                        { name: 'FedEx', logo: '/logos/fedex.png' },
                        { name: 'Coca-Cola', logo: '/logos/cocacola.png' },
                        { name: 'Amazon', logo: '/logos/amazon.png' },
                        { name: 'Domino\'s', logo: '/logos/dominos.png' },
                        { name: 'Olympics', logo: '/logos/olympics.png' },
                        { name: 'Fanta', logo: '/logos/fanta.png' },
                        { name: 'Lacoste', logo: '/logos/lacoste.png' },
                        { name: 'H&M', logo: '/logos/hm.png' },
                        { name: 'Hilton', logo: '/logos/hilton.png' }
                    ].map((company, i) => (
                        <div key={`dup-${i}`} className="flex items-center mx-20 opacity-60 hover:opacity-100 transition-all cursor-default">
                            <img src={company.logo} alt={company.name} className="h-12 w-auto object-contain" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-neutral-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                    <h2 className="text-4xl font-black text-neutral-900 mb-4">Trusted by HR Leaders</h2>
                    <p className="text-neutral-500 font-bold uppercase tracking-widest text-sm">See what our global partners have to say</p>
                </div>

                <div className="animate-infinite-scroll flex space-x-8 px-6">
                    {[
                        { name: "Sarah Miller", role: "HR Director at TechFlow", text: "CosmicHR transformed how we handle global payroll. A total game changer for our 500+ team." },
                        { name: "David Chen", role: "CEO of NovaSoft", text: "The onboarding flow is seamless. Our new hires feel like part of the family from day one." },
                        { name: "Elena Rodriguez", role: "Head of Talent at GlobalLink", text: "Smart workflows saved us 20+ hours a week on manual tasks. Worth every penny." },
                        { name: "Marcus Thorne", role: "Operations Lead at Zenith", text: "The most beautiful and intuitive HRMS I have ever used. My team actually loves using it." },
                        { name: "Jessica Wu", role: "VP of People at CloudScale", text: "Scalability was our main concern, and CosmicHR delivered beyond our expectations." }
                    ].map((t, i) => (
                        <div key={i} className="w-[450px] flex-shrink-0 bg-white p-10 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl transition-all mt-8">
                            <div className="flex text-primary-500 mb-6">
                                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                            </div>
                            <p className="text-neutral-600 font-medium text-lg leading-relaxed mb-8 italic">"{t.text}"</p>
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-black">{t.name[0]}</div>
                                <div>
                                    <h4 className="font-bold text-neutral-900">{t.name}</h4>
                                    <p className="text-neutral-400 text-xs font-bold uppercase">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Duplicate for infinite loop */}
                    {[
                        { name: "Sarah Miller", role: "HR Director at TechFlow", text: "CosmicHR transformed how we handle global payroll. A total game changer for our 500+ team." },
                        { name: "David Chen", role: "CEO of NovaSoft", text: "The onboarding flow is seamless. Our new hires feel like part of the family from day one." },
                        { name: "Elena Rodriguez", role: "Head of Talent at GlobalLink", text: "Smart workflows saved us 20+ hours a week on manual tasks. Worth every penny." },
                        { name: "Marcus Thorne", role: "Operations Lead at Zenith", text: "The most beautiful and intuitive HRMS I have ever used. My team actually loves using it." },
                        { name: "Jessica Wu", role: "VP of People at CloudScale", text: "Scalability was our main concern, and CosmicHR delivered beyond our expectations." }
                    ].map((t, i) => (
                        <div key={`dup-${i}`} className="w-[450px] flex-shrink-0 bg-white p-10 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl transition-all mt-8">
                            <div className="flex text-primary-500 mb-6">
                                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                            </div>
                            <p className="text-neutral-600 font-medium text-lg leading-relaxed mb-8 italic">"{t.text}"</p>
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-black">{t.name[0]}</div>
                                <div>
                                    <h4 className="font-bold text-neutral-900">{t.name}</h4>
                                    <p className="text-neutral-400 text-xs font-bold uppercase">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white text-center">
                <div className="max-w-4xl mx-auto px-6 bg-primary-50 rounded-3rem p-16 border border-primary-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-primary-200-20 rounded-full -ml-16 -mt-16 blur-2xl"></div>
                    <h2 className="text-4xl font-black text-neutral-900 mb-6">Ready to transform your workplace?</h2>
                    <p className="text-xl text-neutral-500 mb-10 max-w-xl mx-auto">Join over 5,000+ companies that trust CosmicHR to build a better future for their employees.</p>
                    <button
                        onClick={() => setCurrentPage('dashboard')}
                        className="px-12 py-6 bg-primary-500 text-white font-black rounded-2xl shadow-2xl shadow-primary-500-20 hover-bg-primary-600 transition-all hover-scale-105"
                    >
                        Get Started for Free
                    </button>
                    <p className="mt-6 text-sm font-bold text-neutral-400">No credit card required • 14-day free trial</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-neutral-50 border-t border-neutral-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center space-x-3 mb-8">
                        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white">
                            <BarChart3 size={24} />
                        </div>
                        <span className="text-2xl font-black text-neutral-900 tracking-tight">Cosmic<span className="text-primary-500">HR</span></span>
                    </div>
                    <p className="text-neutral-400 font-bold text-sm">© 2026 Cosmic Tech Enterprise. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
