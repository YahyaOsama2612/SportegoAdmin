import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Lock, Mail, Globe, ArrowRight } from 'lucide-react';

export function Login() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [subdomain, setSubdomain] = useState('ahly');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !subdomain) {
      addToast('Please fill all login fields', 'error');
      return;
    }
    setLoading(true);
    try {
      await login(email, password, subdomain.toLowerCase().trim());
      addToast('Welcome back! Logged in successfully.');
      navigate('/');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Login error. Please verify credentials.';
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card Header Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-400 p-0.5 shadow-xl shadow-purple-600/40 items-center justify-center mb-4">
            <div className="w-full h-full bg-purple-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-purple-300" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider">
            SPROTEGO ADMIN
          </h1>
          <p className="text-xs text-purple-200/80 mt-1 font-medium">
            Multi-Tenant Sports Club Management Portal
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Club Subdomain */}
            <div>
              <label className="block text-xs font-bold text-purple-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-purple-600" />
                <span>Club Subdomain</span>
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="ahly"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-l-2xl border border-purple-200 text-xs text-purple-950 font-bold focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                  required
                />
                <span className="px-3 py-2.5 bg-purple-100 text-purple-800 text-xs font-mono font-bold border border-l-0 border-purple-200 rounded-r-2xl">
                  .sportego.org
                </span>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-purple-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-600" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                placeholder="admin@ahly.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-purple-200 text-xs text-purple-950 focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-purple-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-600" />
                <span>Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-purple-200 text-xs text-purple-950 focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-purple-600/30 transition transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Club Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

