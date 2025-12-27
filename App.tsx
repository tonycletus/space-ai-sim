import React, { useState, useMemo } from 'react';
import { OrbitType, SimulationParams } from './types';
import { calculateSimulation } from './services/physics';
import { InputSlider } from './components/InputSlider';
import { MetricsCard } from './components/MetricsCard';
import { OrbitViz } from './components/OrbitViz';
import { InfoModal } from './components/InfoModal';
import { Analytics } from '@vercel/analytics/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  Cpu,
  Sun,
  Play,
  Activity,
  Battery,
  RotateCw,
  Github,
  HelpCircle
} from 'lucide-react';
import { GEO_ALTITUDE } from './constants';

function App() {
  const [params, setParams] = useState<SimulationParams>({
    orbitType: OrbitType.SSO,
    altitude: 500,
    solarEfficiency: 30,
    aiPowerDemand: 50,
    satelliteMass: 1000,
    simulationDays: 30
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const results = useMemo(() => calculateSimulation(params), [params]);

  const handleRun = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 800);
  };

  const updateParam = <K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => {
    setParams(prev => {
      const newParams = { ...prev, [key]: value };
      if (key === 'orbitType' && value === OrbitType.GEO) {
        newParams.altitude = GEO_ALTITUDE;
      }
      if (key === 'orbitType' && prev.orbitType === OrbitType.GEO && value !== OrbitType.GEO) {
        newParams.altitude = 500;
      }
      return newParams;
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-950 text-gray-100 overflow-hidden font-sans">
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />

      {/* Sidebar / Configuration Panel */}
      <aside className="w-full md:w-80 lg:w-96 bg-gray-900 border-r border-gray-800 flex flex-col h-auto md:h-screen overflow-y-auto z-20 shadow-xl relative">
        <div className="p-4 md:p-6 border-b border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              {/* Custom Designed Icon - Solid Elegant Color */}
              <div className="w-10 h-10 relative flex items-center justify-center shrink-0">
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  {/* Orbital Rings - Solid Cyan */}
                  <circle cx="20" cy="20" r="16" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 2" className="opacity-40" />

                  {/* Central Hardware - Solid Cyan */}
                  <rect x="12" y="12" width="16" height="16" rx="3" fill="#0f172a" stroke="#22d3ee" strokeWidth="2" />
                  <rect x="16" y="16" width="8" height="8" rx="1" fill="#22d3ee" />

                  {/* Signal indicators */}
                  <path d="M20 8 V4 M20 32 v4 M4 20 h4 M32 20 h4" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              {/* Elegant Logo Text - Solid White */}
              <h1 className="text-xl font-bold text-gray-300 tracking-tight font-display whitespace-nowrap">
                Space AI Sim
              </h1>
            </div>

            {/* Mobile Navigation */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsInfoOpen(true)}
                className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 rounded-lg transition-all"
                aria-label="Guide"
              >
                <HelpCircle size={18} className="text-cyan-400" />
              </button>
              <a
                href="https://github.com/tonycletus/space-ai-sim"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 rounded-lg transition-all"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed pl-1">
            Orbital mechanics & power systems.
          </p>
        </div>

        <div className="p-6 flex-1 space-y-8">
          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <RotateCw size={14} className="text-cyan-500" /> Orbit Configuration
            </h2>
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-300 block mb-2">Orbit Type</label>
              <select
                value={params.orbitType}
                onChange={(e) => updateParam('orbitType', e.target.value as OrbitType)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all hover:border-gray-600"
              >
                {Object.values(OrbitType).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <InputSlider
              label="Altitude"
              value={params.altitude}
              min={200}
              max={params.orbitType === OrbitType.GEO ? 40000 : 2000}
              unit="km"
              onChange={(v) => updateParam('altitude', v)}
              tooltip="Height above Earth's surface. Affects orbital period and eclipse duration."
              disabled={params.orbitType === OrbitType.GEO}
            />
          </section>

          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sun size={14} className="text-yellow-500" /> Power Systems
            </h2>
            <InputSlider
              label="Solar Efficiency"
              value={params.solarEfficiency}
              min={10}
              max={50}
              unit="%"
              onChange={(v) => updateParam('solarEfficiency', v)}
              tooltip="Conversion efficiency of solar panels. Modern Multi-junction cells are ~30-40%."
            />
            <InputSlider
              label="Satellite Mass"
              value={params.satelliteMass}
              min={100}
              max={5000}
              step={100}
              unit="kg"
              onChange={(v) => updateParam('satelliteMass', v)}
              tooltip="Total mass. Determines available surface area for solar panels (est. 1m²/10kg)."
            />
          </section>

          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Cpu size={14} className="text-purple-500" /> AI Payload
            </h2>
            <InputSlider
              label="Power Demand"
              value={params.aiPowerDemand}
              min={1}
              max={100}
              unit="kW"
              onChange={(v) => updateParam('aiPowerDemand', v)}
              tooltip="Continuous power required by the onboard AI compute units (GPUs/TPUs)."
            />
            <InputSlider
              label="Duration"
              value={params.simulationDays}
              min={1}
              max={365}
              unit="days"
              onChange={(v) => updateParam('simulationDays', v)}
              tooltip="Length of the simulation in Earth days."
            />
          </section>
        </div>

        <div className="p-6 border-t border-gray-800 sticky bottom-0 bg-gray-900/95 backdrop-blur z-10">
          <button
            onClick={handleRun}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(8,145,178,0.2)]"
          >
            {isSimulating ? <Activity className="animate-spin" /> : <Play size={18} fill="currentColor" />}
            {isSimulating ? 'Computing...' : 'Run Simulation'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-fixed">

        {/* TOP HEADER - NAVIGATION */}
        <header className="hidden md:flex h-16 border-b border-gray-800 bg-gray-900/50 backdrop-blur items-center justify-between px-6 md:px-8 z-30">
          <div className="flex items-center gap-2 text-gray-400 text-sm hidden md:flex">
            <span className="bg-gray-800 px-2 py-1 rounded text-xs font-mono">STATUS: SIMULATING</span>
          </div>
          <nav className="flex items-center gap-3">
            <button
              onClick={() => setIsInfoOpen(true)}
              className="flex items-center gap-2 px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 rounded-lg transition-all text-sm font-medium"
            >
              <HelpCircle size={16} className="text-cyan-400" />
              <span>Guide</span>
            </button>
            <a
              href="https://github.com/tonycletus/space-ai-sim"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 rounded-lg transition-all text-sm font-medium"
            >
              <Github size={16} />
              <span>GitHub</span>
            </a>
          </nav>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricsCard
                title="Daily Power Gen"
                value={results.dailyGen}
                unit="kWh"
                subtext={`From ${results.panelArea.toFixed(1)}m² panels`}
              />
              <MetricsCard
                title="Viability"
                value={results.viability}
                status={results.viability === 'Feasible' ? 'success' : 'danger'}
                subtext={`Surplus: ${(results.dailyGen - (params.aiPowerDemand * 24)).toFixed(1)} kWh/day`}
              />
              <MetricsCard
                title="Sunlight Uptime"
                value={(results.sunlightUptime * 100).toFixed(0)}
                unit="%"
                subtext={params.orbitType === OrbitType.SSO ? 'Continuous Sunlight' : 'Eclipse Cycles Active'}
              />
              <MetricsCard
                title="Orbital Period"
                value={results.orbitalPeriod}
                unit="min"
                subtext={`${(1440 / results.orbitalPeriod).toFixed(1)} orbits/day`}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[400px]">
                <h3 className="text-sm font-semibold text-gray-400 mb-6 w-full flex items-center gap-2">
                  <RotateCw size={16} /> Live Orbit View
                </h3>
                <OrbitViz orbitType={params.orbitType} altitude={params.altitude} />
                <div className="mt-6 space-y-2 w-full border-t border-gray-800 pt-4">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Sat Mass</span>
                    <span className="text-gray-300 font-mono">{params.satelliteMass} kg</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Est. Panel Area</span>
                    <span className="text-gray-300 font-mono">{results.panelArea.toFixed(1)} m²</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Velocity</span>
                    <span className="text-gray-300 font-mono">{Math.sqrt((6.674e-11 * 5.972e24) / ((6371 + params.altitude) * 1000)).toFixed(0)} m/s</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6 h-[300px] flex flex-col">
                  <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
                    <Activity size={16} /> Power Analysis (Daily Average)
                  </h3>
                  <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={results.dailyData}>
                        <defs>
                          <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} />
                        <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} unit="kWh" />
                        <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#f3f4f6' }} />
                        <Area type="monotone" dataKey="powerGenerated" name="Energy Gen" stroke="#0ea5e9" strokeWidth={2} fill="url(#colorGen)" />
                        <Area type="monotone" dataKey="powerConsumed" name="AI Demand" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6 h-[250px] flex flex-col">
                  <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
                    <Battery size={16} /> Net Energy Surplus
                  </h3>
                  <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={results.dailyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} />
                        <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                        <Line type="monotone" dataKey="surplus" stroke="#10b981" strokeWidth={2} dot={false} />
                        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Analytics />
    </div>
  );
}

export default App;