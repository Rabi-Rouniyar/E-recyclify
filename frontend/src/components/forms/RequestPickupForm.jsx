import { useState } from 'react';
import api from '../../services/api';
import { UploadCloud, MapPin, Loader2 } from 'lucide-react';

const RequestPickupForm = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    productName: '',
    brandModel: '',
    estimatedPrice: '',
    pickupDate: '',
    pickupTime: '',
    phoneNumber: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [location, setLocation] = useState({ lng: null, lat: null });

  const todayDate = new Date().toISOString().split('T')[0];

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lng: position.coords.longitude,
            lat: position.coords.latitude,
          });
        },
        (err) => {
          setErrorMsg('Failed to get location. Please enable location services in your browser.');
        }
      );
    } else {
      setErrorMsg('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.lng || !location.lat) {
      setErrorMsg('Please set your location for pickup using the button below.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const data = new FormData();
      data.append('productName', formData.productName);
      data.append('brandModel', formData.brandModel);
      data.append('estimatedPrice', formData.estimatedPrice);
      data.append('pickupDate', formData.pickupDate);
      data.append('pickupTime', formData.pickupTime);
      data.append('phoneNumber', formData.phoneNumber);
      data.append('longitude', location.lng);
      data.append('latitude', location.lat);
      if (imageFile) {
        data.append('image', imageFile); // Attached file for Cloudinary upload
      }

      await api.post('/pickups', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      onSuccess();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto border-0 shadow-xl relative animate-fade-in">
      <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-6">New Pickup Request</h2>
      
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm text-center font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Item Name</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Broken Laptop"
              required
              minLength="2"
              maxLength="50"
              value={formData.productName}
              onChange={e => setFormData({...formData, productName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Brand / Model</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Dell XPS 13"
              required
              minLength="2"
              maxLength="50"
              value={formData.brandModel}
              onChange={e => setFormData({...formData, brandModel: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Estimated Condition Value ($)</label>
          <input 
            type="number" 
            className="input-field" 
            placeholder="0 if you just want to dispose"
            required
            min="0"
            value={formData.estimatedPrice}
            onChange={e => setFormData({...formData, estimatedPrice: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Preferred Pickup Date</label>
            <input 
              type="date" 
              className="input-field" 
              required
              min={todayDate}
              value={formData.pickupDate}
              onChange={e => setFormData({...formData, pickupDate: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Time Window</label>
            <select 
              className="input-field bg-white cursor-pointer" 
              required
              value={formData.pickupTime}
              onChange={e => setFormData({...formData, pickupTime: e.target.value})}
            >
              <option value="">Select a time...</option>
              <option value="Morning (9AM - 12PM)">Morning (9AM - 12PM)</option>
              <option value="Afternoon (12PM - 4PM)">Afternoon (12PM - 4PM)</option>
              <option value="Evening (4PM - 7PM)">Evening (4PM - 7PM)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contact Phone</label>
          <input 
            type="tel" 
            className="input-field" 
            placeholder="e.g. +1 555 123 4567"
            required
            pattern="^\+?[0-9\s\-()]{7,15}$"
            title="Please enter a valid phone number"
            value={formData.phoneNumber}
            onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
          />
        </div>

        {/* File & Location Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Item Photo</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  <UploadCloud className="w-8 h-8 mb-2 text-slate-400 group-hover:text-primary-500 transition-colors" />
                  <p className="text-sm text-slate-500 font-medium truncate w-full">
                    {imageFile ? imageFile.name : "Click to select image"}
                  </p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pickup Location</label>
            <button 
              type="button" 
              onClick={handleLocation}
              className={`w-full h-32 flex flex-col items-center justify-center border-2 rounded-xl transition ${location.lng ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-600'}`}
            >
              <MapPin className={`w-8 h-8 mb-2 ${location.lng ? 'text-primary-600 animate-bounce' : 'text-slate-400'}`} />
              <span className="font-medium text-sm">
                {location.lng ? 'Location Captured ✓' : 'Detect My Location'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-slate-100 mt-6">
          <button type="button" onClick={onCancel} className="btn-secondary px-6" disabled={loading}>Cancel</button>
          <button type="submit" className="btn-primary flex items-center gap-2 px-8" disabled={loading}>
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? 'Uploading...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestPickupForm;
