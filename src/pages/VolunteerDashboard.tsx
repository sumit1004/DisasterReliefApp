import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Phone, Bell, Users, MapPin, LogOut, Clipboard, Package, Plus, X, Navigation, ArrowLeft } from 'lucide-react';
import { MAPBOX_TOKEN, EMERGENCY_CONTACTS } from '../config';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

mapboxgl.accessToken = MAPBOX_TOKEN;

const DUMMY_TEAM = {
  name: 'Emergency Response Team A',
  members: [
    { id: 1, name: 'John Doe', role: 'Team Lead', status: 'active' },
    { id: 2, name: 'Jane Smith', role: 'Medical Officer', status: 'active' },
    { id: 3, name: 'Mike Johnson', role: 'Logistics', status: 'on-break' }
  ]
};

// Add this type at the top of the file
type Supply = {
  id: number;
  type: string;
  available: number;
  allocated: number;
};

// Add these types at the top of the file after the Supply type
type Mission = {
  id: number;
  title: string;
  status: 'in-progress' | 'completed' | 'pending';
  priority: 'high' | 'medium' | 'low';
  description: string;
};

type Alert = {
  id: number;
  message: string;
  timestamp: string;
  type: 'warning' | 'emergency' | 'info';
};

function VolunteerDashboard() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const navigate = useNavigate();

  const [supplies, setSupplies] = useState([
    { id: 1, type: 'Food', available: 150, allocated: 100 },
    { id: 2, type: 'Water', available: 200, allocated: 150 },
    { id: 3, type: 'Medicine', available: 80, allocated: 45 },
    { id: 4, type: 'Shelter', available: 30, allocated: 25 },
    { id: 5, type: 'Clothing', available: 100, allocated: 60 }
  ]);

  // Add new state for add supply modal
  const [showAddSupplyModal, setShowAddSupplyModal] = useState(false);
  const [newSupply, setNewSupply] = useState({
    type: '',
    available: 0,
    allocated: 0
  });

  // Add these new states after other state declarations
  const [missions] = useState<Mission[]>([
    {
      id: 1,
      title: 'Medical Supply Distribution',
      status: 'in-progress',
      priority: 'high',
      description: 'Distribute medical supplies to Raipur General Hospital'
    },
    {
      id: 2,
      title: 'Food Package Delivery',
      status: 'pending',
      priority: 'medium',
      description: 'Deliver food packages to affected families in Sector 7'
    }
  ]);

  const [alerts] = useState<Alert[]>([
    {
      id: 1,
      message: 'Heavy rainfall expected in next 24 hours',
      timestamp: '2024-03-20 10:30 AM',
      type: 'warning'
    },
    {
      id: 2,
      message: 'Emergency medical supplies needed in Sector 4',
      timestamp: '2024-03-20 09:15 AM',
      type: 'emergency'
    },
    {
      id: 3,
      message: 'New volunteer training session tomorrow',
      timestamp: '2024-03-20 08:00 AM',
      type: 'info'
    }
  ]);

  // Add new state for tracking location loading and error states
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Add function to handle location updates
  const updateLocation = (position: GeolocationPosition) => {
    const { latitude: lat, longitude: lng } = position.coords;
    setLocation({ lat, lng });

    if (map.current) {
      map.current.setCenter([lng, lat]);
      
      // Remove existing markers if any
      const existingMarker = document.querySelector('.location-marker');
      if (existingMarker) {
        existingMarker.remove();
      }

      // Add new marker
      const el = document.createElement('div');
      el.className = 'location-marker';
      el.style.backgroundColor = '#2196F3';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';

      new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(map.current);

      // In a real app, you would send this to your backend
      console.log('Location updated:', { lat, lng });
      toast.success('Location updated successfully');
    }
  };

  // Modify the useEffect for map initialization
  useEffect(() => {
    if (!mapContainer.current) return;

    setIsLoadingLocation(true);
    setLocationError(null);

    // Initialize map with a default location first
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [81.6339, 21.2514], // Default to Raipur coordinates
      zoom: 12
    });

    // Get user's location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateLocation(position);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to get your location. Please enable location services.');
          toast.error('Unable to get your location');
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );

      // Set up continuous location watching
      const watchId = navigator.geolocation.watchPosition(
        updateLocation,
        (error) => {
          console.error('Error watching location:', error);
          toast.error('Lost location tracking');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );

      // Cleanup function
      return () => {
        navigator.geolocation.clearWatch(watchId);
        if (map.current) {
          map.current.remove();
        }
      };
    } else {
      setLocationError('Geolocation is not supported by your browser');
      toast.error('Geolocation is not supported by your browser');
      setIsLoadingLocation(false);
    }
  }, []);

  // Add function to handle manual location refresh
  const handleLocationRefresh = () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateLocation(position);
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError('Unable to get your location. Please enable location services.');
        toast.error('Unable to get your location');
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const handleEmergencyCall = () => {
    const emergencyNumber = EMERGENCY_CONTACTS[0].phone;
    window.location.href = `tel:${emergencyNumber}`;
    toast.success('Connecting to emergency services...');
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Add function to handle adding new supply
  const handleAddSupply = (e: React.FormEvent) => {
    e.preventDefault();
    setSupplies(prev => [...prev, {
      id: Date.now(),
      ...newSupply
    }]);
    setShowAddSupplyModal(false);
    setNewSupply({ type: '', available: 0, allocated: 0 });
    toast.success('New supply added successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Back to Home"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <Users className="h-8 w-8 text-green-500" />
              <h1 className="text-xl font-bold text-gray-900">Volunteer Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Active Missions Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <Clipboard className="h-6 w-6 text-green-500" />
              <h2 className="text-lg font-semibold">Active Missions</h2>
            </div>
            <div className="space-y-3">
              {missions.map(mission => (
                <div key={mission.id} className="border-l-4 border-green-500 pl-3 py-2">
                  <h3 className="font-medium text-gray-900">{mission.title}</h3>
                  <p className="text-sm text-gray-600">{mission.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      mission.priority === 'high' ? 'bg-red-100 text-red-800' :
                      mission.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {mission.priority.charAt(0).toUpperCase() + mission.priority.slice(1)} Priority
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      mission.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      mission.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {mission.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-6 w-6 text-blue-500" />
                <h2 className="text-lg font-semibold">Deployment Area</h2>
              </div>
              <button
                onClick={handleLocationRefresh}
                disabled={isLoadingLocation}
                className={`p-2 rounded-full hover:bg-gray-100 ${isLoadingLocation ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Navigation className={`h-4 w-4 text-blue-500 ${isLoadingLocation ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="space-y-2">
              {locationError ? (
                <p className="text-red-500 text-sm">{locationError}</p>
              ) : (
                <>
                  <p className="text-gray-900 font-medium">Raipur Region - Sector 7</p>
                  <p className="text-sm text-gray-600">Current Assignment: Medical Supply Distribution</p>
                  <div className="mt-2 text-sm">
                    <p className="text-gray-600">Coverage Area: 5km radius</p>
                    <p className="text-gray-600">Population: ~25,000</p>
                    <p className="text-gray-600">Active Volunteers: 12</p>
                    {location && (
                      <p className="text-gray-600">
                        Current Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Alerts Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="h-6 w-6 text-yellow-500" />
              <h2 className="text-lg font-semibold">Recent Alerts</h2>
            </div>
            <div className="space-y-3">
              {alerts.map(alert => (
                <div key={alert.id} className={`p-3 rounded-lg ${
                  alert.type === 'emergency' ? 'bg-red-50' :
                  alert.type === 'warning' ? 'bg-yellow-50' :
                  'bg-blue-50'
                }`}>
                  <p className="text-sm text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Supply Management Card - Full Width */}
          <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Package className="h-6 w-4 text-purple-500" />
                <h2 className="text-lg font-semibold">Supply </h2>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddSupplyModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Supply
                </button>
                <button
                  onClick={() => toast.success('Supply data updated')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Inventory
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supply Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Available
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Allocated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {supplies.map((supply) => (
                    <tr key={supply.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{supply.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{supply.available} units</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{supply.allocated} units</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          supply.available > supply.allocated * 1.5
                            ? 'bg-green-100 text-green-800'
                            : supply.available > supply.allocated
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {supply.available > supply.allocated * 1.5
                            ? 'Well Stocked'
                            : supply.available > supply.allocated
                            ? 'Moderate'
                            : 'Low Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add Supply Modal */}
      {showAddSupplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Supply</h3>
              <button
                onClick={() => setShowAddSupplyModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSupply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Supply Type
                </label>
                <input
                  type="text"
                  required
                  value={newSupply.type}
                  onChange={(e) => setNewSupply(prev => ({
                    ...prev,
                    type: e.target.value
                  }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="e.g., Food, Water, Medicine"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Available Units
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newSupply.available}
                  onChange={(e) => setNewSupply(prev => ({
                    ...prev,
                    available: parseInt(e.target.value)
                  }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Allocated Units
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newSupply.allocated}
                  onChange={(e) => setNewSupply(prev => ({
                    ...prev,
                    allocated: parseInt(e.target.value)
                  }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Supply
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSupplyModal(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default VolunteerDashboard;