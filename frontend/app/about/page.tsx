import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Heart, Target, Lightbulb, Users, ArrowRight, Code2, Globe, Mail } from 'lucide-react';

const values = [
  { icon: Heart, title: 'Built with care', desc: 'Every feature in SpendGuard was built by someone who wanted better personal finance tooling — not just another CRUD app.', color: 'bg-rose-50 text-rose-500' },
  { icon: Target, title: 'Focused on clarity', desc: 'We believe financial software should show you exactly what you need and hide everything that distracts you.', color: 'bg-blue-50 text-blue-500' },
  { icon: Lightbulb, title: 'Smart by default', desc: 'Auto-categorization, subscription detection, trend forecasting — intelligence that works without manual configuration.', color: 'bg-amber-50 text-amber-500' },
  { icon: Users, title: 'Privacy first', desc: 'We don\'t sell your data, share it with third parties, or use it for advertising. Your finances are your business.', color: 'bg-emerald-50 text-emerald-500' },
];

const team = [
  {
    name: 'Ridoy Baidya',
    role: 'Founder & Full-Stack Engineer',
    bio: 'Computer Science student at SUST. Built SpendGuard to solve real personal finance pain points using modern web technologies.',
    initials: 'RB',
    github: 'https://github.com/rid-coder-70',
    linkedin: '#',
    email: 'ridoybaidya2@gmail.com',
  },
];

const milestones = [
  { year: '2026 Q1', event: 'SpendGuard MVP launched with core transaction tracking' },
  { year: '2026 Q2', event: 'CSV import, subscription detection & email reports added' },
  { year: '2026 Q2', event: 'Webhook integration, Docker support & CI/CD pipeline shipped' },
  { year: '2026 Q3', event: 'Pro & Team plans launching — expanding to regional markets' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">

        {/* Hero */}
        <section className="px-6 pb-16 border-b border-zinc-100 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200 text-xs font-medium text-zinc-500 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              Our story
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight leading-tight mb-4">
              Built by someone who<br />
              <span className="text-blue-600">needed it too</span>
            </h1>
            <p className="text-base text-zinc-500 leading-relaxed max-w-xl mx-auto">
              SpendGuard started as a personal project to replace messy spreadsheets. It became a full-stack platform after realizing how many people had the same problem.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 px-6 border-b border-zinc-100">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10 text-center">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Our values</p>
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">What we stand for</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {values.map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="card p-6 hover:border-zinc-300 transition-all">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color.split(' ')[0]}`}>
                    <Icon className={`w-5 h-5 ${color.split(' ')[1]}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900 mb-2">{title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 px-6 border-b border-zinc-100">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10 text-center">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">The team</p>
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">The people behind SpendGuard</h2>
            </div>
            <div className="flex justify-center">
              {team.map(({ name, role, bio, initials, github, linkedin, email }) => (
                <div key={name} className="card p-8 max-w-sm w-full text-center">
                  <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {initials}
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 mb-0.5">{name}</h3>
                  <p className="text-xs text-blue-600 font-medium mb-3">{role}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-5">{bio}</p>
                  <div className="flex justify-center gap-3">
                    <a href={github} target="_blank" rel="noreferrer" className="p-2 rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 transition-colors">
                      <Code2 className="w-4 h-4" />
                    </a>
                    <a href={linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 transition-colors">
                      <Globe className="w-4 h-4" />
                    </a>
                    <a href={`mailto:${email}`} className="p-2 rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 transition-colors">
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="py-16 px-6 bg-zinc-50 border-b border-zinc-100">
          <div className="max-w-2xl mx-auto">
            <div className="mb-10 text-center">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Timeline</p>
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Our journey</h2>
            </div>
            <div className="space-y-4">
              {milestones.map(({ year, event }) => (
                <div key={event} className="flex gap-4 items-start">
                  <div className="shrink-0 w-20 text-right">
                    <span className="text-xs font-semibold text-blue-600">{year}</span>
                  </div>
                  <div className="w-px bg-zinc-200 self-stretch mx-2" />
                  <p className="text-sm text-zinc-700 leading-relaxed pb-4">{event}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-3">Join thousands already using SpendGuard</h2>
            <p className="text-sm text-zinc-500 mb-6">Start for free. No card required. Be in control of your money.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors">
                Get started free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/careers" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-zinc-700 text-sm font-medium border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
                We&apos;re hiring →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
