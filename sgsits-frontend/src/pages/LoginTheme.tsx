import React, { useState } from 'react';

export interface LoginThemeState {
  bgType: 'image' | 'color';
  bgImage: string;
  bgColor: string;
  overlayOpacity: number;
  navColor: string;
  btnColor: string;
  cardAccent: string;
}

export const DEFAULT_THEME: LoginThemeState = {
  bgType: 'image',
  bgImage: '/assets/media__1776272596244.png',
  bgColor: '#0b2545',
  overlayOpacity: 0.5,
  navColor: '#0b2545',
  btnColor: '#0b2545',
  cardAccent: '#bfa15f',
};

/* ─── small helper ─── */
interface RowProps {
  label: string;
  children: React.ReactNode;
}

const Row: React.FC<RowProps> = ({ label, children }) => {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</p>
      {children}
    </div>
  );
};

interface ColorRowProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

const ColorRow: React.FC<ColorRowProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex items-center gap-2.5">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded cursor-pointer border-0 p-0 shrink-0 shadow-sm"
      />
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-gray-700 leading-tight">{label}</p>
        <p className="text-[10px] text-gray-400 font-mono">{value.toUpperCase()}</p>
      </div>
    </div>
  );
};

interface LoginThemeProps {
  theme: LoginThemeState;
  setTheme: React.Dispatch<React.SetStateAction<LoginThemeState>>;
  bgImageBroken?: boolean;
}

const LoginTheme: React.FC<LoginThemeProps> = ({ theme, setTheme, bgImageBroken = false }) => {
  const [open, setOpen] = useState(false);

  const update = <K extends keyof LoginThemeState>(key: K, value: LoginThemeState[K]) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => setTheme({ ...DEFAULT_THEME });

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Customise Login Page"
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 text-white/70 hover:text-white hover:bg-white/10 transition-all"
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
        Customise
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl w-[300px] z-[500] pointer-events-auto overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-150 bg-white">
            <p className="text-[12px] font-bold text-gray-700 uppercase tracking-wider">Login Page Customiser</p>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-4 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* ── Background ── */}
            <Row label="Background">
              {/* Type toggle */}
              <div className="flex rounded-lg border border-gray-200 overflow-hidden text-[12px] font-semibold mb-3">
                {(['image', 'color'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => update('bgType', type)}
                    className="flex-1 py-2 transition-all capitalize"
                    style={
                      theme.bgType === type
                        ? { backgroundColor: '#0b2545', color: '#fff' }
                        : { backgroundColor: '#fff', color: '#6b7280' }
                    }
                  >
                    {type === 'image' ? '🖼 Image URL' : '🎨 Solid Color'}
                  </button>
                ))}
              </div>

              {theme.bgType === 'image' ? (
                <>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Image URL</label>
                  <input
                    type="text"
                    value={theme.bgImage}
                    onChange={(e) => update('bgImage', e.target.value)}
                    placeholder="https://... or /assets/..."
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0b2545] bg-white mb-3"
                  />
                  {bgImageBroken && (
                    <p className="text-[10px] text-[#0b2545] mb-2">Image not found. Check the URL/path or use a quick preset.</p>
                  )}
                  {/* Quick presets */}
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Quick Presets</label>
                  <div className="grid grid-cols-3 gap-1.5 mb-3">
                    {[
                      { label: 'Campus', url: '/assets/media__1776272596244.png' },
                      { label: 'Blue Sky', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200' },
                      { label: 'Tech', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200' },
                    ].map((p) => (
                      <button
                        key={p.label}
                        onClick={() => update('bgImage', p.url)}
                        className={`text-[10px] font-semibold px-2 py-1.5 rounded-lg border transition-all text-center ${
                          theme.bgImage === p.url
                            ? 'border-[#0b2545] bg-[#0b2545]/5 text-[#0b2545]'
                            : 'border-gray-200 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  {/* Overlay opacity */}
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Dark Overlay — {Math.round(theme.overlayOpacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.9"
                    step="0.05"
                    value={theme.overlayOpacity}
                    onChange={(e) => update('overlayOpacity', parseFloat(e.target.value))}
                    className="w-full accent-gray-800 h-1.5 rounded-full"
                  />
                </>
              ) : (
                <ColorRow label="Background Color" value={theme.bgColor} onChange={(v) => update('bgColor', v)} />
              )}
            </Row>

            <hr className="border-gray-100" />

            {/* ── Navbar ── */}
            <Row label="Navbar">
              <ColorRow label="Navbar Color" value={theme.navColor} onChange={(v) => update('navColor', v)} />
            </Row>

            <hr className="border-gray-100" />

            {/* ── Form ── */}
            <Row label="Form Colors">
              <div className="space-y-3">
                <ColorRow label="Button / Tab Color" value={theme.btnColor} onChange={(v) => update('btnColor', v)} />
                <ColorRow label="Card Accent Strip" value={theme.cardAccent} onChange={(v) => update('cardAccent', v)} />
              </div>
            </Row>

            {/* ── Reset ── */}
            <button
              onClick={reset}
              className="w-full text-center text-[11px] font-bold text-[#0b2545] hover:text-[#bfa15f] py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
            >
              ↺ Reset to Defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginTheme;
