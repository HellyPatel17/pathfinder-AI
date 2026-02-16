
import React, { useState } from 'react';
import { UserProfile, CareerRecommendation, AppState } from './types';
import { getCareerRecommendations } from './services/geminiService';
import StepIndicator from './components/StepIndicator';
import { 
  Briefcase, 
  Brain, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  CheckCircle2,
  XCircle,
  Lightbulb,
  Trophy,
  Dumbbell,
  Palette,
  Compass,
  Zap,
  Users
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.WELCOME);
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<CareerRecommendation[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    skills: [],
    interests: [],
    education: '',
    experienceLevel: '',
    workPreference: 'Hybrid',
    personalityTraits: []
  });

  const [inputVal, setInputVal] = useState('');

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => Math.max(0, s - 1));

  const addTag = (field: 'skills' | 'interests' | 'personalityTraits') => {
    if (inputVal.trim() && !profile[field].includes(inputVal.trim())) {
      setProfile({ ...profile, [field]: [...profile[field], inputVal.trim()] });
      setInputVal('');
    }
  };

  const removeTag = (field: 'skills' | 'interests' | 'personalityTraits', tag: string) => {
    setProfile({ ...profile, [field]: profile[field].filter(t => t !== tag) });
  };

  const handleSubmit = async () => {
    setState(AppState.ANALYZING);
    try {
      const recommendations = await getCareerRecommendations(profile);
      setResults(recommendations);
      setState(AppState.RESULTS);
    } catch (error) {
      alert("Something went wrong. Please check your inputs and try again.");
      setState(AppState.ASSESSMENT);
    }
  };

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 animate-in fade-in duration-700">
      <div className="flex gap-4 mb-8">
        <div className="bg-blue-600/10 p-4 rounded-2xl border border-blue-500/20"><Dumbbell className="w-8 h-8 text-blue-400" /></div>
        <div className="bg-emerald-600/10 p-4 rounded-2xl border border-emerald-500/20"><Briefcase className="w-8 h-8 text-emerald-400" /></div>
        <div className="bg-purple-600/10 p-4 rounded-2xl border border-purple-500/20"><Palette className="w-8 h-8 text-purple-400" /></div>
      </div>
      <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
        Pathfinder AI
      </h1>
      <p className="text-xl text-slate-400 max-w-2xl mb-10">
        From professional sports to business leadership, creative arts to engineering. 
        Discover the career that aligns with your DNA.
      </p>
      <button
        onClick={() => setState(AppState.ASSESSMENT)}
        className="px-10 py-5 bg-blue-600 hover:bg-blue-700 rounded-full font-bold text-lg shadow-xl shadow-blue-500/20 transition-all transform hover:scale-105 flex items-center gap-2"
      >
        Start Discovery <Compass className="w-5 h-5" />
      </button>
    </div>
  );

  const renderAssessment = () => {
    const steps = [
      {
        title: "Talents & Hard Skills",
        desc: "What can you actually do? (e.g. Sprinting, Cooking, Sales, Coding, Public Speaking)",
        content: (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag('skills')}
                placeholder="Type a skill and press Enter..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={() => addTag('skills')} className="px-4 py-2 bg-slate-800 rounded-lg">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map(s => (
                <span key={s} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-blue-500/30">
                  {s} <button onClick={() => removeTag('skills', s)}><XCircle className="w-4 h-4" /></button>
                </span>
              ))}
            </div>
          </div>
        )
      },
      {
        title: "Passions & Interests",
        desc: "What would you do for free? (e.g. Football, Fashion, Investing, Space, Nature)",
        content: (
          <div className="space-y-4">
             <div className="flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag('interests')}
                placeholder="Type an interest..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button onClick={() => addTag('interests')} className="px-4 py-2 bg-slate-800 rounded-lg">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map(i => (
                <span key={i} className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-emerald-500/30">
                  {i} <button onClick={() => removeTag('interests', i)}><XCircle className="w-4 h-4" /></button>
                </span>
              ))}
            </div>
          </div>
        )
      },
      {
        title: "Work Nature & Style",
        desc: "Describe your temperament and strengths.",
        content: (
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Dumbbell className="w-4 h-4" />, label: 'Highly Active' },
              { icon: <Zap className="w-4 h-4" />, label: 'High Stakes' },
              { icon: <Users className="w-4 h-4" />, label: 'People Oriented' },
              { icon: <Palette className="w-4 h-4" />, label: 'Creative' },
              { icon: <Trophy className="w-4 h-4" />, label: 'Competitive' },
              { icon: <Brain className="w-4 h-4" />, label: 'Analytical' }
            ].map(trait => (
              <button
                key={trait.label}
                onClick={() => {
                  if (profile.personalityTraits.includes(trait.label)) {
                    removeTag('personalityTraits', trait.label);
                  } else {
                    setProfile({ ...profile, personalityTraits: [...profile.personalityTraits, trait.label] });
                  }
                }}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                  profile.personalityTraits.includes(trait.label) 
                  ? 'bg-blue-600 border-blue-400 text-white' 
                  : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                {trait.icon} {trait.label}
              </button>
            ))}
          </div>
        )
      },
      {
        title: "Logistics & Preferences",
        desc: "Education and work environment.",
        content: (
          <div className="grid grid-cols-1 gap-4">
            <select
              value={profile.education}
              onChange={(e) => setProfile({ ...profile, education: e.target.value })}
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3"
            >
              <option value="">Background / Education</option>
              <option value="Self-Taught / Experience Only">Self-Taught / Experience Only</option>
              <option value="Trade School / Certification">Trade School / Certification</option>
              <option value="Associate / Bachelor Degree">Bachelor Degree</option>
              <option value="Master / Professional License">Master / Professional License</option>
            </select>
            <div className="flex justify-around p-2 bg-slate-900/50 rounded-lg border border-slate-800">
              {['Remote', 'Hybrid', 'On-site', 'Field Work'].map((p: any) => (
                <button
                  key={p}
                  onClick={() => setProfile({ ...profile, workPreference: p })}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${profile.workPreference === p ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )
      }
    ];

    return (
      <div className="max-w-3xl mx-auto py-12 px-4 animate-in slide-in-from-bottom-4 duration-500">
        <StepIndicator currentStep={step} totalSteps={steps.length} />
        <div className="glass-card p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl font-bold mb-2">{steps[step].title}</h2>
          <p className="text-slate-400 mb-8">{steps[step].desc}</p>
          <div className="min-h-[220px]">{steps[step].content}</div>
          <div className="mt-12 flex justify-between">
            <button onClick={handleBack} disabled={step === 0} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium ${step === 0 ? 'opacity-0' : 'text-slate-400 hover:text-white'}`}>
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
            {step === steps.length - 1 ? (
              <button onClick={handleSubmit} className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20">
                Reveal My Path <Sparkles className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={handleNext} className="flex items-center gap-2 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold">
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAnalyzing = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="relative mb-10">
        <div className="w-32 h-32 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
        <Brain className="w-12 h-12 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <h2 className="text-3xl font-bold mb-4">Analyzing Global Markets</h2>
      <p className="text-slate-400 max-w-md">Scanning industries across physical, creative, and business sectors...</p>
    </div>
  );

  const renderResults = () => {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 space-y-12 animate-in fade-in duration-1000">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Your Intelligence Report</h2>
          <p className="text-slate-400">Holistic matches spanning your talents and environment.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {results.map((rec, i) => (
            <div key={i} className="glass-card rounded-3xl p-6 flex flex-col h-full border-t-4 border-t-blue-500 hover:translate-y-[-8px] transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-slate-800 p-3 rounded-2xl">
                  {rec.role.toLowerCase().includes('athlet') || rec.role.toLowerCase().includes('sport') ? <Trophy className="w-6 h-6 text-orange-400" /> : <Briefcase className="w-6 h-6 text-blue-400" />}
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 uppercase block">Match Score</span>
                  <span className="text-2xl font-bold text-blue-400">{rec.matchPercentage}%</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3">{rec.role}</h3>
              <p className="text-slate-400 text-sm mb-6 flex-1">{rec.description}</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> <span>{rec.salaryRange}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <TrendingUp className="w-4 h-4 text-purple-400" /> <span>{rec.marketDemand} Demand</span>
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Crucial Next Steps</p>
                <div className="flex flex-wrap gap-2">
                  {rec.skillsToLearn.map(s => (
                    <span key={s} className="bg-slate-800 text-slate-300 text-[10px] px-2 py-1 rounded-md border border-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => document.getElementById(`roadmap-${i}`)?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full py-3 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all"
              >
                View Mastery Roadmap
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-16">
          {results.map((rec, i) => (
            <div key={i} id={`roadmap-${i}`} className="scroll-mt-10 animate-in slide-in-from-left-4 duration-700">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-indigo-600/20 p-4 rounded-2xl"><Calendar className="w-8 h-8 text-indigo-400" /></div>
                <div>
                  <h3 className="text-3xl font-bold">{rec.role} Roadmap</h3>
                  <p className="text-slate-400">The 6-month journey to professional success</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rec.roadmap.map((step, si) => (
                  <div key={si} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl relative">
                    <div className="absolute top-4 right-4 text-xs font-bold text-slate-700 uppercase">{step.month}</div>
                    <h4 className="text-xl font-bold text-indigo-400 mb-4">{step.milestone}</h4>
                    <ul className="space-y-2">
                      {step.resources.map((res, ri) => (
                        <li key={ri} className="text-sm text-slate-400 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {res}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center py-20">
          <button 
            onClick={() => { setState(AppState.WELCOME); setStep(0); }}
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold"
          >
            Start New Assessment
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-10 px-6 py-6 border-b border-slate-900 bg-slate-950/50 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-blue-600 p-1.5 rounded-lg"><Sparkles className="w-5 h-5 text-white" /></div>
            <span>Pathfinder<span className="text-blue-500">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Universal Careers</a>
            <a href="#" className="hover:text-white transition-colors">Market Trends</a>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all">Get App</button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {state === AppState.WELCOME && renderWelcome()}
        {state === AppState.ASSESSMENT && renderAssessment()}
        {state === AppState.ANALYZING && renderAnalyzing()}
        {state === AppState.RESULTS && renderResults()}
      </main>

      <footer className="relative z-10 py-12 px-6 border-t border-slate-900 text-center text-slate-500 text-sm">
        <p>&copy; 2024 Pathfinder AI. Covering 1,000+ career paths across every major industry.</p>
      </footer>
    </div>
  );
};

export default App;
