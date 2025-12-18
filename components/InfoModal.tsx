import React from 'react';
import { X, BookOpen, Sun, Globe, Calculator } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-display">
            <BookOpen className="text-cyan-400" size={24} />
            Mission Briefing
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-8 text-gray-300">
          
          <section>
            <h3 className="text-lg font-semibold text-white mb-2">Project Overview</h3>
            <p className="leading-relaxed">
              The <strong>Space AI Simulator</strong> explores the feasibility of hosting high-performance Artificial Intelligence data centers in orbit. 
              By moving compute to space, we can potentially access 24/7 solar energy and reduce the cooling burden on Earth, but we must overcome the challenges of orbital mechanics and limited battery capacity.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">How to Use</h3>
            <ol className="list-decimal list-inside space-y-2 marker:text-cyan-500">
              <li><strong>Select an Orbit:</strong> Choose where your satellite cluster operates.</li>
              <li><strong>Configure Hardware:</strong> Adjust the mass (which determines solar panel area) and solar efficiency.</li>
              <li><strong>Define Payload:</strong> Set the power consumption (kW) for your AI models.</li>
              <li><strong>Analyze:</strong> Run the simulation to see if your batteries can survive the eclipse periods (Earth's shadow).</li>
            </ol>
          </section>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
              <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                <Globe size={16} className="text-blue-400" /> Orbit Types
              </h4>
              <ul className="text-sm space-y-3">
                <li>
                  <strong className="text-blue-200 block">Sun-Synchronous (SSO)</strong> 
                  <span className="text-xs text-gray-400">A polar orbit that stays in constant sunlight. Ideal for power, but harder to launch into.</span>
                </li>
                <li>
                  <strong className="text-green-200 block">LEO (Low Earth Orbit)</strong>
                  <span className="text-xs text-gray-400">Close to Earth (low latency) but suffers from frequent eclipses (approx 40% darkness).</span>
                </li>
                <li>
                  <strong className="text-pink-200 block">GEO (Geostationary)</strong>
                  <span className="text-xs text-gray-400">Fixed position, very high altitude. Constant sun, but high latency and launch cost.</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
              <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                <Calculator size={16} className="text-yellow-400" /> The Physics
              </h4>
              <ul className="text-sm space-y-3">
                <li>
                  <span className="block text-xs uppercase tracking-wider text-gray-500 font-semibold">Energy Generation</span>
                  <code>P = Flux (1366 W/m²) × Area × Efficiency</code>
                </li>
                <li>
                  <span className="block text-xs uppercase tracking-wider text-gray-500 font-semibold">Viability Logic</span>
                  <p className="mt-1">
                    The system is <strong>Feasible</strong> only if total daily energy generation exceeds the 24-hour continuous power demand of the AI payload.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 hover:bg-white text-gray-900 font-semibold rounded-lg transition-colors"
          >
            Launch Simulator
          </button>
        </div>
      </div>
    </div>
  );
};