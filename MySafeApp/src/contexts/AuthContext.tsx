/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  emergencyContacts: EmergencyContact[];
  profileImage?: string;
  bio?: string;
  location?: string;
  themeColor?: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  removeEmergencyContact: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.name && parsed.name.toLowerCase().includes('isaac')) {
          parsed.name = 'Sarah Jenkins';
          localStorage.setItem('user', JSON.stringify(parsed));
        }
        setUser(parsed);
      } catch {
        setUser(null);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    
    if (email === 'demo@womensafety.com' && password === 'demo123') {
      const demoUser: User = {
        id: '1',
        name: '',
        email: 'demo@womensafety.com',
        phone: '',
        emergencyContacts: []
      };
      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>) => {
    if (user) {
      const newContact: EmergencyContact = {
        ...contact,
        id: Date.now().toString()
      };
      const updatedUser = {
        ...user,
        emergencyContacts: [...user.emergencyContacts, newContact]
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const removeEmergencyContact = (id: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        emergencyContacts: user.emergencyContacts.filter(contact => contact.id !== id)
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      updateProfile,
      addEmergencyContact,
      removeEmergencyContact
    }}>
      {children}
    </AuthContext.Provider>
  );
};