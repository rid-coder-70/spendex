import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Code2, Palette, Server, ArrowRight, MapPin, Clock } from 'lucide-react';

const openRoles = [
  {
    title: 'Full-Stack Engineer (Next.js + Node.js)',
    type: 'Full-time · Remote',
    location: 'Bangladesh / Remote',
    icon: Code2,
    desc: 'Build new product features end-to-end. You\'ll work across the React frontend, Express API, and PostgreSQL database.',
    requirements: ['2+ years with Next.js or React', 'Node.js / Express experience', 'PostgreSQL basics', 'TypeScript comfort'],
  },
  {
    title: 'UI/UX Designer',
    type: 'Part-time · Remote',
    location: 'Remote',
    icon: Palette,
    desc: 'Own the visual design system and UX of SpendGuard. Work closely with the founder to define and implement the product look and feel.',
    requirements: ['Figma proficiency', 'Strong eye for clean, minimal UI', 'Understanding of web accessibility', 'Fintech or SaaS experience a plus'],
  },
  {
    title: 'Backend / DevOps Engineer',
    type: 'Contract · Remote',
    location: 'Remote',
    icon: Server,
    desc: 'Help harden the infrastructure — CI/CD, Docker, cloud deployments, and scaling the PostgreSQL backend for growth.',
    requirements: ['Docker + docker-compose', 'GitHub Actions CI/CD', 'PostgreSQL performance tuning', 'Railway / Render / AWS experience'],
  },
];

const perks = [
  'Fully remote — work from anywhere',
  'Flexible hours — async-first culture',
  'Ownership — you ship features end-to-end',
  'Open source — contribute to public projects',
  'Equity participation for early team members',
  'Learning budget for courses & conferences',
];

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">

        {/* Hero */}
        <section className="px-6 pb-16 border-b border-zinc-100 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200 text-xs font-medium text-emerald-600 bg-emerald-50 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              We&apos;re hiring
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight leading-tight mb-4">
              Build the future of<br />
              <span className="text-blue-600">personal finance</span>
            </h1>
            <p className="text-base text-zinc-500 leading-relaxed max-w-xl mx-auto">
              We&apos;re a small, ambitious team building tools that genuinely help people understand and control their money. Join us remotely from anywhere.
            </p>
          </div>
        </section>

        {/* Perks */}
        <section className="py-16 px-6 bg-zinc-50 border-b border-zinc-100">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-xl font-bold text-zinc-900">Why work at SpendGuard?</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {perks.map(perk => (
                <div key={perk} className="flex items-center gap-3 bg-white border border-zinc-100 rounded-xl px-4 py-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-sm text-zinc-700">{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Roles */}
        <section className="py-16 px-6 border-b border-zinc-100">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Open positions</p>
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{openRoles.length} roles open now</h2>
            </div>
            <div className="space-y-5">
              {openRoles.map(({ title, type, location, icon: Icon, desc, requirements }) => (
                <div key={title} className="card p-6 hover:border-zinc-300 transition-all">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-zinc-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-sm font-semibold text-zinc-900 mb-1">{title}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {type}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {location}</span>
                          </div>
                        </div>
                        <a
                          href={`mailto:ridoybaidya2@gmail.com?subject=Application: ${encodeURIComponent(title)}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white text-xs font-medium rounded-lg hover:bg-zinc-800 transition-colors shrink-0"
                        >
                          Apply <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed mb-3">{desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {requirements.map(r => (
                          <span key={r} className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] font-medium rounded">{r}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-3">Don&apos;t see your role?</h2>
            <p className="text-sm text-zinc-500 mb-6">
              We&apos;re always open to hearing from talented people. Send us an introduction and tell us how you&apos;d contribute.
            </p>
            <a
              href="mailto:ridoybaidya2@gmail.com?subject=General Application - SpendGuard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Send an introduction <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
