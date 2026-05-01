import { Link } from 'react-router-dom';
import { ArrowRight, Recycle, MapPin, Award, ShieldCheck } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-medium text-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Platform is Live in Select Cities
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Turn Your E-Waste Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-500">Positive Impact</span>
          </h1>
          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Connect seamlessly with local certified recyclers, schedule pickups in one click, and dispose of your old electronics responsibly while earning rewards.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/auth?mode=signup" className="btn-primary flex justify-center items-center gap-2 text-lg px-8 py-4 shadow-primary-500/25 shadow-xl hover:-translate-y-1 transform transition-all">
              Start Recycling Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/auth?mode=signup&role=recycler" className="btn-secondary flex justify-center items-center text-lg px-8 py-4 bg-white">
              Join as a Recycler
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800">How E-Recyclify Works</h2>
            <p className="text-slate-500 mt-3 text-lg">A seamless pipeline connecting you to verified recycling facilities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="card hover:shadow-lg transition-shadow border-slate-100/60 p-8 text-center group">
              <div className="bg-primary-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Recycle className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">1. Request Pickup</h3>
              <p className="text-slate-600 leading-relaxed">Upload a photo of your electronic waste, set an estimated value, and specify a pickup window from your phone.</p>
            </div>
            
            <div className="card hover:shadow-lg transition-shadow border-slate-100/60 p-8 text-center group">
              <div className="bg-primary-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">2. Smart Routing</h3>
              <p className="text-slate-600 leading-relaxed">Our TomTom integration calculates the fastest route for local recyclers to reach your doorstep efficiently.</p>
            </div>

            <div className="card hover:shadow-lg transition-shadow border-slate-100/60 p-8 text-center group">
              <div className="bg-primary-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">3. Safe Disposal</h3>
              <p className="text-slate-600 leading-relaxed">Items are securely collected, processed, and tracked until completion. Get rewarded for contributing to a green planet.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
