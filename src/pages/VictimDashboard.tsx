import React, { useState } from 'react';
import { Phone, Bell, Package, UserCircle, LogOut, AlertTriangle, MapPin, Map, Navigation, ArrowLeft } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../config';
import toast from 'react-hot-toast';
import type { SupplyRequest } from '../types';
import { useNavigate } from 'react-router-dom';

type DisasterAlert = {
  id: string;
  type: string;
  location: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
};

function VictimDashboard() {
  const [showSupplyForm, setShowSupplyForm] = useState(false);
  const [supplyRequest, setSupplyRequest] = useState({
    food: false,
    water: false,
    medicine: false,
    shelter: false,
    clothing: false,
    quantity: 1,
    notes: ''
  });
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<DisasterAlert[]>([
    {
      id: '1',
      type: 'Flood Warning',
      location: 'Raipur Central',
      severity: 'high',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      type: 'Road Blockage',
      location: 'NH-6 Highway',
      severity: 'medium',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleEmergencyCall = () => {
    const emergencyNumber = EMERGENCY_CONTACTS[0].phone;
    window.location.href = `tel:${emergencyNumber}`;
    toast.success('Connecting to emergency services...');
  };

  const handleSupplyRequest = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Supply request submitted successfully');
    console.log('Supply Request:', supplyRequest);
    // Reset form
    setSupplyRequest({
      food: false,
      water: false,
      medicine: false,
      shelter: false,
      clothing: false,
      quantity: 1,
      notes: ''
    });
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleNotificationClick = (notification: DisasterAlert) => {
    toast.info(`Viewing ${notification.type} at ${notification.location}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
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
              <UserCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-xl font-bold text-gray-900">Victim Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
          {/* Emergency Alert Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h2 className="text-lg font-semibold">Emergency Alert</h2>
            </div>
            <button className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Request Emergency Help
            </button>
          </div>

          {/* Location Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="h-6 w-6 text-blue-500" />
              <h2 className="text-lg font-semibold">Current Location</h2>
            </div>
            <p className="text-gray-600">Your location is being tracked for emergency services</p>
          </div>

          {/* Emergency Contacts Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <Phone className="h-6 w-6 text-green-500" />
              <h2 className="text-lg font-semibold">Emergency Contacts</h2>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">Emergency: 112</p>
              <p className="text-gray-600">Ambulance: 108</p>
              <p className="text-gray-600">Fire: 101</p>
            </div>
          </div>

          {/* Add Live Disaster Map Card - Make it span 2 columns */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Map className="h-6 w-6 text-blue-500" />
                <h2 className="text-lg font-semibold">Live Disaster Map</h2>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Bell className="h-6 w-6 text-yellow-500" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-3">Disaster Alerts</h3>
                      <div className="space-y-3">
                        {notifications.map((notification) => (
                          <button
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors border"
                          >
                            <div className="flex items-start space-x-3">
                              <AlertTriangle className={`h-5 w-5 ${
                                notification.severity === 'high' ? 'text-red-500' :
                                notification.severity === 'medium' ? 'text-yellow-500' :
                                'text-blue-500'
                              }`} />
                              <div>
                                <p className="font-medium">{notification.type}</p>
                                <p className="text-sm text-gray-600">{notification.location}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(notification.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Map Container */}
            <div className="relative h-[400px] rounded-lg overflow-hidden border-2 border-gray-200">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.904229029056!2d81.63011007597638!3d21.25007997978432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dda23be27041%3A0x9b7e6ed1ed97807b!2sRaipur%2C%20Chhattisgarh!5e0!3m2!1sen!2sin!4v1699432008370!5m2!1sen!2sin"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Disaster Map"
              />
              <button
                onClick={() => {
                  // In a real app, this would center the map on user's location
                  toast.info('Centering map on your location');
                }}
                className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md flex items-center space-x-2 hover:bg-gray-50 transition-colors"
              >
                <Navigation className="h-4 w-4 text-blue-500" />
                <span>Center on my location</span>
              </button>
            </div>
          </div>

          {/* Supply Request Card - Full Width */}
          <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <Package className="h-6 w-6 text-purple-500" />
              <h2 className="text-lg font-semibold">Request Supplies</h2>
            </div>
            
            <form onSubmit={handleSupplyRequest} className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {['Food', 'Water', 'Medicine', 'Shelter', 'Clothing'].map((item) => (
                  <label
                    key={item}
                    className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      checked={supplyRequest[item.toLowerCase() as keyof typeof supplyRequest]}
                      onChange={(e) => setSupplyRequest(prev => ({
                        ...prev,
                        [item.toLowerCase()]: e.target.checked
                      }))}
                    />
                    <span className="ml-2 text-gray-700">{item}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity (Number of people)
                </label>
                <input
                  type="number"
                  min="1"
                  value={supplyRequest.quantity}
                  onChange={(e) => setSupplyRequest(prev => ({
                    ...prev,
                    quantity: parseInt(e.target.value)
                  }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  value={supplyRequest.notes}
                  onChange={(e) => setSupplyRequest(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))}
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Any specific requirements or details..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Submit Supply Request
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VictimDashboard;