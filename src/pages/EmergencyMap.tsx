import React from 'react';
import { AlertTriangle, Phone, ArrowLeft } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../config';
import { useNavigate } from 'react-router-dom';

function EmergencyMap() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Back to Home"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="text-red-500" />
            Emergency Location Map
          </h1>
          <p className="text-gray-600 mt-2">
            View your current location and nearby emergency services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="md:col-span-2">
            <div className="w-full h-[500px] rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.904229029056!2d81.63011007597638!3d21.25007997978432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dda23be27041%3A0x9b7e6ed1ed97807b!2sRaipur%2C%20Chhattisgarh!5e0!3m2!1sen!2sin!4v1699432008370!5m2!1sen!2sin"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Emergency Location Map"
              />
            </div>
          </div>

          {/* Emergency Contacts Section */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency Contacts</h2>
              <div className="space-y-3">
                {EMERGENCY_CONTACTS.map((contact, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <Phone className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">{contact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button 
                  className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  onClick={() => window.open('tel:112')}
                >
                  <Phone className="w-5 h-5" />
                  Call Emergency Services
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmergencyMap; 