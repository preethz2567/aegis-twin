import React from 'react';
import { Link } from 'react-router-dom';
import { Network, Crosshair, ListChecks, MessageSquare } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-[#0A0F0F] min-h-screen font-sans text-gray-300 selection:bg-teal-500/30">
      
      {/* SECTION 1: HERO */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 text-sm text-gray-300">
            We Hack 5.0 Finalist
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white">
            AEGIS-TWIN
          </h1>
          
          <h2 className="text-xl md:text-2xl text-teal-400 max-w-2xl">
            Autonomous Digital Twin for Adversarial Path Simulation & Optimal Defense Orchestration
          </h2>
          
          <p className="text-gray-400 max-w-xl text-lg">
            AEGIS-TWIN helps security analysts see which vulnerability actually matters most — by simulating how an attacker would move through the network, then recommending the fixes that block the most damage.
          </p>
          
          <div className="flex gap-4 mt-4">
            <Link to="/dashboard" className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition">
              Launch Dashboard
            </Link>
            {/* https://github.com/your-org/aegis-twin */}
            <a href="https://github.com/your-org/aegis-twin" target="_blank" rel="noreferrer" className="px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition">
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2: PROBLEM */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-4 text-left">
              <span className="text-teal-400 text-sm font-semibold tracking-wide uppercase">
                The Problem
              </span>
              <h2 className="text-4xl font-bold text-white">
                A single compromised component can expose thousands of systems.
              </h2>
              <p className="text-gray-400 text-lg">
                In March 2025, a supply-chain attack on the tj-actions/changed-files GitHub Action affected over 23,000 repositories worldwide. This documented incident proves that minor, seemingly isolated vulnerabilities in CI/CD pipelines can act as immediate stepping stones into core production infrastructure.
              </p>
            </div>
            
            <div className="w-full border border-red-500/30 rounded-xl p-10 bg-red-500/5 flex flex-col items-center justify-center text-center gap-2">
              <span className="text-6xl md:text-7xl font-bold text-white">23,000+</span>
              <span className="text-gray-400 text-lg">Repositories Affected</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: TERMINAL MOCKUP */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border border-white/10 bg-[#0d0d0f] overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.03]">
              <span className="w-3 h-3 rounded-full bg-red-500/60"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/60"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/60"></span>
              <span className="text-gray-500 text-sm mx-auto">bash</span>
            </div>
            <div className="p-8 font-mono text-sm leading-relaxed whitespace-pre-wrap text-white">
              <span className="text-gray-500">$</span> curl https://api.aegis-twin.dev/simulate/attack-path<br/><br/>
              {"{"}<br/>
              &nbsp;&nbsp;<span className="text-teal-400">"status"</span>: <span className="text-teal-400">"success"</span>,<br/>
              &nbsp;&nbsp;<span className="text-teal-400">"entry_point"</span>: <span className="text-teal-400">"Admin Workstation"</span>,<br/>
              &nbsp;&nbsp;<span className="text-teal-400">"target"</span>: <span className="text-teal-400">"Production Database"</span>,<br/>
              &nbsp;&nbsp;<span className="text-teal-400">"risk_score"</span>: <span className="text-yellow-400">5.47</span>,<br/>
              &nbsp;&nbsp;<span className="text-teal-400">"hop_sequence"</span>: [<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-teal-400">"Admin Workstation (workstation)"</span>,<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-teal-400">"CI/CD Runner (ci-cd-runner)"</span>,<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-teal-400">"App Server (server)"</span>,<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-teal-400">"Production Database (database)"</span><br/>
              &nbsp;&nbsp;]<br/>
              {"}"}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-12">
            <h2 className="text-3xl font-bold text-white text-center">
              From Network to Action in Four Steps
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="border border-white/10 rounded-lg p-6 flex flex-col gap-3 hover:border-white/25 transition bg-white/[0.02]">
                <Network className="w-7 h-7 text-teal-400" />
                <h3 className="text-lg font-semibold text-white">Map</h3>
                <p className="text-gray-400 text-sm">Visualize your live network threat topology and crown jewels.</p>
              </div>
              
              <div className="border border-white/10 rounded-lg p-6 flex flex-col gap-3 hover:border-white/25 transition bg-white/[0.02]">
                <Crosshair className="w-7 h-7 text-teal-400" />
                <h3 className="text-lg font-semibold text-white">Simulate</h3>
                <p className="text-gray-400 text-sm">Uncover the highest-risk attack paths through your infrastructure.</p>
              </div>
              
              <div className="border border-white/10 rounded-lg p-6 flex flex-col gap-3 hover:border-white/25 transition bg-white/[0.02]">
                <ListChecks className="w-7 h-7 text-teal-400" />
                <h3 className="text-lg font-semibold text-white">Optimize</h3>
                <p className="text-gray-400 text-sm">Compute the most effective fixes to cut risk with minimal effort.</p>
              </div>
              
              <div className="border border-white/10 rounded-lg p-6 flex flex-col gap-3 hover:border-white/25 transition bg-white/[0.02]">
                <MessageSquare className="w-7 h-7 text-teal-400" />
                <h3 className="text-lg font-semibold text-white">Explain</h3>
                <p className="text-gray-400 text-sm">Translate complex vulnerabilities into plain English executive summaries.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FOOTER */}
      <section className="py-24 md:py-32 px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <footer className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col gap-1 text-center md:text-left">
              <span className="text-white font-bold">AEGIS-TWIN</span>
              <span className="text-gray-500 text-sm">Built for We Hack 5.0</span>
            </div>
            
            <div className="flex gap-6 text-gray-400 text-sm">
              <a href="https://github.com/your-org/aegis-twin" target="_blank" rel="noreferrer" className="hover:text-white transition">GitHub</a>
              <Link to="/dashboard" className="hover:text-white transition">Dashboard</Link>
            </div>
          </footer>
        </div>
      </section>
      
    </div>
  );
};

export default LandingPage;
