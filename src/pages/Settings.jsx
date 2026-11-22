/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Palette, UploadCloud, Save, Sparkles, Database } from 'lucide-react';

export function Settings() {
  const { settings, loading, saving, error, updateSettings, uploadLogo } = useSettings();
  const { subdomain } = useAuth();
  const { addToast } = useToast();

  const [logoUrl, setLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#7c3aed');
  const [secondaryColor, setSecondaryColor] = useState('#6d28d9');
  const [textColor, setTextColor] = useState('#ffffff');

  useEffect(() => {
    if (settings) {
      setLogoUrl(settings.logo || '');
      setLogoPreview(settings.logo || '');
      if (settings.background_color && settings.background_color[0]) {
        setPrimaryColor(settings.background_color[0]);
      }
      if (settings.background_color && settings.background_color[1]) {
        setSecondaryColor(settings.background_color[1]);
      }
      if (settings.color && settings.color[0]) {
        setTextColor(settings.color[0]);
      }
    }
  }, [settings]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (logoFile) {
        await uploadLogo(logoFile);
      } else {
        await updateSettings({
          logo: logoUrl,
          background_color: [primaryColor, secondaryColor],
          color: [textColor],
        });
      }
      addToast('Branding settings saved successfully!');
    } catch {
      addToast('Failed to save settings', 'error');
    }
  };

  const purplePresets = [
    { label: 'Deep Royal Purple', primary: '#7c3aed', secondary: '#5b21b6' },
    { label: 'Electric Violet', primary: '#8b5cf6', secondary: '#6d28d9' },
    { label: 'Indigo Purple', primary: '#6366f1', secondary: '#4338ca' },
    { label: 'Dark Velvet', primary: '#581c87', secondary: '#3b0764' },
  ];

  if (loading && !settings) {
    return <LoadingSpinner text="Loading club branding settings..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-black text-purple-950 tracking-tight">
          Club Branding & Portal Settings
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Customize your tenant dashboard theme colors, club badge logo, and header appearance.
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          Unable to load settings: {error.response?.data?.error?.message || error.message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Live Preview Card */}
        <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Live Header & Brand Preview
          </h3>

          <div
            className="rounded-2xl p-6 transition-all duration-300 shadow-md flex items-center justify-between"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              color: textColor,
            }}
          >
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Club Logo"
                  className="w-12 h-12 rounded-xl object-contain bg-white/20 p-1 backdrop-blur-xs border border-white/30"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-black text-lg border border-white/30">
                  {subdomain.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h4 className="font-extrabold text-lg tracking-tight uppercase">
                  {subdomain} Sporting Club
                </h4>
                <p className="text-xs opacity-80 font-mono">
                  {subdomain}.sportego.org
                </p>
              </div>
            </div>

            <div className="text-right text-xs opacity-90 hidden sm:block">
              <span className="px-3 py-1 rounded-full bg-white/20 font-bold backdrop-blur-xs">
                Active Tenant Portal
              </span>
            </div>
          </div>
        </div>

        {/* Color Palette Section */}
        <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-600" />
            Purple Theme Palette
          </h3>

          {/* Quick presets */}
          <div>
            <label className="block text-xs font-semibold text-purple-950 mb-2">
              Purple Presets:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {purplePresets.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setPrimaryColor(preset.primary);
                    setSecondaryColor(preset.secondary);
                  }}
                  className="p-3 rounded-2xl border border-purple-100 hover:border-purple-300 transition text-left flex items-center gap-3 bg-purple-50/20"
                >
                  <div
                    className="w-6 h-6 rounded-lg shadow-xs shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
                    }}
                  />
                  <span className="text-xs font-bold text-purple-950">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-purple-50">
            <div>
              <label className="block text-xs font-semibold text-purple-950 mb-1.5">
                Primary Gradient Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-purple-200"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-950 mb-1.5">
                Secondary Gradient Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-purple-200"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-950 mb-1.5">
                Header Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-purple-200"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logo Upload Section */}
        <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-purple-950 flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-purple-600" />
            Club Logo (URL or Image File)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-purple-950 mb-1.5">
                Direct Image URL
              </label>
              <input
                type="text"
                placeholder="https://example.com/logo.png"
                value={logoUrl}
                onChange={(e) => {
                  setLogoUrl(e.target.value);
                  setLogoPreview(e.target.value);
                }}
                className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-950 mb-1.5">
                Or Upload File (.png, .jpg, .webp max 5MB)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Server & Subdomain Info */}
        <div className="bg-purple-50/50 rounded-3xl p-6 border border-purple-100 flex items-center justify-between text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-purple-950">
              <Database className="w-4 h-4 text-purple-600" />
              <span>Multi-Tenant Architecture</span>
            </div>
            <p className="text-slate-500">
              Database: <code className="font-mono text-purple-700 font-bold">{subdomain}</code> | Host: <code className="font-mono text-purple-700 font-bold">{subdomain}.sportego.org</code>
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-purple-600/30 transition transform active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Branding Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}

