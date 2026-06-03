import React from 'react'

const LABS = [
  { name: 'VLSI & Signal Processing Lab', desc: 'Features advanced MATLAB, Xilinx, Cadence tooling, and emulation development boards.' },
  { name: 'Central Machine Hall', desc: 'Houses micro-precision grinders, digital milling devices, and high-temperature furnace blocks.' },
  { name: 'Applied Optoelectronics Cell', desc: 'Specialized lab supporting laser alignment setups, optical fiber emulators, and spectrometer units.' },
  { name: 'Outcome Computing Lab', desc: 'Hosts 40 workstation hubs with specialized Unix and Python scripting clusters.' },
]

const InfrastructureTab: React.FC = () => (
  <div className="space-y-6">
    <div className="pb-3 border-b border-slate-200">
      <h2 className="text-xl font-display font-bold text-slate-900">Labs & Infrastructure Catalog</h2>
    </div>
    <p className="text-xs md:text-sm text-slate-655 leading-relaxed font-sans">
      Comprehensive directory of laboratory facilities providing experiential learning, technical workshops, and PG research setups.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
      {LABS.map((lab, idx) => (
        <div key={idx} className="p-4 border border-slate-200 rounded space-y-2 bg-white">
          <h4 className="text-xs font-bold text-slate-800">{lab.name}</h4>
          <p className="text-[11px] text-slate-550 leading-relaxed font-sans font-medium">{lab.desc}</p>
        </div>
      ))}
    </div>
  </div>
)

export default InfrastructureTab
