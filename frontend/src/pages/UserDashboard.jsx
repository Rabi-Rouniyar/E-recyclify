import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import RequestPickupForm from '../components/forms/RequestPickupForm';
import { PlusCircle, Clock, CheckCircle, Package } from 'lucide-react';
import { format } from 'date-fns';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchPickups = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/pickups/my-requests');
      setPickups(data.pickups);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> PENDING</span>;
      case 'Accepted': return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> ACCEPTED</span>;
      case 'Completed': return <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> COMPLETED</span>;
      default: return <span className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-full font-bold uppercase">{status}</span>;
    }
  };

  if (showForm) {
    return (
      <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-[calc(100vh-64px)]">
        <RequestPickupForm 
          onCancel={() => setShowForm(false)} 
          onSuccess={() => {
            setShowForm(false);
            fetchPickups();
          }} 
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-[calc(100vh-64px)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">My E-Waste</h1>
          <p className="text-slate-500 mt-2 text-base">Welcome back, {user?.name}. Manage your recycling pickups and track your impact here.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 whitespace-nowrap shadow-primary-500/30 shadow-lg px-6 py-3">
          <PlusCircle className="w-5 h-5" /> Request Pickup
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-32"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
      ) : pickups.length === 0 ? (
        <div className="card p-16 text-center text-slate-500 border-dashed border-2 border-slate-200 bg-slate-50/50">
          <Package className="w-20 h-20 mx-auto mb-6 text-slate-300" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No active requests</h3>
          <p className="text-slate-500 max-w-md mx-auto">You haven't requested any pickups yet. Click 'Request Pickup' to dispose of your e-waste responsibly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pickups.map((pickup) => (
            <div key={pickup._id} className="card p-0 overflow-hidden flex flex-col group border-slate-100/80 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative h-56 bg-slate-100 overflow-hidden">
                <img src={pickup.image} alt={pickup.productName} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  {getStatusBadge(pickup.status)}
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-extrabold text-xl mb-0.5">{pickup.productName}</h3>
                  <p className="text-white/80 text-sm font-medium">{pickup.brandModel}</p>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col bg-white">
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                    <span className="font-medium text-slate-500 flex items-center gap-2"><Clock className="w-4 h-4" /> Schedule</span>
                    <span className="text-slate-800 font-semibold text-right">
                      {format(new Date(pickup.pickupDate), 'MMM dd')} <br/> 
                      <span className="text-xs text-slate-500 font-normal">{pickup.pickupTime}</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-3 pt-2">
                    <span className="font-medium text-slate-500">Est. Value</span>
                    <span className="font-extrabold text-lg text-primary-600">${pickup.estimatedPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
