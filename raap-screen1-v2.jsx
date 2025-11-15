import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function RaaPModularFeasibility() {
  const [currentScreen, setCurrentScreen] = useState(1);

  const RaaPLogo = ({ className = "h-24" }) => (
    <svg className={className} viewBox="0 0 185.07 96.21" xmlns="http://www.w3.org/2000/svg">
      <g fill="#256734">
        <path d="m0,30.65h24.8c8.87,0,14.36,3.64,14.36,10.89v.48c0,5.93-2.97,9.66-9.35,10.38l.03.08c6.3.56,9.35,3.81,9.35,10.39v.78c0,2.69.28,5.32.87,7.87h-9.29c-.67-2.49-1.01-5.1-1.01-7.7v-1.04c0-4.73-2.18-6.8-7.42-6.8h-13.18v15.54H0V30.65Zm22.48,18.84c5.07,0,7.39-2.32,7.39-6.1v-.36c0-4.06-2.6-5.74-7.56-5.74h-13.16v12.21h13.32Z"/>
        <path d="m71.55,67.35c-3.05,3.33-7.81,4.95-13.86,4.95-8.01,0-11.95-3.5-11.95-9.1v-.17c0-5.46,4.03-8.68,15.76-9.88l9.52-.98v-1.45c0-3.75-2.35-5.74-7.95-5.74-6.05,0-8.15,2.01-8.15,5.49v.81h-8.31v-.78c0-7.36,4.93-11.11,16.43-11.11s16.29,3.64,16.29,11.59v7.39c0,4.73.36,9.1,1.43,13.16h-8.51c-.28-1.32-.5-2.74-.7-4.17Zm-10.86-.76c3.92,0,7.53-1.04,10.52-2.86-.14-1.85-.2-3.67-.2-5.37v-1.2l-7.73.81c-6.63.7-8.87,2.1-8.87,4.56v.17c0,2.43,2.01,3.89,6.27,3.89Z"/>
        <path d="m111,67.35c-3.05,3.33-7.81,4.95-13.86,4.95-8.01,0-11.95-3.5-11.95-9.1v-.17c0-5.46,4.03-8.68,15.76-9.88l9.52-.98v-1.45c0-3.75-2.35-5.74-7.95-5.74-6.05,0-8.15,2.01-8.15,5.49v.81h-8.31v-.78c0-7.36,4.93-11.11,16.43-11.11s16.29,3.64,16.29,11.59v7.39c0,4.73.36,9.1,1.43,13.16h-8.51c-.28-1.32-.5-2.74-.7-4.17Zm-10.86-.76c3.92,0,7.53-1.04,10.52-2.86-.14-1.85-.2-3.67-.2-5.37v-1.2l-7.73.81c-6.63.7-8.87,2.1-8.87,4.56v.17c0,2.43,2.01,3.89,6.27,3.89Z"/>
        <path d="m126.07,30.65h22.03c10.02,0,15.45,4.2,15.45,13.04v.53c0,8.76-5.43,13.21-15.45,13.21h-12.99v14.08h-9.04V30.65Zm9.01,20.15h11.56c5.57,0,7.73-2.18,7.73-6.58v-.53c0-4.37-2.18-6.41-7.73-6.41h-11.56v13.52Z"/>
        <polygon points="0 0 0 21.25 9.15 21.25 9.15 9.15 175.91 9.15 175.91 62.36 164.34 62.36 164.34 71.52 185.07 71.52 185.07 0 0 0"/>
      </g>
    </svg>
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <RaaPLogo className="h-10 w-auto" />
              <div className="text-lg font-bold text-gray-900">Rooms as a Product: ModularFeasibility</div>
            </div>
            <div className="text-base text-gray-600 font-semibold">Screen {currentScreen} of 8</div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <div key={num} className={`h-1.5 flex-1 rounded-full ${num <= currentScreen ? 'bg-green-600' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-4 flex-1 flex flex-col">
          
          {/* Hero */}
          <div className="text-center mb-3">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Make Modular Predictable</h1>
            <p className="text-lg text-gray-600">Most modular projects fail before they start — due to systemic issues around design, costs, and factory coordination.</p>
          </div>

          {/* Image */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-3 border border-gray-200">
            <div className="h-40 overflow-hidden flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=400&fit=crop"
                alt="Modular Building"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-blue-100 via-white to-orange-50 flex items-center justify-center"><div class="text-6xl">🏢</div></div>';
                }}
              />
            </div>
            <div className="bg-green-700 text-white px-4 py-2 text-center">
              <p className="text-base font-semibold">Your project, factory-ready — before you spend months on design.</p>
            </div>
          </div>

          {/* Problems Section */}
          <div className="mb-3">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-orange-600">⚠️</span> Why modular hasn't worked (yet)
            </h2>

            <div className="space-y-2">
              <div className="flex gap-2 p-3 bg-red-50 rounded-lg border-2 border-red-300">
                <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900">Designs aren't optimized for fabrication</h3>
                  <p className="text-sm text-gray-700">Mismatched grids drive millions in added costs and endless RFIs.</p>
                </div>
              </div>

              <div className="flex gap-2 p-3 bg-orange-50 rounded-lg border-2 border-orange-300">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900">GCs and trades can't scope modular correctly</h3>
                  <p className="text-sm text-gray-700">Scope overlaps create change orders, rework, and blowups.</p>
                </div>
              </div>

              <div className="flex gap-2 p-3 bg-yellow-50 rounded-lg border-2 border-yellow-300">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900">AoR–GC–Fabricator coordination breaks down</h3>
                  <p className="text-sm text-gray-700">Everyone prices different assumptions.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Solution */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 border-2 border-green-500 mb-3">
            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              <span className="text-green-600">✓</span> RaaP flips this
            </h3>
            <p className="text-base text-gray-800">
              We start with a <strong className="text-green-700">factory-optimized design</strong> and <strong className="text-green-700">detailed cost model</strong> — giving you feasibility, savings, and confidence.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => setCurrentScreen(2)}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              <span>▶ Start my ModularFeasibility demo</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}