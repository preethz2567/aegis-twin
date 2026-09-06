import React, { useState, useEffect } from 'react';
import { Shield, Network, Zap, Target, MessageSquare, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Shared classes
  const glowShadow = "shadow-[0_0_30px_rgba(0,245,212,0.3)]";
  const glowHover = "hover:shadow-[0_0_50px_rgba(0,245,212,0.5)] transition-shadow duration-300";
  const textGlow = "drop-shadow-[0_0_10px_rgba(0,245,212,0.6)]";
  const fontHeading = "font-['Space_Grotesk',sans-serif] tracking-tight";
  const fontBody = "font-['Inter',sans-serif]";

  return (
    <div className={`min-h-screen bg-[#0A0F0F] text-white ${fontBody} overflow-x-hidden selection:bg-[#00F5D4] selection:text-[#0A0F0F]`}>
      
      {/* Background Texture - Circuit/Grid */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #00F5D4 1px, transparent 1px),
            linear-gradient(to bottom, #00F5D4 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* 1. NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A0F0F]/90 backdrop-blur-md border-b border-[#00F5D4]/20 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className={`text-xl font-bold ${fontHeading} text-white flex items-center gap-2 hover:${textGlow} transition-all duration-300 cursor-pointer`}>
            <Shield className="text-[#00F5D4]" size={24} />
            AEGIS-TWIN
          </div>
          <div className="hidden md:flex items-center gap-8 text-[#8A9B99] font-medium text-sm">
            <a href="#product" className="hover:text-white transition-colors">Product</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#tech" className="hover:text-white transition-colors">Tech</a>
            <a href="#docs" className="hover:text-white transition-colors">Docs</a>
          </div>
          <button className={`bg-[#00F5D4] text-[#0A0F0F] px-5 py-2 rounded-md font-semibold text-sm ${glowShadow} ${glowHover}`}>
            Request Demo
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 px-6 z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
        
        {/* Animated Background SVG */}
        <div className="absolute inset-0 -z-10 flex justify-center items-center opacity-30 pointer-events-none">
          <svg className="w-full h-full max-w-4xl animate-[pulse_6s_ease-in-out_infinite]" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="4" fill="#8A9B99" />
            <circle cx="400" cy="150" r="6" fill="#00F5D4" className="animate-[ping_3s_ease-in-out_infinite]" />
            <circle cx="600" cy="250" r="4" fill="#8A9B99" />
            <circle cx="300" cy="300" r="4" fill="#8A9B99" />
            <circle cx="500" cy="100" r="4" fill="#8A9B99" />
            
            <line x1="200" y1="200" x2="400" y2="150" stroke="#00F5D4" strokeWidth="2" strokeOpacity="0.8" />
            <line x1="400" y1="150" x2="600" y2="250" stroke="#00F5D4" strokeWidth="2" strokeOpacity="0.8" />
            <line x1="200" y1="200" x2="300" y2="300" stroke="#8A9B99" strokeWidth="1" strokeOpacity="0.3" />
            <line x1="300" y1="300" x2="600" y2="250" stroke="#8A9B99" strokeWidth="1" strokeOpacity="0.3" />
            <line x1="400" y1="150" x2="500" y2="100" stroke="#8A9B99" strokeWidth="1" strokeOpacity="0.3" />
          </svg>
        </div>

        <div className="inline-flex items-center gap-2 border border-[#00F5D4]/30 bg-[#00F5D4]/5 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#00F5D4] animate-pulse"></span>
          <span className="text-[#00F5D4] text-xs font-semibold uppercase tracking-wider">Live Simulation Engine</span>
        </div>
        
        <h1 className={`text-5xl md:text-7xl font-bold mb-6 text-white leading-tight ${fontHeading}`}>
          See the Attack <br className="hidden md:block"/> Before It Happens
        </h1>
        
        <p className="text-lg md:text-xl text-[#8A9B99] max-w-3xl mb-10 leading-relaxed">
          AEGIS-TWIN simulates how an attacker would move through your network, then tells you exactly which fixes stop the most damage.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button className={`bg-[#00F5D4] text-[#0A0F0F] px-8 py-3.5 rounded-md font-bold text-base ${glowShadow} ${glowHover}`}>
            Request Demo
          </button>
          <button className={`border border-[#00F5D4] text-[#00F5D4] bg-transparent px-8 py-3.5 rounded-md font-bold text-base hover:bg-[#00F5D4]/10 transition-colors duration-300`}>
            View Architecture
          </button>
        </div>
      </section>

      {/* 3. PROBLEM SECTION */}
      <section id="problem" className="py-24 px-6 z-10 relative bg-[#0D3B36]/10 border-y border-[#00F5D4]/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#00F5D4] text-sm font-bold uppercase tracking-[0.2em] mb-4 block">THE PROBLEM</span>
            <h2 className={`text-3xl md:text-5xl font-bold text-white max-w-4xl mx-auto ${fontHeading}`}>
              Vulnerability Scanners Show What's Broken.<br className="hidden md:block"/> Not What It Can Reach.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#050A0A] border border-[#00F5D4]/20 p-8 rounded-lg hover:border-[#00F5D4]/60 transition-colors duration-300 hover:shadow-[0_0_20px_rgba(0,245,212,0.1)] group">
              <Zap className="text-[#00F5D4] mb-6 group-hover:scale-110 transition-transform duration-300" size={32} />
              <p className="text-lg text-white font-medium leading-relaxed">
                Scanners rank flaws in isolation, not attack sequences.
              </p>
            </div>
            <div className="bg-[#050A0A] border border-[#00F5D4]/20 p-8 rounded-lg hover:border-[#00F5D4]/60 transition-colors duration-300 hover:shadow-[0_0_20px_rgba(0,245,212,0.1)] group">
              <Target className="text-[#00F5D4] mb-6 group-hover:scale-110 transition-transform duration-300" size={32} />
              <p className="text-lg text-white font-medium leading-relaxed">
                Teams can't patch everything — and don't know what matters most.
              </p>
            </div>
            <div className="bg-[#050A0A] border border-[#00F5D4]/20 p-8 rounded-lg hover:border-[#00F5D4]/60 transition-colors duration-300 hover:shadow-[0_0_20px_rgba(0,245,212,0.1)] group">
              <Shield className="text-[#00F5D4] mb-6 group-hover:scale-110 transition-transform duration-300" size={32} />
              <p className="text-lg text-white font-medium leading-relaxed">
                Existing tools show risk. None show the optimal fix.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-32 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className={`text-3xl md:text-5xl font-bold text-white mb-20 ${fontHeading}`}>
            From Network to Action in Four Steps
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-[#00F5D4]/50 to-transparent z-0"></div>
            
            {[
              { icon: Network, title: 'Map', desc: 'Ingest live topology & crowns jewels' },
              { icon: Target, title: 'Simulate', desc: 'Run thousands of attack path scenarios' },
              { icon: Zap, title: 'Optimize', desc: 'Compute fixes that cut the most risk' },
              { icon: MessageSquare, title: 'Explain', desc: 'Translate graphs into executive reports' }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center w-full md:w-1/4">
                <div className={`w-20 h-20 rounded-full bg-[#050A0A] border-2 border-[#00F5D4] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,245,212,0.2)]`}>
                  <step.icon className="text-[#00F5D4]" size={32} />
                </div>
                <h3 className={`text-xl font-bold text-white mb-2 ${fontHeading}`}>{step.title}</h3>
                <p className="text-[#8A9B99] text-sm leading-relaxed max-w-[200px] mx-auto">
                  {step.desc}
                </p>
                
                {/* Connecting arrow for Mobile */}
                {idx < 3 && (
                  <ArrowRight className="md:hidden text-[#00F5D4]/30 mt-8 mb-4" size={24} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LIVE DASHBOARD PREVIEW */}
      <section className="py-20 px-6 z-10 relative">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className={`text-3xl md:text-5xl font-bold text-white mb-12 ${fontHeading}`}>
            Watch the Attack Surface Shrink in Real Time
          </h2>
          
          <div className="relative rounded-xl border border-[#00F5D4]/30 bg-[#050A0A] shadow-[0_0_50px_rgba(0,245,212,0.15)] overflow-hidden">
            {/* Fake Browser Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#00F5D4]/10 bg-[#0D3B36]/30">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
              <div className="ml-4 text-xs text-[#8A9B99] font-mono">dashboard.aegis-twin.internal</div>
            </div>
            
            {/* Dashboard Mockup Content */}
            <div className="flex flex-col md:flex-row h-[500px]">
              <div className="flex-1 relative flex items-center justify-center p-8 border-r border-[#00F5D4]/10 bg-[radial-gradient(ellipse_at_center,rgba(0,245,212,0.05)_0%,transparent_70%)]">
                {/* SVG Graph Mockup */}
                <svg className="w-full h-full" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Background edges */}
                  <line x1="100" y1="200" x2="250" y2="100" stroke="#8A9B99" strokeWidth="1" strokeOpacity="0.2" />
                  <line x1="250" y1="100" x2="400" y2="150" stroke="#8A9B99" strokeWidth="1" strokeOpacity="0.2" />
                  
                  {/* Active Attack Path */}
                  <path d="M100 200 L300 250 L500 200" stroke="#FF4D4D" strokeWidth="3" strokeOpacity="0.8" strokeDasharray="6 6" className="animate-[dash_1s_linear_infinite]" />
                  
                  {/* Nodes */}
                  <circle cx="100" cy="200" r="16" fill="#0D3B36" stroke="#00F5D4" strokeWidth="2" />
                  <text x="100" y="235" fill="#8A9B99" fontSize="12" textAnchor="middle" className="font-mono">Entry: Web</text>
                  
                  <circle cx="250" cy="100" r="12" fill="#0A0F0F" stroke="#8A9B99" strokeWidth="1" />
                  
                  <circle cx="300" cy="250" r="18" fill="#4D1A1A" stroke="#FF4D4D" strokeWidth="2" className="shadow-[0_0_20px_rgba(255,77,77,0.5)]" />
                  <text x="300" y="285" fill="#FF4D4D" fontSize="12" textAnchor="middle" className="font-mono">CVE-2023-XXXX</text>
                  
                  <circle cx="500" cy="200" r="24" fill="#0A0F0F" stroke="#00F5D4" strokeWidth="2" strokeDasharray="4 4" />
                  <text x="500" y="245" fill="#00F5D4" fontSize="12" textAnchor="middle" className="font-bold">Crown Jewel</text>
                </svg>
              </div>
              
              <div className="w-full md:w-80 bg-[#050A0A] p-6 text-left border-t md:border-t-0 border-[#00F5D4]/10">
                <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm border-b border-[#00F5D4]/20 pb-2">Recommended Fix</h4>
                <div className="mb-6">
                  <div className="text-[#FF4D4D] text-xs font-mono mb-1">CRITICAL NODE IDENTIFIED</div>
                  <div className="text-lg font-bold text-white mb-2">Patch Internal API Gateway</div>
                  <div className="text-sm text-[#8A9B99] mb-4">Applying this fix breaks 94% of viable attack paths to the Crown Jewel database.</div>
                  <div className="bg-[#0D3B36]/50 border border-[#00F5D4]/30 rounded p-3 text-center">
                    <span className="block text-2xl font-bold text-[#00F5D4]">- 94%</span>
                    <span className="text-xs text-[#8A9B99] uppercase tracking-wider">Risk Reduction</span>
                  </div>
                </div>
                <button className="w-full bg-[#00F5D4]/10 border border-[#00F5D4] text-[#00F5D4] py-2 rounded text-sm font-bold hover:bg-[#00F5D4] hover:text-[#0A0F0F] transition-colors">
                  Apply Fix (Simulated)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY IT'S DIFFERENT */}
      <section className="py-24 px-6 z-10 relative bg-[#0D3B36]/10 border-y border-[#00F5D4]/10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-[#050A0A] p-8 rounded-xl border border-red-500/20">
              <h3 className={`text-2xl font-bold text-white mb-8 ${fontHeading}`}>Existing Tools</h3>
              <ul className="space-y-6">
                {['Generate lists of thousands of unprioritized CVEs', 'Score vulnerabilities in isolation using static CVSS', 'Show you what is technically vulnerable', 'Require manual path analysis by red teams'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#8A9B99]">
                    <XCircle className="text-red-500/70 shrink-0 mt-0.5" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-[#0A0F0F] p-8 rounded-xl border border-[#00F5D4]/40 shadow-[0_0_40px_rgba(0,245,212,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F5D4]/10 blur-[50px]"></div>
              <h3 className={`text-2xl font-bold text-[#00F5D4] mb-8 ${fontHeading} ${textGlow}`}>AEGIS-TWIN</h3>
              <ul className="space-y-6">
                {['Compute the exact attack paths adversaries will use', 'Score risk contextually based on topology & access', 'Show you what is actually reachable and exploitable', 'Orchestrate the mathematically optimal remediation plan'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white">
                    <CheckCircle className="text-[#00F5D4] shrink-0 mt-0.5 shadow-sm" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TECH CREDIBILITY STRIP */}
      <section className="py-12 border-b border-[#00F5D4]/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-[#8A9B99] uppercase tracking-[0.2em] mb-6">Built on real data</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            {['NVD', 'MITRE ATT&CK', 'CVSS v3.1', 'EPSS'].map((tech, i) => (
              <div key={i} className={`text-xl font-bold ${fontHeading} text-[#8A9B99] tracking-wider`}>
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA / FOOTER */}
      <footer className="bg-[#050A0A] pt-24 pb-12 border-t-2 border-[#00F5D4]/20 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-[#00F5D4]/5 blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center mb-24 relative z-10">
          <h2 className={`text-4xl md:text-5xl font-bold text-white mb-8 ${fontHeading}`}>
            One Connected Security Model.<br/>One Prioritized Decision.
          </h2>
          <button className={`bg-[#00F5D4] text-[#0A0F0F] px-10 py-4 rounded-md font-bold text-lg ${glowShadow} hover:shadow-[0_0_60px_rgba(0,245,212,0.6)] transition-all duration-300 transform hover:-translate-y-1`}>
            Request Early Access
          </button>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 border-t border-[#8A9B99]/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className={`text-xl font-bold ${fontHeading} text-white flex items-center gap-2`}>
            <Shield className="text-[#00F5D4]" size={20} />
            AEGIS-TWIN
          </div>
          
          <div className="flex gap-6 text-[#8A9B99] text-sm font-medium">
            <a href="#product" className="hover:text-[#00F5D4] transition-colors">Product</a>
            <a href="#how-it-works" className="hover:text-[#00F5D4] transition-colors">How It Works</a>
            <a href="#tech" className="hover:text-[#00F5D4] transition-colors">Tech</a>
            <a href="#docs" className="hover:text-[#00F5D4] transition-colors">Docs</a>
          </div>
          
          <div className="text-[#8A9B99] text-sm">
            &copy; {new Date().getFullYear()} AEGIS-TWIN. All rights reserved.
          </div>
        </div>
      </footer>
      
      {/* Global CSS for animations used above */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to { stroke-dashoffset: -12; }
        }
      `}} />
    </div>
  );
};

export default LandingPage;
