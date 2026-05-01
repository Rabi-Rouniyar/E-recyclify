import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Recycle, LogIn, UserCircle } from 'lucide-react';

const Navbar = ({ isAuthenticated, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Recycle className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-slate-800 tracking-tight">E-Recyclify</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Home</Link>
            {isAuthenticated ? (
              <>
                <Link 
                  to={user?.role === 'recycler' ? '/recycler-dashboard' : '/dashboard'} 
                  className="text-slate-600 hover:text-primary-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                    <UserCircle className="w-5 h-5 text-slate-400" />
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <button onClick={onLogout} className="btn-secondary text-sm">Logout</button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                <Link to="/auth" className="text-slate-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-1">
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link to="/auth?mode=signup" className="btn-primary">Sign Up Free</Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2 hover:bg-slate-50 rounded-lg">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 absolute w-full shadow-lg">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium px-2" onClick={() => setIsOpen(false)}>Home</Link>
            {isAuthenticated ? (
              <>
                <Link to={user?.role === 'recycler' ? '/recycler-dashboard' : '/dashboard'} className="text-slate-600 hover:text-primary-600 font-medium px-2" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <div className="border-t border-slate-100 pt-4 mt-2">
                  <button onClick={() => { onLogout(); setIsOpen(false); }} className="btn-secondary w-full text-center">Logout</button>
                </div>
              </>
            ) : (
              <div className="border-t border-slate-100 pt-4 flex flex-col gap-3 mt-2">
                <Link to="/auth" className="btn-secondary text-center" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/auth?mode=signup" className="btn-primary text-center" onClick={() => setIsOpen(false)}>Sign Up Free</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
