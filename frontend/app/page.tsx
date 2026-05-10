'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { publicAPI, PublicStats } from '@/lib/api/public';
import { 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  PieChart, 
  Smartphone, 
  RefreshCcw,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await publicAPI.getStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 md:pt-48 md:pb-64 overflow-hidden bg-slate-950">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute -top-24 -left-24 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary-600/20 rounded-full blur-[100px] md:blur-[160px] animate-pulse"></div>
            <div className="absolute top-1/2 -right-24 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-secondary-600/20 rounded-full blur-[100px] md:blur-[140px] animate-pulse [animation-delay:2s]"></div>
            <div className="absolute bottom-0 left-1/4 w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
              <div className="max-w-2xl text-left animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-primary-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 md:mb-8 animate-slide-up">
                  <span className="flex h-1.5 md:h-2 w-1.5 md:w-2 rounded-full bg-primary-500 animate-pulse"></span>
                  Revolutionizing Personal Finance
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-white mb-6 md:mb-8 tracking-tighter leading-[1.1] md:leading-[0.9]">
                  Smart Tracking. <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Better Saving.</span>
                </h1>
                
                <p className="text-lg md:text-2xl text-slate-400 mb-8 md:mb-12 leading-relaxed max-w-xl font-medium">
                  Experience the next generation of wealth management. SpendGuard turns your data into clear, actionable financial intelligence.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 animate-slide-up [animation-delay:200ms]">
                  <Link
                    href="/auth/register"
                    className="group px-8 md:px-10 py-4 md:py-5 bg-primary-600 text-white rounded-2xl md:rounded-[2rem] font-black text-base md:text-lg shadow-2xl shadow-primary-600/40 hover:bg-primary-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="px-8 md:px-10 py-4 md:py-5 bg-white/5 text-white border border-white/10 rounded-2xl md:rounded-[2rem] font-black text-base md:text-lg hover:bg-white/10 transition-all backdrop-blur-md flex items-center justify-center gap-3"
                  >
                    Explore Features
                  </Link>
                </div>

                <div className="mt-12 md:mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 animate-fade-in [animation-delay:400ms]">
                  <div className="flex -space-x-2 md:-space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 md:border-4 border-slate-950 bg-slate-800 flex items-center justify-center font-bold text-[10px] md:text-xs text-white">
                        U{i}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs md:text-sm">
                    <p className="text-white font-bold">Join {stats?.totalUsers.toLocaleString() || '50,000'}+ users</p>
                    <p className="text-slate-500 font-medium">Tracking ${((stats?.monthlyVolume || 2000000) / 1000000).toFixed(1)}M+ monthly</p>
                  </div>
                </div>
              </div>

              {/* CSS Hero Mockup */}
              <div className="hidden lg:block relative animate-scale-in [animation-delay:300ms]">
                <div className="relative z-10 bg-slate-900/50 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 shadow-[0_0_80px_-20px_rgba(37,99,235,0.3)] animate-float">
                  {/* Mockup Header */}
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500/20"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                    </div>
                    <div className="h-2 w-32 bg-white/5 rounded-full"></div>
                  </div>

                  {/* Mockup Content */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="h-32 rounded-3xl bg-primary-600/10 border border-primary-500/20 p-6">
                      <div className="w-8 h-8 rounded-xl bg-primary-600 mb-4"></div>
                      <div className="h-2 w-16 bg-white/20 rounded-full mb-2"></div>
                      <div className="h-3 w-10 bg-white/40 rounded-full"></div>
                    </div>
                    <div className="h-32 rounded-3xl bg-secondary-600/10 border border-secondary-500/20 p-6">
                      <div className="w-8 h-8 rounded-xl bg-secondary-600 mb-4"></div>
                      <div className="h-2 w-16 bg-white/20 rounded-full mb-2"></div>
                      <div className="h-3 w-10 bg-white/40 rounded-full"></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-800"></div>
                          <div className="space-y-2">
                            <div className="h-2 w-24 bg-white/20 rounded-full"></div>
                            <div className="h-2 w-16 bg-white/10 rounded-full"></div>
                          </div>
                        </div>
                        <div className="h-2 w-12 bg-white/30 rounded-full"></div>
                      </div>
                    ))}
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] flex flex-col items-center justify-center shadow-2xl animate-float [animation-delay:1s]">
                    <TrendingUp className="w-10 h-10 text-green-400 mb-2" />
                    <span className="text-xs font-black text-white">+24%</span>
                  </div>
                </div>

                {/* Background Glows */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-[3.1rem] blur-2xl opacity-20 -z-10 animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32 bg-white px-6">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 animate-fade-in">
              <h2 className="text-primary-600 font-black tracking-widest uppercase text-[10px] md:text-sm mb-4">The Platform</h2>
              <h3 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 md:mb-8 tracking-tighter leading-tight">Engineered for growth</h3>
              <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-medium">
                We've combined world-class data engineering with an obsession for user experience. The result is SpendGuard.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {[
                {
                  title: 'AI Smart Tracking',
                  desc: 'Our proprietary algorithms categorize your life automatically, so you don\'t have to.',
                  icon: Zap,
                  color: 'bg-primary-50 text-primary-600'
                },
                {
                  title: 'Predictive Insights',
                  desc: 'Forecast your future wealth with data-driven projections and trend analysis.',
                  icon: PieChart,
                  color: 'bg-slate-100 text-slate-900'
                },
                {
                  title: 'Fortress Security',
                  desc: 'Military-grade encryption and privacy controls keep your financial data strictly yours.',
                  icon: ShieldCheck,
                  color: 'bg-green-50 text-green-600'
                },
                {
                  title: 'Global Sync',
                  desc: 'Connect accounts globally and see your entire financial world in real-time.',
                  icon: RefreshCcw,
                  color: 'bg-amber-50 text-amber-600'
                },
                {
                  title: 'Hyper Responsive',
                  desc: 'The fastest, most fluid financial experience on any device, anywhere.',
                  icon: Smartphone,
                  color: 'bg-rose-50 text-rose-600'
                },
                {
                  title: 'Goal Mastery',
                  desc: 'Transform dreams into reality with precise budget tracking and goal setting.',
                  icon: TrendingUp,
                  color: 'bg-indigo-50 text-indigo-600'
                }
              ].map((feature, idx) => (
                <div key={idx} className="p-8 md:p-10 rounded-3xl md:rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[1.5rem] ${feature.color} flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform shadow-sm`}>
                    <feature.icon className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <h4 className="text-xl md:text-2xl font-black text-slate-900 mb-4 tracking-tight">{feature.title}</h4>
                  <p className="text-sm md:text-base text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-32 bg-slate-950 px-6 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600 rounded-full blur-[140px]"></div>
          </div>

          <div className="container mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 animate-fade-in">
              <h2 className="text-primary-400 font-black tracking-widest uppercase text-[10px] md:text-sm mb-4">The Workflow</h2>
              <h3 className="text-4xl md:text-7xl font-black text-white mb-6 md:mb-8 tracking-tighter leading-tight">How it works</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative">
              {[
                {
                  step: '01',
                  title: 'Secure Link',
                  desc: 'Create your account and link your financial data with one click.',
                  icon: Smartphone
                },
                {
                  step: '02',
                  title: 'Data Engine',
                  desc: 'Our engine processes and cleans your transaction history.',
                  icon: RefreshCcw
                },
                {
                  step: '03',
                  title: 'AI Analysis',
                  desc: 'Insights and trends are generated based on your habits.',
                  icon: PieChart
                },
                {
                  step: '04',
                  title: 'Mastery',
                  desc: 'You gain total control and start growing your net worth.',
                  icon: TrendingUp
                }
              ].map((item, idx) => (
                <div key={idx} className="relative group animate-slide-up" style={{ animationDelay: `${idx * 150}ms` }}>
                  <div className="text-[8rem] md:text-[12rem] font-black text-white/5 absolute -top-12 md:-top-24 left-0 leading-none group-hover:text-primary-500/10 transition-colors">
                    {item.step}
                  </div>
                  <div className="relative pt-8 md:pt-12">
                    <h4 className="text-xl md:text-2xl font-black text-white mb-4 tracking-tight">{item.title}</h4>
                    <p className="text-sm md:text-base text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-32 bg-white px-6">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 md:mb-24 gap-8 md:gap-10 animate-fade-in">
              <div className="max-w-2xl">
                <h2 className="text-primary-600 font-black tracking-widest uppercase text-[10px] md:text-sm mb-4">Wall of Love</h2>
                <h3 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">Trusted by the best</h3>
              </div>
              <div className="px-6 md:px-8 py-4 md:py-6 bg-slate-950 rounded-2xl md:rounded-[2rem] text-white shadow-2xl">
                <p className="text-3xl md:text-4xl font-black mb-1 tracking-tighter">{stats?.rating || '4.9'}/5</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Rating</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {[
                {
                  quote: "SpendGuard is the first finance app that doesn't feel like a chore. It's actually a joy to use daily.",
                  author: "Sarah Jenkins",
                  role: "Product Designer @ Linear",
                  avatar: "SJ"
                },
                {
                  quote: "The predictive analytics saved me from making three bad investment decisions in my first month.",
                  author: "Michael Chen",
                  role: "Founder @ TechFlow",
                  avatar: "MC"
                },
                {
                  quote: "Unmatched speed and security. It's the standard for how fintech should feel in 2026.",
                  author: "Emma Rodriguez",
                  role: "Venture Partner",
                  avatar: "ER"
                }
              ].map((t, idx) => (
                <div key={idx} className="p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-slate-50 border border-slate-100 hover:bg-primary-600 transition-all duration-700 group animate-slide-up" style={{ animationDelay: `${idx * 200}ms` }}>
                  <p className="text-lg md:text-2xl text-slate-800 group-hover:text-white leading-relaxed mb-8 md:mb-12 relative z-10 font-bold tracking-tight italic">"{t.quote}"</p>
                  <div className="flex items-center gap-4 md:gap-6 relative z-10 border-t border-slate-200 group-hover:border-white/20 pt-6 md:pt-8">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white shadow-lg text-primary-600 group-hover:bg-white/20 group-hover:text-white flex items-center justify-center font-black text-sm md:text-lg shrink-0">
                      {t.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-slate-900 group-hover:text-white text-base md:text-lg truncate">{t.author}</p>
                      <p className="text-[8px] md:text-sm text-slate-500 group-hover:text-white/60 font-bold uppercase tracking-widest truncate">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6">
          <div className="container mx-auto">
            <div className="bg-primary-600 rounded-[4rem] p-12 md:p-32 text-center relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(37,99,235,0.6)] animate-fade-in">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2"></div>
              
              <h3 className="text-5xl md:text-8xl font-black text-white mb-10 relative z-10 tracking-tighter leading-none">
                Start your legacy <br/> of wealth today.
              </h3>
              <p className="text-2xl text-primary-100 mb-16 max-w-2xl mx-auto relative z-10 font-medium leading-relaxed">
                No contracts. No hidden fees. Just total financial clarity.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                <Link
                  href="/auth/register"
                  className="px-12 py-6 bg-white text-primary-600 rounded-[2.5rem] font-black text-xl hover:bg-primary-50 hover:scale-105 transition-all shadow-2xl"
                >
                  Join SpendGuard
                </Link>
                <Link
                  href="#"
                  className="px-12 py-6 bg-primary-700 text-white rounded-[2.5rem] font-black text-xl hover:bg-primary-800 transition-all border border-primary-500/50"
                >
                  Book a Demo
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}