export interface User {
  id: string;
  email: string;
  role: 'victim' | 'volunteer';
  name: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface Notification {
  id: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  role: string;
}

export interface SupplyRequest {
  id: string;
  userId: string;
  items: {
    type: 'food' | 'water' | 'medicine';
    quantity: number;
    notes?: string;
  }[];
  status: 'pending' | 'approved' | 'delivered';
  timestamp: number;
}