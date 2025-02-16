import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Users, UserCircle, Map } from 'lucide-react';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-4xl font-bold text-gray-900">
            Disaster Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive platform connecting victims, volunteers, and emergency services
            during critical situations. Get real-time updates, request assistance, and
            coordinate relief efforts efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <button
            onClick={() => navigate('/emergency-map')}
            className="group relative bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-purple-200"
          >
            <Map className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Emergency Map</h2>
            <p className="text-gray-600">
              View your location and nearby emergency services
            </p>
          </button>

          <button
            onClick={() => navigate('/victim/login')}
            className="group relative bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-red-200"
          >
            <UserCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Victim Login</h2>
            <p className="text-gray-600">
              Request assistance and access emergency services
            </p>
          </button>

          <button
            onClick={() => navigate('/volunteer/login')}
            className="group relative bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-green-200"
          >
            <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Volunteer Login</h2>
            <p className="text-gray-600">
              Join relief efforts and coordinate with teams
            </p>
          </button>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>For emergencies, please dial 911 immediately</p>
          <p className="mt-2">24/7 Disaster Management Hotline: 1-800-555-0123</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;