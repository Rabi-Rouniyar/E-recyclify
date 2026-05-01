import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import MapView from '../components/map/MapView';
import { MapPin, Navigation, CheckCircle, Map } from 'lucide-react';
import { format } from 'date-fns';

const RecyclerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [routes, setRoutes] = useState({});
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [activeTab, setActiveTab] = useState('nearby');
  const [acceptedPickups, setAcceptedPickups] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lng: position.coords.longitude,
            lat: position.coords.latitude,
          };
          setLocation(loc);
          fetchNearbyPickups(loc);
        },
        (err) => {
          setErrorMsg('Failed to get your location. Please enable location services to find nearby e-waste.');
          setLoading(false);
        }
      );
    } else {
      setErrorMsg('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  }, []);

  const fetchNearbyPickups = async (loc) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/pickups/nearby?longitude=${loc.lng}&latitude=${loc.lat}`);
      setPickups(data.pickups);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to fetch nearby pickups');
    } finally {
      setLoading(false);
    }
  };

  const fetchAcceptedPickups = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/pickups/accepted');
      setAcceptedPickups(data.pickups);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to fetch accepted pickups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'accepted') {
      fetchAcceptedPickups();
    } else if (activeTab === 'nearby' && location) {
      fetchNearbyPickups(location);
    }
  }, [activeTab]);

  const handleAccept = async (id) => {
    try {
      await api.put(`/pickups/${id}/status`, { status: 'Accepted' });
      setPickups(pickups.filter(p => p._id !== id));
      if (selectedPickup?._id === id) setSelectedPickup(null);
      alert('Pickup accepted successfully! The user has been notified via email.');
    } catch (err) {
      alert('Failed to accept pickup.');
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.put(`/pickups/${id}/status`, { status: 'Completed' });
      setAcceptedPickups(acceptedPickups.filter(p => p._id !== id));
      if (selectedPickup?._id === id) setSelectedPickup(null);
      alert('Awesome! Pickup marked as completed.');
    } catch (err) {
      alert('Failed to update pickup status.');
    }
  };

  const loadRoute = async (pickup) => {
    try {
      const { data } = await api.get(`/maps/route?startLng=${location.lng}&startLat=${location.lat}&endLng=${pickup.location.coordinates[0]}&endLat=${pickup.location.coordinates[1]}`);
      
      if (data.success) {
        setRoutes(prev => ({
          ...prev,
          [pickup._id]: {
            distance: (data.distanceInMeters / 1000).toFixed(1) + ' km',
            time: Math.round(data.travelTimeInSeconds / 60) + ' min',
            geometry: data.routeDetails.legs[0],
          }
        }));
        setSelectedPickup(pickup);
      }
    } catch (err) {
      console.error('Failed to load route details');
      alert('Could not calculate route. Check backend API logs.');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto min-h-[calc(100vh-64px)] flex flex-col lg:flex-row bg-slate-50">
      
      {/* Left Column: Feed */}
      <div className="w-full lg:w-1/2 xl:w-2/5 p-4 sm:p-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px)' }}>
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Recycler Dashboard</h1>
          <p className="text-slate-500 mt-2 text-sm">Welcome back, {user?.name}. Manage your pickups.</p>
        </div>

        <div className="flex gap-4 mb-8 border-b border-slate-200 pb-4">
          <button 
            onClick={() => setActiveTab('nearby')} 
            className={`font-bold px-4 py-2 rounded-lg transition-colors ${activeTab === 'nearby' ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            Pending Nearby
          </button>
          <button 
            onClick={() => setActiveTab('accepted')} 
            className={`font-bold px-4 py-2 rounded-lg transition-colors ${activeTab === 'accepted' ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            My Accepted Pickups
          </button>
        </div>

        {errorMsg && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-center font-medium text-sm">
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div></div>
        ) : (activeTab === 'nearby' ? pickups : acceptedPickups).length === 0 && !errorMsg ? (
          <div className="card p-12 text-center text-slate-500 border-dashed border-2 border-slate-200 bg-slate-50/50">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-bold text-slate-700 mb-2">No {activeTab} requests</h3>
            <p className="text-sm">There are currently no {activeTab === 'nearby' ? 'pending e-waste pickup requests within 10km.' : 'pickups accepted by you.'}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {(activeTab === 'nearby' ? pickups : acceptedPickups).map((pickup) => (
              <div 
                key={pickup._id} 
                className={`card p-0 overflow-hidden flex flex-col group border-2 transition-all duration-300 ${selectedPickup?._id === pickup._id ? 'border-primary-500 shadow-md ring-4 ring-primary-50' : 'border-slate-100 hover:border-primary-200'}`}
              >
                <div className="relative h-40 bg-slate-100 overflow-hidden">
                  <img src={pickup.image} alt={pickup.productName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 text-white">
                    <h3 className="font-extrabold text-lg mb-0">{pickup.productName}</h3>
                    <p className="text-white/80 text-xs font-medium">{pickup.brandModel}</p>
                  </div>
                </div>
                <div className="p-5 flex-grow flex flex-col bg-white">
                  <div className="space-y-3 text-sm text-slate-600 mb-5">
                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                       <div className="truncate pr-4">
                         <span className="text-slate-800 font-semibold block truncate">{pickup.user?.name}</span>
                         <span className="text-slate-500 text-xs">{pickup.phoneNumber}</span>
                       </div>
                       <div className="text-right whitespace-nowrap">
                         <span className="text-slate-800 font-semibold block">{format(new Date(pickup.pickupDate), 'MMM dd')}</span>
                         <span className="text-primary-600 font-bold block text-base">${pickup.estimatedPrice}</span>
                       </div>
                    </div>
                    
                    {routes[pickup._id] ? (
                      <div className="flex justify-between items-center bg-sky-50 p-2.5 rounded-lg border border-sky-100 text-sky-800">
                        <div className="flex items-center gap-2">
                          <Navigation className="w-4 h-4" />
                          <span className="font-bold">{routes[pickup._id].distance}</span>
                        </div>
                        <span className="font-medium text-xs text-sky-600">Est. {routes[pickup._id].time} drive</span>
                      </div>
                    ) : (
                      <button onClick={() => loadRoute(pickup)} className="w-full text-center text-primary-600 font-medium text-sm py-2 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <Map className="w-4 h-4" /> View on Map
                      </button>
                    )}
                  </div>

                  {activeTab === 'nearby' ? (
                    <button onClick={() => handleAccept(pickup._id)} className="btn-primary w-full py-2.5 mt-auto shadow-sm font-bold flex items-center justify-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" /> Accept Pickup
                    </button>
                  ) : (
                    <button onClick={() => handleComplete(pickup._id)} className="btn-primary w-full py-2.5 mt-auto shadow-sm font-bold flex items-center justify-center gap-2 text-sm bg-blue-600 hover:bg-blue-700">
                      <CheckCircle className="w-4 h-4" /> Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Sticky Map */}
      <div className="hidden lg:block lg:w-1/2 xl:w-3/5 p-4 sm:p-8 lg:pl-0 h-[calc(100vh-64px)] sticky top-[64px]">
        <div className="h-full w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
           <MapView 
             recyclerLoc={location} 
             targetLoc={selectedPickup ? { lat: selectedPickup.location.coordinates[1], lng: selectedPickup.location.coordinates[0] } : null}
             routeGeometry={selectedPickup && routes[selectedPickup._id] ? routes[selectedPickup._id].geometry : null}
           />
        </div>
      </div>

    </div>
  );
};

export default RecyclerDashboard;
