import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register } = useContext(AuthContext);
  
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const initialRole = searchParams.get('role') === 'recycler' ? 'recycler' : 'user';
  
  const [mode, setMode] = useState(initialMode);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: initialRole,
    phone: '',
  });

  useEffect(() => {
    setMode(searchParams.get('mode') === 'signup' ? 'signup' : 'login');
  }, [searchParams]);

  const toggleMode = () => {
    setErrorMsg('');
    navigate(`/auth?mode=${mode === 'login' ? 'signup' : 'login'}`, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData);
      }
      // Note: App.jsx's <Navigate> component will handle the redirect automatically based on user.role
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'An error occurred during authentication.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50">
      <div className="card max-w-md w-full shadow-lg border-0">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {mode === 'login' ? 'Enter your details to access your dashboard.' : 'Join the E-Recyclify platform today and make an impact.'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Jane Doe"
                  required
                  minLength="3"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                <input 
                  type="tel" 
                  className="input-field" 
                  placeholder="e.g. 1234567890"
                  required
                  pattern="^\+?[0-9\s\-()]{7,15}$"
                  title="Please enter a valid phone number"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              required
              minLength="6"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">I am a...</label>
              <select 
                className="input-field bg-white cursor-pointer"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="user">Regular User (Dispose E-Waste)</option>
                <option value="recycler">Recycler (Collect E-Waste)</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn-primary w-full mt-6 py-3 text-base shadow-primary-500/30 shadow-lg">
            {mode === 'login' ? 'Sign In to Account' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-100">
          <p className="text-sm text-slate-600">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={toggleMode} className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
              {mode === 'login' ? 'Sign up for free' : 'Log in here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
